"use client"

import {Button} from "@repo/ui/button"
import {Input} from "@repo/ui/input"
import { Card } from "@repo/ui/card"
import {useState} from "react"
import { useRouter } from "next/navigation"
import axios from "axios"


export function AuthPage( isSignin :{
    isSignin : boolean
}){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async () => {
        setError(""); 
        try {
            const endpoint = isSignin ? "/api/auth/authToken" : "/api/auth/signup";
            
            if(isSignin){
                const res = await axios.post(endpoint, { username, password });
                if(res.status === 200){
                    router.push("/dashboard"); 
                }else{
                    console.log("login failed")
                    setError("Login failed");
                }
            }
            else {
                await axios.post(endpoint,{email, password, name, username})
                router.push("/auth/signin")
            }

        } catch (err: any) {
            console.log(err)
            setError(err.response?.data?.message || "An error occurred.");
        }
    };

    return <div className="w-screen h-screen flex justify-center items-center">
        <Card>
        <div className="p-6 m-2 bg-white rounded flex-col justify-center  space-y-4">
            <div className="pt-2 px-3 flex-col space-y-4">
                <Input 
                type = "Email" 
                placeholder="Email" 
                className="bg-gray-50" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ></Input>
                
                <Input  type = "text" placeholder="Name"></Input>
                
                <Input 
                type = "text" 
                placeholder="username" 
                className="bg-gray-50" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                ></Input>

                <Input  
                type = "password" 
                placeholder="Password" 
                value={password} 
                onChange={(e)=> setPassword(e.target.value)}
                ></Input>
            </div>
            <div className="text-center">
                <Button 
                variant="outline" 
                className={`transition-colors 
                  border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white
                px-4 py-2`} 
                onClick={handleSubmit}>

                {isSignin ? "Sign In" : "Sign Up"}
                </Button>

            </div>
        </div>
        </Card>
    </div>
}
