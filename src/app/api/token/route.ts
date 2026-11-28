import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getAuth } from "@/lib/auth";

const JWT_ISSUER = process.env.JWT_ISSUER || "mentorlagbe";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "mentorlagbe-api";

export async function GET() {
  // Short-lived, non-cacheable token — ei token-ti shudhu Express API-te use hoy.
  const noStore = { "Cache-Control": "no-store" };

  try {
    const requestHeaders = await headers();
    const session = await getAuth().api.getSession({ headers: requestHeaders });

    if (!session) {
      return NextResponse.json(
        { message: "Not logged in" },
        { status: 401, headers: noStore }
      );
    }

    // Unverified accounts cannot use the protected Express API, even if a
    // session was created by a social provider.
    if (!session.user.emailVerified) {
      return NextResponse.json(
        { message: "Please verify your email first" },
        { status: 403, headers: noStore }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is missing");
      return NextResponse.json(
        { message: "Token service unavailable" },
        { status: 500, headers: noStore }
      );
    }

    const token = jwt.sign(
      {
        email: session.user.email,
        name: session.user.name,
      },
      secret,
      {
        algorithm: "HS256",
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
        subject: session.user.id,
        expiresIn: "15m",
      }
    );

    return NextResponse.json({ token }, { headers: noStore });
  } catch (error) {
    console.error("Token issue failed", error);
    return NextResponse.json(
      { message: "Token service unavailable" },
      { status: 500, headers: noStore }
    );
  }
}
