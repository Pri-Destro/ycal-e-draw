// import axios from "axios";
// import { HTTP_BACKEND } from "@/config";
// import { existsSync } from "fs";

// export default async function initDraw(canvas : HTMLCanvasElement, roomId : string, socket : WebSocket){

//     const ctx = canvas.getContext('2d');

//     if(!ctx) return;

    
//     socket.onmessage = (event)=>{
//         const message = JSON.parse(event.data)

//         if(message.type == "chat"){
//             const parsedShape = JSON.parse(message)
//             existingShapes.push(parsedShape)
            
//             clearCanvas(existingShapes, canvas, ctx)
//         }
//     }

//     ctx.fillStyle = "rgba(0,0,0)"                       // default canvas colour
//     ctx.fillRect(0,0,canvas.width, canvas.height)


//     type Shape = {
//         type : "rect",
//         x : number,
//         y : number,
//         width : number,
//         height : number
//     } | {
//         type : "circle",
//         centerX : number,
//         centerY : number,
//         radius : number
//     }

//     let isDrawing = false;
//     let startX = 0;
//     let startY = 0;

//     const existingShapes : Shape[] = await getExistingShapes(roomId);

//     // clear canvas and print/draw all the existing shapes till now
//     function clearCanvas(existingShapes : Shape[], canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D){

//         ctx.clearRect(0,0, canvas.width, canvas.height)  // clearing context
//         ctx.fillStyle = "rgba(0,0,0)"
//         ctx.fillRect(0,0,canvas.width, canvas.height)

//         existingShapes.map((shape)=>{
//             if(shape.type == "rect"){
//                 ctx.strokeStyle = "rgba(255,255,255)"
//                 ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
//             }
//         })

//     }

    

//     canvas.addEventListener('mousedown', (e)=>{
//         isDrawing = true;
//         startX = e.offsetX;
//         startY = e.offsetY;
//     })

//     canvas.addEventListener('mouseup', (e)=>{

//         isDrawing = false;

//         const width = e.offsetX - startX ;
//         const height  = e.offsetY - startY;

//         existingShapes.push({
//             type : "rect",
//             x : startX,
//             y : startY,
//             width,
//             height
//         })
//     })

//     canvas.addEventListener('mousemove', (e)=>{
//         if(isDrawing ){
//             const width = e.offsetX - startX;
//             const height = e.offsetY - startY;

//             clearCanvas(existingShapes, canvas, ctx);
            
//             ctx.strokeStyle = "rgbs(255,255,255)"
//             ctx.strokeRect(startX, startY, width, height);

//         }
//     })
// }
    
// async function getExistingShapes(roomId : string){

//     try{
//         const res = await axios.get(`${HTTP_BACKEND}/chat/${roomId}`)
//         const messages = res.data.message

//         const shapes = messages.map((x : {message : string})=>{
//             const messageData = JSON.parse(x.message);
//             return messageData
//         })

//         return shapes;

//     }catch(e){
//         return "Error Fetching Room"
//     }

// }

import axios from "axios";
import { HTTP_BACKEND } from "@/config";

export default async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === "element") {
            existingShapes.push(message.element);
            clearCanvas(existingShapes, canvas, ctx);
        }
    }

    ctx.fillStyle = "rgba(0,0,0)";                       // default canvas colour
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    type Shape = {
        id?: string;
        type: "rect";
        x: number;
        y: number;
        width: number;
        height: number;
        style?: {
            strokeColor?: string;
            backgroundColor?: string;
            strokeWidth?: number;
            opacity?: number;
        };
    } | {
        id?: string;
        type: "circle";
        x: number;
        y: number;
        width: number;
        height: number;
        style?: {
            strokeColor?: string;
            backgroundColor?: string;
            strokeWidth?: number;
            opacity?: number;
        };
    }

    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    let currentTool = "rect"; 

    const existingShapes: Shape[] = await getExistingElements(roomId);

    // clear canvas and draw all existing shapes
    function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // clearing context
        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        existingShapes.forEach((shape) => {
            const strokeColor = shape.style?.strokeColor || "rgba(255,255,255)";
            const strokeWidth = shape.style?.strokeWidth || 1;
            const opacity = shape.style?.opacity || 1;

            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.globalAlpha = opacity;

            if (shape.type === "rect") {
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                const centerX = shape.x + shape.width / 2;
                const centerY = shape.y + shape.height / 2;
                const radius = Math.min(shape.width, shape.height) / 2;
                
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
            
            ctx.globalAlpha = 1; // Reset opacity
        });
    }

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        startX = e.offsetX;
        startY = e.offsetY;
    });

    canvas.addEventListener('mouseup', async (e) => {
        if (!isDrawing) return;
        
        isDrawing = false;

        const width = e.offsetX - startX;
        const height = e.offsetY - startY;

        const newElement: Shape = {
            type: currentTool as "rect",
            x: startX,
            y: startY,
            width,
            height,
            style: {
                strokeColor: "rgba(255,255,255)",
                strokeWidth: 1,
                opacity: 1
            }
        };

        existingShapes.push(newElement);

        // Send to backend to save in database
        try {
        //     const response = await axios.post(`${HTTP_BACKEND}/elements`, {
        //         roomId,
        //         type: currentTool,
        //         x: startX,
        //         y: startY,
        //         width,
        //         height,
        //         style: {
        //             strokeColor: "rgba(255,255,255)",
        //             strokeWidth: 1,
        //             opacity: 1
        //         }
        //     });

        //     // Send to other users via WebSocket
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: "element",
                    element: {
                        ...newElement,
                        // id: response.data.id
                    }
                }));
            }
        } catch (error) {
            console.error('Error saving element:', error);
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            const width = e.offsetX - startX;
            const height = e.offsetY - startY;

            clearCanvas(existingShapes, canvas, ctx);

            ctx.strokeStyle = "rgba(255,255,255)";
            ctx.lineWidth = 1;
            
            if (currentTool === "rect") {
                ctx.strokeRect(startX, startY, width, height);
            } else if (currentTool === "circle") {
                const centerX = startX + width / 2;
                const centerY = startY + height / 2;
                const radius = Math.min(Math.abs(width), Math.abs(height)) / 2;
                
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
    });

    // Initial render of existing shapes
    clearCanvas(existingShapes, canvas, ctx);
}

async function getExistingElements(roomId: string){
    try {
        const res = await axios.get(`${HTTP_BACKEND}/elements/${roomId}`);
        const elements = res.data.elements;

        return elements.map((element: any) => ({
            id: element.id,
            type: element.type,
            x: element.x,
            y: element.y,
            width: element.width || 0,
            height: element.height || 0,
            style: element.style || {
                strokeColor: "rgba(255,255,255)",
                strokeWidth: 1,
                opacity: 1
            }
        }));

    } catch (e) {
        console.error("Error fetching elements:", e);
        return [];
    }
}