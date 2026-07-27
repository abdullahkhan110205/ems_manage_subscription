"use client";

import { useState } from "react";


export default function CancelSubscriptionButton(){

    const [loading,setLoading] = useState(false);



    async function cancelSubscription(){

        try{

            setLoading(true);


            const res =
                await fetch(
                    "/api/stripe/cancel-subscription",
                    {
                        method:"POST"
                    }
                );


            const data =
                await res.json();



            if(data.url){

                window.location.href=data.url;

            }


        }
        catch(error){

            console.error(error);

        }
        finally{

            setLoading(false);

        }

    }



    return (

        <button

            onClick={cancelSubscription}

            disabled={loading}

            className="
            bg-red-600
            text-white
            px-4
            py-2
            rounded-lg
            hover:bg-red-700
            "

        >

        {
            loading
            ?
            "Opening..."
            :
            "Cancel Subscription"
        }

        </button>

    );

}