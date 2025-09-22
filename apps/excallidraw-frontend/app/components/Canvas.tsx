"use client"

import { useRef, useEffect, useState } from "react";
import { Button } from "@repo/ui/button";  
import initDraw from "./draw";
import {WS_URL} from "@/config"



export default function Canvas({roomId, socket} : {roomId : string, socket : WebSocket}){

    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(()=>{   

        if(canvasRef.current){
            initDraw(canvasRef.current, roomId, socket)
        }
    },[canvasRef])

    return <div className="">
        <div className="flex justify-center items-center bg-gray-300 py-2 gap-3"> 
            <Button 
            className = "bg-slate-600 text-white hover:bg-slate-800"
            variant={"default"}
            onClick={()=>{
                if (!canvasRef.current) return;
                const canvas = canvasRef.current;

                const ctx = canvas.getContext("2d")
                if(!ctx) return;

                ctx.clearRect(0,0, canvas.width, canvas.height)  // clearing context
                ctx.fillStyle = "rgba(0,0,0)"
                ctx.fillRect(0,0,canvas.width, canvas.height)

            }}> Clear </Button>
            <Button className = " " variant={"outline"}> Rectangle</Button>
            <Button className = "" variant={"outline"}> Circle </Button>
        </div>

        <canvas 
        ref = {canvasRef}
        height={700}
        width={1450}
        className="border-2 border-black m-5">
            
        </canvas>

    </div>
}
   
   
