import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import { HTTP_BACKEND } from '../../../config'
import { cookies } from 'next/headers'


export async function POST(req: NextRequest) {
  try {
    const { roomName } = await req.json();
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const res = await axios.post(
      `${HTTP_BACKEND}/room`,
      { roomName },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const roomId = res.data?.roomId;

    if (!roomId) {
      return NextResponse.json({ error: "Room creation failed" }, { status: 500 });
    }

    return NextResponse.json({ roomId, message: "Room created" });

  } catch (error: any) {
    console.log("Room creation error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unknown server error" },
      { status: 500 }
    );
  }
}
