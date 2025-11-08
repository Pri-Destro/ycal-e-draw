import axios, { AxiosError } from "axios";
import { HTTP_BACKEND } from "@/config";
import Konva from "konva";

type Shape = {
    id?: string;
    type: "rect" | "circle" | "ellipse" | "arrow" | "line";
    x: number;
    y: number;
    width?: number;
    height?: number;
    points?: number[]; // for arrow and line
    style?: {
        strokeColor?: string;
        backgroundColor?: string;
        strokeWidth?: number;
        opacity?: number;
    };
}

export default async function initDraw(
    stage: Konva.Stage,
    layer: Konva.Layer,
    roomId: string,
    socket: WebSocket,
    currentTool: string
) {
    // Fetch existing elements
    const existingShapes: Shape[] = await getExistingElements(roomId);
    
    // Render existing shapes
    renderShapes(existingShapes, layer);

    // WebSocket message handler
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === "element") {
            existingShapes.push(message.element);
            renderShapes(existingShapes, layer);
        }
    }

    let isDrawing = false;
    let currentShape: Konva.Shape | null = null;
    let startX = 0;
    let startY = 0;

    // Mouse down event
    stage.on('mousedown', (e) => {
        if (e.target !== stage) return; // Only draw on empty space
        
        isDrawing = true;
        const pos = stage.getPointerPosition();
        if (!pos) return;

        startX = pos.x;
        startY = pos.y;

        // Create temporary shape based on current tool
        if (currentTool === "rect") {
            currentShape = new Konva.Rect({
                x: startX,
                y: startY,
                width: 0,
                height: 0,
                stroke: "rgba(255,255,255)",
                strokeWidth: 1,
            });
        } else if (currentTool === "circle") {
            currentShape = new Konva.Circle({
                x: startX,
                y: startY,
                radius: 0,
                stroke: "rgba(255,255,255)",
                strokeWidth: 1,
            });
        } else if (currentTool === "ellipse") {
            currentShape = new Konva.Ellipse({
                x: startX,
                y: startY,
                radiusX: 0,
                radiusY: 0,
                stroke: "rgba(255,255,255)",
                strokeWidth: 1,
            });
        } else if (currentTool === "arrow") {
            currentShape = new Konva.Arrow({
                points: [startX, startY, startX, startY],
                stroke: "rgba(255,255,255)",
                strokeWidth: 2,
                fill: "rgba(255,255,255)",
                pointerLength: 10,
                pointerWidth: 10,
            });
        } else if (currentTool === "line") {
            currentShape = new Konva.Line({
                points: [startX, startY, startX, startY],
                stroke: "rgba(255,255,255)",
                strokeWidth: 2,
            });
        }

        if (currentShape) {
            layer.add(currentShape);
        }
    });

    // Mouse move event
    stage.on('mousemove', (e) => {
        if (!isDrawing || !currentShape) return;

        const pos = stage.getPointerPosition();
        if (!pos) return;

        const width = pos.x - startX;
        const height = pos.y - startY;

        if (currentTool === "rect") {
            (currentShape as Konva.Rect).width(width);
            (currentShape as Konva.Rect).height(height);
        } else if (currentTool === "circle") {
            const radius = Math.min(Math.abs(width), Math.abs(height)) / 2;
            (currentShape as Konva.Circle).x(startX + width / 2);
            (currentShape as Konva.Circle).y(startY + height / 2);
            (currentShape as Konva.Circle).radius(radius);
        } else if (currentTool === "ellipse") {
            (currentShape as Konva.Ellipse).x(startX + width / 2);
            (currentShape as Konva.Ellipse).y(startY + height / 2);
            (currentShape as Konva.Ellipse).radiusX(Math.abs(width) / 2);
            (currentShape as Konva.Ellipse).radiusY(Math.abs(height) / 2);
        } else if (currentTool === "arrow" || currentTool === "line") {
            (currentShape as Konva.Arrow | Konva.Line).points([startX, startY, pos.x, pos.y]);
        }

        layer.batchDraw();
    });

    // Mouse up event
    stage.on('mouseup', async (e) => {
        if (!isDrawing || !currentShape) return;

        isDrawing = false;

        const pos = stage.getPointerPosition();
        if (!pos) return;

        const width = pos.x - startX;
        const height = pos.y - startY;

        // Remove temporary shape
        currentShape.destroy();
        currentShape = null;

        // Create new element data
        const newElement: Shape = {
            type: currentTool as any,
            x: startX,
            y: startY,
            width: currentTool === "rect" ? width : Math.abs(width),
            height: currentTool === "rect" ? height : Math.abs(height),
            style: {
                strokeColor: "rgba(255,255,255)",
                strokeWidth: currentTool === "arrow" || currentTool === "line" ? 2 : 1,
                opacity: 1
            }
        };

        // For arrow and line, store points instead
        if (currentTool === "arrow" || currentTool === "line") {
            newElement.points = [startX, startY, pos.x, pos.y];
            delete newElement.width;
            delete newElement.height;
        }

        existingShapes.push(newElement);

        // Render all shapes
        renderShapes(existingShapes, layer);

        try {
            // Send to other users via WebSocket
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: "element",
                    roomId,
                    element: newElement
                }));
            }
        } catch (error) {
            console.error('Error saving element:', error);
        }
    });
}

