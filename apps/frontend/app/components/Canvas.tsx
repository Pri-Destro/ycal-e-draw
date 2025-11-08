"use client"

import { useRef, useEffect, useState } from "react";
import { Button } from "@repo/ui/button";  
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';
import initDraw from "./draw";

export default function Canvas({roomId, socket} : {roomId : string, socket : WebSocket}){
    const stageRef = useRef<Konva.Stage>(null);
    const layerRef = useRef<Konva.Layer>(null);
    const [currentTool, setCurrentTool] = useState<string>("rect");

    useEffect(() => {   
        if (stageRef.current && layerRef.current) {
            initDraw(stageRef.current, layerRef.current, roomId, socket, currentTool);
        }
    }, [roomId, socket, currentTool]);

    const handleClear = () => {
        if (layerRef.current) {
            layerRef.current.destroyChildren();
            layerRef.current.batchDraw();
        }
    };

    return (
        <div className="">
            <div className="flex justify-center items-center bg-gray-300 py-2 gap-3"> 
                <Button 
                    className="bg-slate-600 text-white hover:bg-slate-800"
                    variant={"default"}
                    onClick={handleClear}
                > 
                    Clear 
                </Button>
                
                <Button 
                    className={currentTool === "rect" ? "bg-blue-500 text-white" : ""}
                    variant={"outline"}
                    onClick={() => setCurrentTool("rect")}
                > 
                    Rectangle
                </Button>
                
                <Button 
                    className={currentTool === "circle" ? "bg-blue-500 text-white" : ""}
                    variant={"outline"}
                    onClick={() => setCurrentTool("circle")}
                > 
                    Circle 
                </Button>

                <Button 
                    className={currentTool === "ellipse" ? "bg-blue-500 text-white" : ""}
                    variant={"outline"}
                    onClick={() => setCurrentTool("ellipse")}
                > 
                    Ellipse 
                </Button>

                <Button 
                    className={currentTool === "arrow" ? "bg-blue-500 text-white" : ""}
                    variant={"outline"}
                    onClick={() => setCurrentTool("arrow")}
                > 
                    Arrow 
                </Button>

                <Button 
                    className={currentTool === "line" ? "bg-blue-500 text-white" : ""}
                    variant={"outline"}
                    onClick={() => setCurrentTool("line")}
                > 
                    Line 
                </Button>
            </div>

            <div className="m-5 border-2 border-black">
                <Stage
                    width={1450}
                    height={700}
                    ref={stageRef}
                    style={{ backgroundColor: 'rgba(30,30,30)' }}
                >
                    <Layer ref={layerRef} />
                </Stage>
            </div>
        </div>
    );
}