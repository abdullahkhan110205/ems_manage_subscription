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


        if(plan === "basic") {

            priceId = process.env.STRIPE_BASIC_PRICE_ID;

        } 
        else if(plan === "pro") {

            priceId = process.env.STRIPE_PRO_PRICE_ID;

        } 
        else {

            return Response.json(
                {
                    error:"Invalid plan selected"
                },
                {
                    status:400
                }
            );

        }



        const user = await prisma.user.findUnique({

            where:{
                id: session.user.id
            }

        });



        if(!user){

            return Response.json(
                {
                    error:"User not found"
                },
                {
                    status:404
                }
            );

        }



        // Create Stripe customer if user does not already have one

        let customerId = user.stripeCustomerId;



        if(!customerId){

            const customer = await stripe.customers.create({

                email: user.email!,

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
                    stripeCustomerId: customerId
                }

            });

        }




        const checkoutSession =
            await stripe.checkout.sessions.create({

                customer: customerId,


                mode:"subscription",


                line_items:[

                    {
                        price: priceId!,

                        quantity:1
                    }

                ],



                metadata:{

                    userId:user.id,

                    plan:plan

                },



                success_url:
                "${process.env.NEXTAUTH_URL}/employee/dashboard?success=true",



                cancel_url:
                "${process.env.NEXTAUTH_URL}/employee/dashboard?cancelled=true"


            });



        console.log(
            "CHECKOUT SESSION:",
            checkoutSession.id
        );



        return Response.json({

            url: checkoutSession.url

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