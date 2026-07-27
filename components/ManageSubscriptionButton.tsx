"use client";

export default function ManageSubscriptionButton(){


    async function handleManage(){


        const res =
            await fetch(
                "/api/stripe/customer-portal",
                {
                    method:"POST"
                }
            );


        const data =
            await res.json();



        if(data.url){

            window.location.href =
                data.url;

        }


    }



    return (

        <button

            onClick={handleManage}

            className="
            bg-green-600
            text-white
            px-5
            py-3
            rounded-lg
            hover:bg-green-700
            "

        >

            Manage Subscription

        </button>

    );


}