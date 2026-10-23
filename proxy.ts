import { NextRequest, NextResponse } from "next/server";

type Role = "PATIENT" | "DOCTOR" | "ADMIN" | "SUPER_ADMIN";
type MeResponse = {
  data?: {
    role?: string;
  };
};

const isWithin = (path: string, section: string) => {
  return path === section || path.startsWith(`${section}/`);
};

const canVisit = (path: string, role: Role) => {
  if (isWithin(path, "/admin/dashboard"))
    return role === "ADMIN" || role === "SUPER_ADMIN";

  if (isWithin(path, "/doctor/dashboard")) return role === "DOCTOR";

  if (isWithin(path, "/dashboard")) return role === "PATIENT";

  return false;
};

function mergeCookieHeader(
  existingCookieHeader: string,
  setCookieHeaders: string[],
) {
  const cookies = new Map<string, string>();

  for (const pair of existingCookieHeader.split(";")) {
    const separator = pair.indexOf("=");
    if (separator > 0) {
      cookies.set(
        pair.slice(0, separator).trim(),
        pair.slice(separator + 1).trim(),
      );
    }
  }

  for (const header of setCookieHeaders) {
    const pair = header.split(";", 1)[0];
    const separator = pair.indexOf("=");

    if (separator > 0) {
      cookies.set(pair.slice(0, separator).trim(), pair.slice(separator + 1));
    }
  }

  return [...cookies.entries()]
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

export const proxy = async (request: NextRequest) => {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader)
    return NextResponse.redirect(new URL("/login", request.url));

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not set in the environment variable",
    );
  }
  const baseUrl = apiBaseUrl?.endsWith("/") ? apiBaseUrl : `${apiBaseUrl}/`;

  let response = await fetch(`${baseUrl}auth/me`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  let updatedCookies: string[] = [];

  
  if (response.status === 401) {
    const refreshResponse = await fetch(`${baseUrl}auth/refresh-token`, {
      method: "POST",
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    if (!refreshResponse.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Capture cookies returned by the refresh endpoint.
    updatedCookies = refreshResponse.headers.getSetCookie();

    // console.log(refreshResponse, "refreshResponse");
    // console.log(updatedCookies, "updatedCookies");

    // const refreshedCookieHeader = [
    //   cookieHeader,
    //   ...updatedCookies.map((cookie) => cookie.split(";")[0]),
    // ]
    //   .filter(Boolean)
    //   .join("; ");

    // console.log(refreshedCookieHeader, "refreshedCookieHeader");
    const refreshedCookieHeader = mergeCookieHeader(
      cookieHeader,
      updatedCookies,
    );
    request.headers.set("cookie", refreshedCookieHeader);

    response = await fetch(`${baseUrl}auth/me`, {
      headers: { cookie: refreshedCookieHeader },
      cache: "no-store",
    });

    if (response.status === 401) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (!response.ok) {
    return NextResponse.json(
      { message: "Could not verify your account." },
      { status: 503 },
    );
  }

  const body = (await response.json()) as MeResponse;
  const role = body.data?.role;

  if (
    role !== "PATIENT" &&
    role !== "DOCTOR" &&
    role !== "ADMIN" &&
    role !== "SUPER_ADMIN"
  ) {
    return NextResponse.json(
      { message: "Could not verify your account role." },
      { status: 503 },
    );
  }

  if (!canVisit(request.nextUrl.pathname, role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const nextResponse = NextResponse.next({
    request: { headers: request.headers },
  });

  for (const cookie of updatedCookies) {
    nextResponse.headers.append("Set-Cookie", cookie);
  }

  return nextResponse;
};

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/doctor/dashboard/:path*",
    "/admin/dashboard/:path*",
    "/my-profile",
    "/change-password"
  ],
};
