import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" }, 
        { status: 401 }
      );
    }

    return NextResponse.json(
        {token},
        {status : 200}
    );

  } catch (error) {
      console.error("Token extraction failed:", error);
      return NextResponse.json(
        { message: "Server error" }, 
        { status: 500 }
      );
  }
}