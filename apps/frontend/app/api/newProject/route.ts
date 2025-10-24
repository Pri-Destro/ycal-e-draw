import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import { HTTP_BACKEND } from '@/config'
import { cookies } from 'next/headers'


export async function POST(req: NextRequest) {
    try{
        const {roomName} = await req.json()
        const token = (await cookies()).get("token")?.value;
        
        const res = await axios.post(`${HTTP_BACKEND}/room?token=${token}`,{roomName})
        const roomId = res.data.roomId
        
        if(!roomId) {
            return NextResponse.json(
                {error : "Error at Creating room"},
                {status : 401}
            )
        }
        return NextResponse.json({
            roomId,
            message : "Room created successfully"
        })

    }catch(error : any){
        console.error('Error creating project:', error)
        return NextResponse.json(
            {message : `Unknown Error at backend ${error.message}`},
            {status : 500}
        )
    }
}

export async function GET(req : NextRequest){

}