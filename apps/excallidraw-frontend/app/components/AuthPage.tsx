import {Button} from "@repo/ui/button"
import {Input} from "@repo/ui/input"
import { Card } from "@repo/ui/card"

export function AuthPage( isSignin :{
    isSignin : boolean
}){
    return <div className="w-screen h-screen flex justify-center items-center">
        <Card>
        <div className="p-6 m-2 bg-white rounded flex-col justify-center  space-y-4">
            <div className="pt-2 px-3 flex-col space-y-4">
                <Input type = "Email" placeholder="Email" className="bg-gray-50"></Input>
                <Input  type = "password" placeholder="Password"></Input>
            </div>
            <div className="text-center">
                <Button 
                variant="outline" 
                className={`transition-colors 
                  border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white
                px-4 py-2`} 
                onClick={()=>{

                }}>{isSignin ? "Sign In" : "Sign Up"}</Button>

            </div>
        </div>
        </Card>
    </div>
}
