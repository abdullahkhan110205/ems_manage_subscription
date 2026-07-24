"use client";


export default function SubscriptionCard({

    isPremium,

}: {

    isPremium: boolean;

}) {


    if (!isPremium) {

        return null;

    }



    return (

        <div
            className="
            bg-green-50
            border
            border-green-200
            rounded-lg
            p-4
            text-center
            "
        >

            <div className="text-green-700 font-bold">

                ✅ Premium Plan

            </div>


            <div className="text-sm text-gray-600 mt-2">

                Active

            </div>


            <div className="text-xs text-gray-500 mt-1">

                Renews automatically

            </div>


        </div>

    );

}