import { cookies } from "next/headers";

import { UserWithAccessToken } from "@shared/dtos/users/user.dto";
import { LogInSchema } from "@shared/schemas/auth/login.schema";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession, NextAuthOptions } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import setCookieParser from "set-cookie-parser";

import { client } from "@/lib/query-client";

declare module "next-auth" {
  interface Session {
    user: UserWithAccessToken["user"];
    accessToken: UserWithAccessToken["accessToken"];
  }

  interface User extends UserWithAccessToken {}
}

declare module "next-auth/jwt" {
  interface JWT {
    user: UserWithAccessToken["user"];
    accessToken: UserWithAccessToken["accessToken"];
  }
}

export const config = {
  providers: [
    Credentials({
      // @ts-expect-error - why is so hard to type this?
      authorize: async (credentials) => {
        let access: UserWithAccessToken | null = null;

        const { email, password } = await LogInSchema.parseAsync(credentials);
        const response = await client.auth.login.mutation({
          body: {
            email,
            password,
          },
        });

        // Check if adminjs was set in the response
        const setCookieHeader = response.headers.get("set-cookie");
        if (setCookieHeader !== null) {
          const parsedCookies = setCookieParser.parse(setCookieHeader, {
            map: false,
          });

          const cookieStore = cookies();
          for (const parsed of parsedCookies) {
            cookieStore.set(parsed.name, parsed.value, {
              httpOnly: parsed.httpOnly,
              secure: parsed.secure,
              path: parsed.path,
              sameSite: parsed.sameSite?.toLowerCase() as
                | "lax"
                | "strict"
                | "none",
              expires: parsed.expires,
              maxAge: parsed.maxAge,
            });
          }
        }

        if (response.status === 201) {
          access = response.body;
        }

        if (!access) {
          if (response.status === 401) {
            throw new Error(
              response.body.errors?.[0]?.title || "Invalid credentials",
            );
          }
        }

        return access;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user: access, trigger, session }) {
      if (access) {
        token.user = access.user;
        token.accessToken = access.accessToken;
      }

      if (trigger === "update") {
        token.user.email = session.email;
      }

      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: token.user,
        accessToken: token.accessToken,
      };
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/",
  },
} as NextAuthOptions;

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
