import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

export async function GET() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: "JWT_SECRET is missing" },
      { status: 500 }
    );
  }

  const payload = {
    email: session.user.email,
    name: session.user.name,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  return NextResponse.json({ token: token });
}