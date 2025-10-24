import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET}  from "@repo/backend-common/config";


export function middleware(req : Request, res : Response, next : NextFunction) {

    // const token = req.headers["authorization"] ?? "";
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhYmNkIiwiaWF0IjoxNzU4Nzk5NTQyfQ.bTNG1rue-uL1QP7wYEAmqLQLizWNm4lhnV5WJ1zH9Wg";

    
    const decoded = jwt.verify(token, JWT_SECRET);

    if(decoded){
        // @ts-ignore
        req.userId = decoded.userId
        next();

    }else{
        res.status(403).json({
            message : "Unauthorized"
        })
    }
}
