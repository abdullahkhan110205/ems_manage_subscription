"use client";

import { useState } from "react";

interface SubscribeButtonProps {
  plan: "basic" | "pro";
}

export default function SubscribeButton({
  plan,
}: SubscribeButtonProps) {

  const [loading, setLoading] = useState(false);


  async function handleSubscribe() {

    
    try {

      setLoading(true);


      const response = await fetch(
        "/api/stripe/create-checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.error || "Something went wrong"
        );

      }


     if (data.url) {

    window.location.href = data.url;

}
else {

    window.location.reload();

}


    } catch(error: any) {

      console.error(error);

      alert(error.message);

    } finally {

      setLoading(false);

    }

  }



  return (

    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="
        bg-blue-600 
        text-white 
        px-5 
        py-2 
        rounded-lg
        hover:bg-blue-700
        disabled:opacity-50
      "
    >

      {loading 
        ? "Redirecting..." 
        : `Subscribe to ${plan}`
      }

    </button>

  );

}