const crypto = require("crypto");

const{
    findPlayerByName, addPlayer
} = require("../service/playService");

const { isValidUsername } = require("../util/validation");

module.exports = function(socket,split){
    let username = split[1]?.trim();

    if(typeof username !== "string"){
        socket.write("ERROR|Invalid Username");
        return;
    }
    username = username.replace(/[\r\n]/g, "");


    const lat = parseFloat(split[2]);
    const lng = parseFloat(split[3]);

    if(!isValidUsername(username)){
      socket.write("ERROR|Invalid Username\n");
    }
    let player = findPlayerByName(username);

    if (player){
        socket.write(`EXISTING|${player.uuid}\n`);
        return;
    }
    
    const uuid = crypto.randomUUID();

    player = {
        uuid,
        username,
        entity:{
            type: "player",
            lat,
            lng
        }
    };

    addPlayer(player);

    socket.write(`LOGIN_OK|${uuid}\n`);
};