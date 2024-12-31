import { useEffect } from "react";

import { usePathname } from "next/navigation";

import { TOKEN_TYPE_ENUM } from "@shared/schemas/auth/token-type.schema";
import { signOut, useSession } from "next-auth/react";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { isPrivatePath } from "@/lib/utils";

/**
 * This should be a temporary solution to check if the access token is expired.
 * next-auth currently does not support server-side signout.
 * More info https://github.com/nextauthjs/next-auth/discussions/5334
 * TODO: A better solution would be to use a middleware to check if the access token is expired!
 */
export default function SessionChecker() {
  const { data: session } = useSession();
  const queryKey = queryKeys.auth.validateToken(session?.accessToken).queryKey;
  const { error } = client.auth.validateToken.useQuery(
    queryKey,
    {
      query: {
        tokenType: TOKEN_TYPE_ENUM.ACCESS,
      },
      headers: {
        authorization: `Bearer ${session?.accessToken}`,
      },
    },
    {
      queryKey,
      enabled: !!session?.accessToken,
    },
  );
  const pathname = usePathname();

  useEffect(() => {
    if (error && isPrivatePath(pathname)) {
      signOut({
        redirect: true,
        callbackUrl: isPrivatePath(pathname) ? "/auth/signin" : undefined,
      });
    }
  }, [error, pathname]);

  return null;
}