// Render all shapes on the layer
function renderShapes(shapes: Shape[], layer: Konva.Layer) {
    // Clear the layer
    layer.destroyChildren();

    shapes.forEach((shape) => {
        const strokeColor = shape.style?.strokeColor || "rgba(255,255,255)";
        const strokeWidth = shape.style?.strokeWidth || 1;
        const opacity = shape.style?.opacity || 1;
        const backgroundColor = shape.style?.backgroundColor;

        let konvaShape: Konva.Shape;

        if (shape.type === "rect") {
            konvaShape = new Konva.Rect({
                x: shape.x,
                y: shape.y,
                width: shape.width || 0,
                height: shape.height || 0,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                fill: backgroundColor,
                opacity: opacity,
            });
        } else if (shape.type === "circle") {
            const radius = Math.min(shape.width || 0, shape.height || 0) / 2;
            konvaShape = new Konva.Circle({
                x: shape.x + (shape.width || 0) / 2,
                y: shape.y + (shape.height || 0) / 2,
                radius: radius,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                fill: backgroundColor,
                opacity: opacity,
            });
        } else if (shape.type === "ellipse") {
            konvaShape = new Konva.Ellipse({
                x: shape.x + (shape.width || 0) / 2,
                y: shape.y + (shape.height || 0) / 2,
                radiusX: (shape.width || 0) / 2,
                radiusY: (shape.height || 0) / 2,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                fill: backgroundColor,
                opacity: opacity,
            });
        } else if (shape.type === "arrow") {
            konvaShape = new Konva.Arrow({
                points: shape.points || [],
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                fill: strokeColor,
                opacity: opacity,
                pointerLength: 10,
                pointerWidth: 10,
            });
        } else if (shape.type === "line") {
            konvaShape = new Konva.Line({
                points: shape.points || [],
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                opacity: opacity,
            });
        } else {
            return; // Unknown shape type
        }

        layer.add(konvaShape);
    });

    layer.batchDraw();
}

// Fetch existing elements when user joins the room
async function getExistingElements(roomId: string): Promise<Shape[]> {
    try {
        console.log("Fetching from:", `${HTTP_BACKEND}/elements/${roomId}`);
        const res = await axios.get(`${HTTP_BACKEND}/elements/${roomId}`);
        console.log("Response:", res.data);

        const elements = res.data.elements;
        console.log(elements);
        
        return elements.map((element: any) => ({
            id: element.id,
            type: element.type,
            x: element.x,
            y: element.y,
            width: element.width || 0,
            height: element.height || 0,
            points: element.points,
            style: element.style || {
                strokeColor: "rgba(255,255,255)",
                strokeWidth: 1,
                opacity: 1
            }
        }));

    } catch (e) {
        console.error("Full error:", (e as AxiosError).response?.data || (e as AxiosError).message);
        return [];
    }
}