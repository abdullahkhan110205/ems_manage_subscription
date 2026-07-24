import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";



export const { handlers, signIn, signOut, auth } = NextAuth({

  ...authConfig,

  adapter: PrismaAdapter(prisma),

  trustHost: true,


  session: {

    strategy: "jwt",

  },


  providers: [


    GoogleProvider({

      clientId: process.env.GOOGLE_CLIENT_ID!,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      allowDangerousEmailAccountLinking: true,

    }),



    FacebookProvider({

      clientId: process.env.FACEBOOK_CLIENT_ID!,

      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,

    }),




    CredentialsProvider({

      name: "Credentials",


      credentials: {


        email: {

          label: "Email",

          type: "email",

        },


        password: {

          label: "Password",

          type: "password",

        },


      },



      async authorize(credentials) {


        if (!credentials?.email || !credentials?.password) {

          return null;

        }



        const user = await prisma.user.findUnique({

          where: {

            email: credentials.email as string,

          },

        });



        if (!user || !user.password) {

          return null;

        }



        const passwordMatch = await bcrypt.compare(

          credentials.password as string,

          user.password

        );



        if (!passwordMatch) {

          return null;

        }




        return {


          id: user.id,

          name: user.name,

          email: user.email,

          role: user.role,

          subscriptionStatus: user.subscriptionStatus,


        };


      },


    }),


  ],





  callbacks: {



    async signIn({ user }) {


      console.log(
        "Google/User login:",
        user
      );


      return true;


    },






    async jwt({ token, user }) {

  // First login
  if (user) {
    token.id = user.id;
    token.role = user.role;
    token.subscriptionStatus = user.subscriptionStatus;
  }

  // Always refresh from database
  if (token.email) {

    const dbUser = await prisma.user.findUnique({
      where: {
        email: token.email,
      },
    });

    if (dbUser) {
      token.role = dbUser.role;
      token.subscriptionStatus = dbUser.subscriptionStatus;
    }

  }

  return token;

},






    async session({ session, token }) {



      if (session.user) {



        session.user.id =
          token.id as string;



        session.user.role =
          token.role as string;



        session.user.subscriptionStatus = token.subscriptionStatus as string;



      }



      return session;


    },






    async redirect({ url }) {


      return url;


    },


  },


});