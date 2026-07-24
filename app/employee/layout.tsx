import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import UpgradeButton from "@/components/UpgradeButton";
import { auth } from "@/lib/auth";
import LockedNavItem from "@/components/LockedNavItem";
import SubscriptionCard from "@/components/SubscriptionCard";


export default async function EmployeeLayout({

    children,

}: {

    children: React.ReactNode;

}) {


    const session = await auth();


    const isPremium =
        session?.user?.subscriptionStatus === "ACTIVE";



    return (

        <div className="min-h-screen flex bg-gray-100">



            {/* Sidebar */}

            <aside className="w-64 h-screen overflow-y-auto bg-white shadow-lg p-5 flex flex-col">



                <h1 className="text-2xl font-bold text-green-600 mb-8">

                    EMS Employee

                </h1>





                <nav className="space-y-3 flex-1">



                    <Link

                        href="/employee/dashboard"

                        className="text-gray-900 block p-3 rounded hover:bg-gray-400"

                    >

                        🏠 Dashboard

                    </Link>





                    <Link

                        href="/employee/profile"

                        className="text-gray-900 block p-3 rounded hover:bg-gray-400"

                    >

                        👤 My Profile

                    </Link>





                    <Link

                        href="/employee/attendance"

                        className="text-gray-900 block p-3 rounded hover:bg-gray-400"

                    >

                        📅 Attendance

                    </Link>





                    <Link

                        href="/employee/leaves"

                        className="text-gray-900 block p-3 rounded hover:bg-gray-400"

                    >

                        📋 Leaves

                    </Link>





                    <LockedNavItem

                        href="/employee/projects"

                        label="📂 My Projects"

                        locked={!isPremium}

                    />





                    <LockedNavItem

                        href="/employee/payroll"

                        label="💰 Payroll"

                        locked={!isPremium}

                    />





                    {/* Subscription Page */}

                    <Link

                        href="/employee/subscription"

                        className="text-gray-900 block p-3 rounded hover:bg-gray-400"

                    >

                        ⭐ Subscription

                    </Link>



                </nav>







                {/* Subscription Status */}

                <div className="text-gray-900 mt-6">


                    {
                        isPremium ? (

                            <SubscriptionCard

                                isPremium={true}

                            />


                        ) : (


                            <UpgradeButton />


                        )
                    }


                </div>







                {/* Logout */}

                <div className="mt-3">

                    <LogoutButton />

                </div>



            </aside>







            {/* Content */}

            <main className="flex-1 p-6">

                {children}

            </main>





        </div>

    );

}