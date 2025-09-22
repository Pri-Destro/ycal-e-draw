"use client"

import { useState, useEffect } from "react"
import Canvas from "./Canvas"
import { WS_URL } from "@/config"

export default function RoomCanvas({roomId } : {roomId : string}){

        const [socket, setSocket] = useState<WebSocket>()


        useEffect(()=>{
            const ws = new WebSocket(`${WS_URL}?token=xyz`)
            ws.onopen = ()=>{
                setSocket(ws)
                ws.send(JSON.stringify({
                    type : "join_room",
                    roomId
                }))
            }

        },[])
        
        if(!socket){
            return <div>
                Connecting to ser1ver ....
            </div>
        }
    
    return <div>
        <Canvas roomId={roomId} socket = {socket}/>
        </div>
}