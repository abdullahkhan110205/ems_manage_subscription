"use client";

import SubscribeButton from "./SubscribeButton";

interface SubscriptionCardProps {
  subscriptionPlan?: string;

  name?: string;
  price?: string;
  plan?: "basic" | "pro";
  currentPlan?: string;
}


export default function SubscriptionCard({
  subscriptionPlan,
  name,
  price,
  plan,
  currentPlan,
}: SubscriptionCardProps) {


  // Employee sidebar / current subscription display
  if (subscriptionPlan !== undefined) {

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
          ✅ {subscriptionPlan} Plan
        </div>


        <div className="text-sm text-gray-600 mt-2">
          Active
        </div>


        {
          subscriptionPlan !== "FREE" && (

            <div className="text-xs text-gray-500 mt-1">
              Renews automatically
            </div>

          )
        }


      </div>
    );
  }



  // Pricing cards on subscription page
  return (

    <div
      className="
      border
      rounded-xl
      p-6
      text-center
      shadow-sm
      "
    >

      <h2 className="text-xl font-bold">
        {name}
      </h2>


      <p className="text-gray-600 mt-2">
        {price}/month
      </p>



      {
        currentPlan?.toLowerCase() === plan ? (

          <div
            className="
            mt-4
            bg-green-50
            text-green-700
            p-2
            rounded-lg
            "
          >
            Active Plan
          </div>

        ) : (

          <div className="mt-4">

            <SubscribeButton
              plan={plan!}
            />

          </div>

        )
      }


    </div>

  );

}