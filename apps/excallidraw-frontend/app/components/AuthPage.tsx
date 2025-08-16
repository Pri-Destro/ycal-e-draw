import {Button} from "@repo/ui/button"

export function AuthPage( isSignin :{
    isSignin : boolean
}){
    return <div className="w-screen h-screen flex justify-center items-center">
        <div className="p-6 m-2 bg-white rounded">
            <div className="pt-2">
                <input type="text" placeholder="Email"></input>
                <input type= "password" placeholder="Password"></input>
            </div>
            <div>
                <button onClick={()=>{

                }}>{isSignin ? "Sign In" : "Sign Up"}</button>

            </div>
        </div>
    </div>
}