import express from "express"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { middleware } from "./middleware";
import {JWT_SECRET}  from "@repo/backend-common/config"; 
import {CreateUserSchema, SigninSchema, CreateRoomSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client"

const app = express();
app.use(express.json())

app.post("/signup", async (req,res) => {
    
    const parsedData = CreateUserSchema.safeParse(req.body);

    if(!parsedData.success){
        res.status(400).json({
            error : "Invalid Inputs"
        })
        return
    }

    const hashedPassword = bcrypt.hash(parsedData.data.password, 10)

    try{
        const user = await prismaClient.user.create({
            data : {
                userId : parsedData.data.username,
                password : hashedPassword,
                name : parsedData.data.name
            }
        })
        
        if(!user){
            res.json({
                message : "Not authorized"
            })
        }

        res.json({
            userId : user.id,
        })
    }catch(e){
        res.status(403).json({
            message : "Error at db"
        })
    }

})

app.post("/signin",(req,res) => {

    const parsedData = SigninSchema.safeParse(req.body);

    if(!parsedData.success){
        return res.status(400).json({
            error : "Invalid data"
        })
    }

    const userId = parsedData.data.username;
    const token = jwt.sign({
        userId},JWT_SECRET);

    res.json({
        token
    })

})

app.get("/room",middleware, async (req,res)=>{

    const parsedData = CreateRoomSchema.safeParse(req.body);

    if(!parsedData.success){
        res.status(400).json({
            error : "Invalid data"
        })
        return;
    }

    //@ts-ignore
    const userId = req.userId //from middleware

    try{

        const room = await prismaClient.user.create({
            data : {
                slug : parsedData.data.roomName,
                adminId : userId
            }
        })

        res.json({
            roomId : room.id,
        })

    }catch(e){
        res.status(403).json({
            message : "Error at db"
        })
    }
    
})

app.get("/chat/:roomId", async (req,res)=>{
    const roomId = Number(req.params.roomId);

    const messages = await prismaClient.chat.findMany({
        where : {
            roomId : roomId
        },
        order : {
            id : "desc"
        },
        take : 50

    })

    res.json({
        messages
    })
})

app.get("/room/:slug", async (req,res)=>{
    const slug = req.params.slug;

    const room = await prismaClient.room.findFirst({
        where : {
            slug 
        }
    })

    res.json({
        room
    })
})

app.listen(3000);