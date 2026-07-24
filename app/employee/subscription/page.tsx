import { auth } from "@/lib/auth";

export default async function SubscriptionPage() {
  const session = await auth();

  return (
    <div className="max-w-3xl">

      <h1 className="text-gray-900 text-3xl font-bold mb-6">
        ⭐ Subscription
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <div className="space-y-4">

          <div>
            <p className=" text-gray-900">
              Current Plan
            </p>

            <p className=" text-blue-600 text-xl font-semibold">
              {session?.user.subscriptionStatus === "ACTIVE"
                ? "Premium"
                : "Free"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Status
            </p>

            <p
              className={`font-semibold ${
                session?.user.subscriptionStatus === "ACTIVE"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {session?.user.subscriptionStatus}
            </p>
          </div>

          <div className="pt-6">

            <button
              className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
            >
              Manage Subscription
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}