import { auth } from "@/lib/auth";
import SubscriptionCard from "@/components/SubscriptionCard";
import ManageSubscriptionButton from "@/components/ManageSubscriptionButton";
import CancelSubscriptionButton from "@/components/CancelSubscriptionButton";


export default async function SubscriptionPage() {


    const session = await auth();


    const currentPlan =
        session?.user?.subscriptionPlan || "FREE";



    return (

        <div className="p-8">


            <h1 className="text-gray-900 text-3xl font-bold mb-6">
                Subscription Plans
            </h1>



            {/* Current Plan */}

            <div className="mb-8">

                <h2 className="text-gray-500 text-xl font-semibold mb-3">
                    Current Plan
                </h2>


                <div
                    className="
                    bg-green-50
                    border
                    border-green-200
                    rounded-lg
                    p-5
                    "
                >

                    <div className="text-green-700 font-bold text-xl">

                         {currentPlan}

                    </div>


                    <p className="text-gray-600 mt-2">

                        Subscribed

                    </p>


                </div>


            </div>





            {/* Manage buttons */}

            {
                currentPlan !== "FREE" && (

                    <div className="flex gap-3 mb-8">

                        <ManageSubscriptionButton />

                        <CancelSubscriptionButton />

                    </div>

                )
            }






            {/* Plans */}

            <div className=" text-gray-900 grid md:grid-cols-2 gap-6">


                <SubscriptionCard

                    name="Basic"

                    price="$3.00"

                    plan="basic"

                    currentPlan={currentPlan}

                />



                <SubscriptionCard

                    name="Pro"

                    price="$5.00"

                    plan="pro"

                    currentPlan={currentPlan}

                />


            </div>


        </div>

    );

}