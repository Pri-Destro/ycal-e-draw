import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import {JWT_SECRET}  from "@repo/backend-common/config"; 
import jwt from "jsonwebtoken";


export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        const res = await axios.post(`${HTTP_BACKEND}/signin`, {
            username,
            password,
        },{
            withCredentials : true
        });
            
        const { token, user } = res.data;

        if (!token || !user) {
          throw new Error("Missing token or user info");
        }


        const response = NextResponse.json({ user }, { status: 200 });
        response.cookies.set("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          // path: "/", // important so cookie is available to all routes
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return response;

    } catch (error: any) {

        console.log("Error while loging in",error)

        return NextResponse.json(
        { message: error.response?.data?.message || "Login failed" },
        { status: error.response?.status || 500 }
        );
    }
}


export async function GET() {
  console.log("got here")
  try {
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    console.log("here is the token", token)

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      username: string;
      name: string;
    };

    return NextResponse.json({
      user: {
        username: decoded.username,
        name: decoded.name
      }
    });

  } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json(
        { message: "Invalid token" }, 
        { status: 401 }
      );
  }
}
