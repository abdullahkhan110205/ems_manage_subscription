"use client";

import Link from "next/link";


export default function LockedNavItem({

    href,
    label,
    locked,

}: {

    href: string;
    label: React.ReactNode;
    locked: boolean;

}) {


    if (locked) {

        return (

            <div className="relative group">


                <div

                    className="
                    text-gray-400
                    block
                    p-3
                    rounded
                    cursor-not-allowed
                    "

                >

                    {label} 🔒

                </div>



                <div

                    className="
                    absolute
                    left-full
                    top-0
                    ml-3
                    hidden
                    group-hover:block
                    bg-black
                    text-white
                    text-sm
                    px-3
                    py-2
                    rounded
                    whitespace-nowrap
                    z-50
                    "

                >

                    Upgrade to Premium to unlock

                </div>


            </div>

        );

    }



    return (

        <Link

            href={href}

            className="
            text-gray-900
            block
            p-3
            rounded
            hover:bg-gray-400
            "

        >

            {label}

        </Link>

    );

}