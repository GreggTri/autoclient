'use server'

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  try {
    console.log(payload);

    return NextResponse.json({ body: {success: true, payload: payload}, status: 500 });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}