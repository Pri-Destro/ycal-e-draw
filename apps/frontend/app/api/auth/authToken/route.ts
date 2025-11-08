import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";



export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const res = await axios.post(`${HTTP_BACKEND}/signin`, {
            email,
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



