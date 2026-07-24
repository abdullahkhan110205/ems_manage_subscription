"use client";

import { useState } from "react";

export default function UpgradeButton() {

    const [loading, setLoading] = useState(false);


    async function handleUpgrade() {

        console.log("Upgrade button clicked");
        try {

            setLoading(true);


            const res = await fetch(
                "/api/stripe/create-checkout",
                {
                    method: "POST",
                }
            );


            const data = await res.json();


            if (data.url) {

                window.location.href = data.url;

            }


        } catch (error) {

            console.error("Stripe checkout error:", error);

        } finally {

            setLoading(false);
        }

    }



    return (

        <button

            onClick={handleUpgrade}

            disabled={loading}

            className="
            w-full
            text-left
            block
            p-3
            rounded
            bg-green-600
            text-white
            hover:bg-green-700
            transition
            "

        >

            ⭐ {loading ? "Opening..." : "Upgrade Premium"}

        </button>

    );

}