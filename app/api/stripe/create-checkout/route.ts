import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function POST(request: Request) {

    try {

        const session = await auth();


        if (!session?.user?.id) {

            return Response.json(
                {
                    error: "User not authenticated"
                },
                {
                    status: 401
                }
            );

        }


        const body = await request.json();

        const plan = body.plan;



        let priceId;


        if (plan === "basic") {

            priceId = process.env.STRIPE_BASIC_PRICE_ID;

        } 
        else if (plan === "pro") {

            priceId = process.env.STRIPE_PRO_PRICE_ID;

        } 
        else {

            return Response.json(
                {
                    error: "Invalid plan selected"
                },
                {
                    status: 400
                }
            );

        }



        const user = await prisma.user.findUnique({

            where:{
                id: session.user.id
            }

        });



        if (!user) {

            return Response.json(
                {
                    error:"User not found"
                },
                {
                    status:404
                }
            );

        }





        /*
            CREATE STRIPE CUSTOMER IF NOT EXISTS
        */


        let customerId = user.stripeCustomerId;



        if (!customerId) {


            const customer =
                await stripe.customers.create({

                    email:user.email!,

                    metadata:{
                        userId:user.id
                    }

                });



            customerId = customer.id;



            await prisma.user.update({

                where:{
                    id:user.id
                },

                data:{
                    stripeCustomerId:customerId
                }

            });

        }







        /*
            EXISTING SUBSCRIBER
            UPDATE SUBSCRIPTION
        */


        if (
            user.stripeSubscriptionId &&
            user.subscriptionStatus === "ACTIVE"
        ) {


            const subscription =
                await stripe.subscriptions.retrieve(
                    user.stripeSubscriptionId
                );



            const subscriptionItemId =
                subscription.items.data[0].id;



            const updatedSubscription =
                await stripe.subscriptions.update(

                    user.stripeSubscriptionId,

                    {

                        items:[
                            {
                                id:subscriptionItemId,

                                price:priceId

                            }
                        ],


                        proration_behavior:
                            "create_prorations"

                    }

                );



            /*
                UPDATE DATABASE IMMEDIATELY
            */


            await prisma.user.update({

                where:{
                    id:user.id
                },

                data:{
                    subscriptionStatus:"ACTIVE",
                    subscriptionPlan: plan
                }

            });



            return Response.json({

                message:
                    "Subscription updated successfully",

                subscription:
                    updatedSubscription

            });


        }







        /*
            FIRST TIME SUBSCRIBER
            CREATE CHECKOUT SESSION
        */


        const checkoutSession =
            await stripe.checkout.sessions.create({

                customer:customerId,


                mode:"subscription",


                line_items:[

                    {

                        price:priceId,

                        quantity:1

                    }

                ],


                metadata:{

                    userId:user.id,

                    plan:plan

                },


                subscription_data:{

                    metadata:{

                        userId:user.id,

                        plan:plan

                    }

                },


                success_url:
                `${process.env.NEXTAUTH_URL}/employee/dashboard?success=true`,


                cancel_url:
                `${process.env.NEXTAUTH_URL}/employee/dashboard?cancelled=true`

            });





        console.log(
            "CHECKOUT SESSION:",
            checkoutSession.id
        );



        return Response.json({

            url:checkoutSession.url

        });



    } catch(error:any) {


        console.error(
            "FULL STRIPE ERROR:",
            error
        );


        return Response.json(

            {
                error:error.message
            },

            {
                status:500
            }

        );

    }

}