import { UserWithAccessToken } from "@shared/dtos/users/user.dto";

import { getServerAuthUrl } from "./server";

/**
 * Determines the auth API URL based on the execution environment.
 * Returns an absolute URL when running server-side, and a relative path for client-side.
 * @returns {string} The auth API URL
 */
async function getAuthUrl(): Promise<string> {
  const path = "auth/api";

  if (typeof window === "undefined") {
    return await getServerAuthUrl();
  }

  return `/${path}`;
}

/**
 * Authenticates a user by sending a POST request to the signin endpoint.
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @returns {Promise<UserWithAccessToken>} The authenticated user data with access token
 * @throws Will throw an error if the authentication fails
 */
export async function signIn(
  email: string,
  password: string,
): Promise<UserWithAccessToken> {
  try {
    const baseUrl = await getAuthUrl();
    const response = await fetch(`${baseUrl}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Signs out the current user by making a POST request to the signout endpoint.
 * @returns {Promise<void>}
 */
export async function signOut(): Promise<void> {
  try {
    const baseUrl = await getAuthUrl();
    await fetch(`${baseUrl}/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error signing out", error);
  }
}
