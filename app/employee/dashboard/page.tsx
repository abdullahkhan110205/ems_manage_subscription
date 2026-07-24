"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function EmployeeDashboard() {


  const { data: session, status } = useSession();

  const router = useRouter();


  const [employeeData, setEmployeeData] = useState<any>(null);

  const [loadingData, setLoadingData] = useState(true);




  async function loadEmployeeData(){


    const res = await fetch(
      "/api/employee/dashboard"
    );


    const data = await res.json();


    setEmployeeData(data);

    setLoadingData(false);


  }





  useEffect(() => {


    if(status === "unauthenticated"){

      router.push("/login");

    }



    if(status === "authenticated"){

      loadEmployeeData();

    }


  },[status,router]);







  if(status === "loading" || loadingData){

    return (

      <div className="min-h-screen flex items-center justify-center">

        <p className="text-gray-500">
          Loading...
        </p>

      </div>

    );

  }






  return (

    <div className="bg-gray-100">


      {/* Navbar */}

      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">


        <h1 className="text-xl font-bold text-green-600">

          EMS — Employee Portal

        </h1>



        <div className="flex items-center gap-4">


          <span className="text-sm text-gray-600">

            👋 {employeeData?.name || session?.user?.name}

          </span>



          <button

            onClick={() => signOut({callbackUrl:"/login"})}

            className="bg-red-500 text-white px-4 py-1.5 rounded-lg"

          >

            Sign Out

          </button>


        </div>


      </nav>






      {/* Stats */}


      <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">


        {[
  { 
    label: "Days Present", 
    value: employeeData?.attendanceDays ?? 0, 
    color: "bg-green-500" 
  },

  { 
    label: "Leaves Taken", 
    value: employeeData?.leavesTaken ?? 0, 
    color: "bg-yellow-500" 
  },

  { 
    label: "Pending Requests", 
    value: employeeData?.pendingLeaves ?? 0, 
    color: "bg-blue-500" 
  },
].map((stat)=>(


          <div

          key={stat.label}

          className="bg-white rounded-xl shadow p-5 flex items-center gap-4"

          >


            <div

            className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}

            >

              {stat.value}

            </div>



            <p className="text-gray-600 font-medium">

              {stat.label}

            </p>


          </div>


        ))}


      </div>







      {/* Employee Details */}


      <div className="p-6">


        <div className="text-gray-900 bg-white rounded-xl shadow p-6">


          <h2 className="text-gray-900 text-xl font-bold mb-4">

            My Details

          </h2>



          <p>
            Department: {employeeData?.department}
          </p>


          <p>
            Position: {employeeData?.position}
          </p>



          <p>

            Joining Date:

            {
              employeeData &&
              new Date(employeeData.joinedAt)
              .toLocaleDateString()
            }

          </p>



          <p>
            Salary: {employeeData?.salary}
          </p>



        </div>


      </div>







      {/* Payroll History */}


      <div className="px-6 pb-6">


        <h2 className="text-gray-900 text-2xl font-bold mb-4">

          Payroll History

        </h2>




        <table className="text-gray-900 w-full bg-white border">


          <thead>

            <tr>


              <th className="border p-2">
                Date
              </th>


              <th className="border p-2">
                Basic
              </th>


              <th className="border p-2">
                Bonus
              </th>


              <th className="border p-2">
                Deductions
              </th>


              <th className="border p-2">
                Net Salary
              </th>


            </tr>

          </thead>





          <tbody>


          {
            employeeData?.payrolls?.map(
              (pay:any)=>(


                <tr key={pay.id}>


                  <td className="border p-2">

                    {
                      new Date(pay.billingDate)
                      .toLocaleDateString()
                    }

                  </td>


                  <td className="border p-2">
                    {pay.basicSalary}
                  </td>


                  <td className="border p-2">
                    {pay.bonus}
                  </td>


                  <td className="border p-2">
                    {pay.deductions}
                  </td>


                  <td className="border p-2">
                    {pay.netSalary}
                  </td>


                </tr>


              )

            )
          }


          </tbody>


        </table>


      </div>





      {/* Quick Links */}


      <div className=" text-gray-900 px-6 pb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">


        {[
          {label:"My Profile",href:"/employee/profile",emoji:"👤"},
          {label:"Request Leave",href:"/employee/leaves",emoji:"📋"},
          {label:"My Attendance",href:"/employee/attendance",emoji:"📅"}

        ].map((link)=>(


          <button

          key={link.label}

          onClick={()=>router.push(link.href)}

          className="bg-white rounded-xl shadow p-6 text-left"

          >

            <div className="text-3xl mb-2">

              {link.emoji}

            </div>


            <p className="font-semibold">

              {link.label}

            </p>


          </button>


        ))}


      </div>



    </div>

  );


}