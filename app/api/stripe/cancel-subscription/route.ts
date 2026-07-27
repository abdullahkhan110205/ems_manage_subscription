import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";


export async function POST() {

    try {

        const session = await auth();


        if (!session?.user?.id) {

            return NextResponse.json(
                {
                    error:"Unauthorized"
                },
                {
                    status:401
                }
            );

        }



        const user = await prisma.user.findUnique({

            where:{
                id: session.user.id
            }

        });



        if(!user?.stripeCustomerId){

            return NextResponse.json(
                {
                    error:"No active subscription found"
                },
                {
                    status:400
                }
            );

        }



        const portalSession =
            await stripe.billingPortal.sessions.create({

                customer:user.stripeCustomerId,

                return_url:
`${process.env.NEXTAUTH_URL}/employee/subscription`

            });



        return NextResponse.json({

            url:portalSession.url

        });


    }
    catch(error:any){

        console.error(
            "CANCEL PORTAL ERROR:",
            error
        );


        return NextResponse.json(
            {
                error:error.message
            },
            {
                status:500
            }
        );

    }

}