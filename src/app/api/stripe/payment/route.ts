'use server'

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  
  try {
    
    const data = await request.json();

    console.log(data);

    return NextResponse.json({body: {
        success: true
    }, status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}