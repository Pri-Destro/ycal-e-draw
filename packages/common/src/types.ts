import {z} from "zod";

export const CreateUserSchema = z.object({
    name : z.string(),
    password : z.string().min(8),
    email : z.email(),
})

export const SigninSchema = z.object({
    password : z.string().min(8),
    email : z.email(),
})

export const CreateRoomSchema = z.object({
    roomName : z.string().min(3)
})

export type Project = {
    roomId : string,
    name : string,
    collaborators? : number,
    admin? : string,
    createdAt? : string
} 

export type User = {
    name : string,
    email : string
}