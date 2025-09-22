import RoomCanvas from "@/app/components/RoomCanvas"

export default async function CanvasPage({params} : {params : {roomId : string}}){

    const roomId =  (await params).roomId
    // const canvasRef = useRef<HTMLCanvasElement>(null)
    // useEffect(()=>{   

    //     if(canvasRef.current){
    //         const canvas = canvasRef.current;
    //         initDraw(canvas, roomId)
    //     }
    // },[canvasRef])

    

    return <RoomCanvas roomId = {roomId} />
}