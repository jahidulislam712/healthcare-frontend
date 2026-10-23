import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

/**
 * Set Cookie to the Browser
 * @param name
 * @param token
 * @param maxAge
 */
const setCookie = async (name: string, token: string, maxAge: number) => {
  const cookieStore = await cookies();

  if (maxAge <= 0) {
    throw new Error("Invalid cookie maxAge");
  }

  cookieStore.set(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: Math.floor(maxAge),
  });
};

/**
 * Get token remaining time in seconds for setting to maxAge
 * @param token
 * @returns Number
 */
const getTokenSecondsRemaining = (token: string): number => {
  const payload = jwt.decode(token);

  if (
    !payload ||
    typeof payload !== "object" ||
    typeof payload.exp !== "number"
  ) {
    return 0;
  }

  // if negetive number then 0 is max
  return Math.max(payload.exp - Math.floor(Date.now() / 1000));
};

/**
 * Set token cokookies helper function
 * @param name
 * @param token
 */
export const setTokenInCookies = async (name: string, token: string) => {
  let maxAge;

  if (name === "better-auth.session_token") {
    maxAge = 24 * 60 * 60 * 30; // 30 days in minutes
  } else {
    maxAge = getTokenSecondsRemaining(token);
  }

  if (maxAge <= 0) {
    throw new Error(
      `Cannot set ${name}: Token has expired or has no valid expiry`,
    );
  }

  await setCookie(name, token, maxAge);
};
