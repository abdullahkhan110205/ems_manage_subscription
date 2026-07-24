import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";


const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET!;



export async function POST(
    request: NextRequest
) {

    const body =
        await request.text();


    const signature =
        request.headers.get(
            "stripe-signature"
        )!;



    let event: Stripe.Event;



    try {


        event =
            stripe.webhooks.constructEvent(

                body,

                signature,

                webhookSecret

            );


    } catch (error) {


        console.error(
            "Webhook signature verification failed",
            error
        );


        return new NextResponse(
            "Webhook Error",
            {
                status:400
            }
        );

    }




    if (
        event.type ===
        "checkout.session.completed"
    ) {


        const session =
    event.data.object as Stripe.Checkout.Session;



        const userId =
            session.metadata?.userId;



        const subscriptionId =
            session.subscription as string;



        const customerId =
            session.customer as string;



        if (!userId) {


            console.error(
                "No userId found in metadata"
            );


            return NextResponse.json({
                received:true
            });

        }




        await prisma.user.update({

            where:{
                id:userId
            },


            data:{


                subscriptionStatus:
                    "ACTIVE",


                stripeCustomerId:
                    customerId,


                stripeSubscriptionId:
                    subscriptionId,


            }

        });



        console.log(
            "Subscription activated for:",
            userId
        );


    }




    return NextResponse.json({
        received:true
    });

}