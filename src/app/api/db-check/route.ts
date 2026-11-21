import { connection, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// Temporary diagnostic: Vercel theke Atlas connect hocche kina dekhar jonno.
// Fix hoye gele ei file ta delete kore debo.

export async function GET() {
  await connection();

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return NextResponse.json(
      { ok: false, error: "MONGODB_URI is missing" },
      { status: 500 }
    );
  }

  const client = new MongoClient(uri, {
    family: 4,
    serverSelectionTimeoutMS: 8000,
  });

  try {
    await client.connect();
    const db = client.db();
    const tuitions = await db.collection("tuitions").countDocuments();

    return NextResponse.json({
      ok: true,
      database: db.databaseName,
      tuitions,
    });
  } catch (error) {
    const err = error as Error;

    return NextResponse.json(
      {
        ok: false,
        name: err.name,
        error: err.message,
        uriHost: uri.replace(/\/\/[^@]+@/, "//***@"),
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
