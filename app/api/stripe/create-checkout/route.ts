import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";


export async function POST() {

    try {

        const session = await auth();


        console.log("SESSION:", session);


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


        console.log(
            "STRIPE KEY EXISTS:",
            !!process.env.STRIPE_SECRET_KEY
        );


        console.log(
            "PRICE ID:",
            process.env.STRIPE_PRICE_ID
        );



        const checkoutSession =
            await stripe.checkout.sessions.create({

                mode: "subscription",


                line_items: [
                    {
                        price: process.env.STRIPE_PRICE_ID!,
                        quantity: 1,
                    }
                ],


                metadata: {

                    userId: session.user.id,

                },


                success_url:
                "http://localhost:3000/employee/dashboard?success=true",


                cancel_url:
                "http://localhost:3000/employee/dashboard?cancelled=true",


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
                error: error.message
            },

            {
                status:500
            }

        );

    }

}