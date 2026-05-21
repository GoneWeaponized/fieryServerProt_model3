const net = require('net');

const handleLogin = require("./handler/loginHandler");
const handlePlayers = require("./handler/playerHandler");
const handleUpdPos = require("./handler/locUpdateHandler");

const PORT = 5010;

const server = net.createServer(socket =>{
    console.log("Client Connected.");

    socket.on("data", buffer => {
        const msg = buffer.toString().trim();
        console.log("Recieved:", msg);
        const split = msg.split("|");
        const command = split[0];

        switch(command) {
            case "LOGIN":
                handleLogin(socket, split);
                break;
            
            case "GET_PLAYERS":
                handlePlayers(socket, split);
                break;

            case "UPDATE_POSITION":
                handleUpdPos(socket, split);
                break;

            default:
                socket.write("ERROR|Unknown Command");
        }
    });

    socket.on("close", ()=>{
        console.log("Client Disconnected");
    });

    socket.on("error", err =>{
        console.log(err);
    });
});

server.listen(PORT, () =>{
    console.log(`TCP Server running on ${PORT}`);
});