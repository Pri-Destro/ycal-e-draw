import { WebSocketServer,WebSocket } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET }  from "@repo/backend-common/config";
import {prismaClient} from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });


interface Users{
  ws : WebSocket,
  rooms : String[],
  userId : String
}

const users : Users[] = [];

function checkUser(token : string) : string | null{
  try{
      const decoded = jwt.verify(token,JWT_SECRET)

      if(!decoded || !(decoded as JwtPayload).userId){
        wss.close()
        return null
      }
    
       return (decoded as JwtPayload).userId

  }catch(e){
    return null
  }

}

wss.on('connection', function connection(ws,request) {

  const url = request.url;
  if(!url) return;

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || " ";

  const userId = checkUser(token);

  if(userId == null) {
    ws.close()
    return null
  }

  users.push({    // on every connection each userId/user gets pushed to users 
    userId,
    rooms : [],
    ws 
  })

  ws.on('message', async function message(data) {

    const parsedData = JSON.parse(data as unknown as string)  // data will be of {type : "join room", roomId : room1}
    
    if(parsedData.type === "join_room"){
      const user = users.find(x => x.ws === ws)
      user?.rooms.push(parsedData.roomId)
    }

    if(parsedData.type == "leave_room"){
      const user = users.find(x => x.ws === ws)

      if(!user) return;

      user.rooms = user?.rooms.filter(x => x !== parsedData.room)
    }

    if(parsedData.type == "chat"){            // data will be like {type : chat, message : hi, roomId : 123}
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      await prismaClient.chat.create({        // (temp approach) messages will first store in db then it will broadcast
        data : {
          roomId,
          message,
          userId
          
        }
      })

      users.forEach(user => {
        if(user.rooms.includes(roomId)){
          user.ws.send(JSON.stringify({
            type : "chat",
            message : message,
            roomId
          }))
        }
      })
    }
    
  });

  ws.send('something');
});