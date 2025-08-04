import express from "express"
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import {JWT_SECRET}  from "@repo/backend-common/config"; 
import {CreateUserSchema, SigninSchema, CreateRoomSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client"

const app = express();

app.post("/signup",(req,res) => {
    
    const parsedData = CreateUserSchema.safeParse(req.body);

    if(!parsedData.success){
        return res.status(400).json({
            error : "Invalid Inputs"
        })
    }

    prismaClient.user.create({
        data : {
            userId : parsedData.data.username,
            password : parsedData.data.password,
            name : parsedData.data.name
        }
    })
    
    
    res.json({
        userId : "12345",
    })

})

app.post("/singin",(req,res) => {

    const data = SigninSchema.safeParse(req.body);

    if(!data.success){
        return res.status(400).json({
            error : "Invalid data"
        })
    }

    const userId = 1;
    const token = jwt.sign({
        userId},
        JWT_SECRET);

    res.json({
        token
    })

})

app.get("/room",middleware, (req,res)=>{

    const data = CreateRoomSchema.safeParse(req.body);

    if(!data.success){
        return res.status(400).json({
            error : "Invalid data"
        })
    }
    
    res.json({
        roomId : "room123"
    })

})

app.listen(3000);