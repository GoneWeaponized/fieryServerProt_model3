const crypto = require("crypto");

const{
    findPlayerByName, addPlayer
} = require("../service/playService");

const { isValidUsername } = require("../util/validation"); //you could probably use this file for something more

module.exports = function(socket,split){
    const username = split[1]?.trim();
    const lat = parseFloat(split[2]);
    const lng = parseFloat(split[3]);

    console.log("RAW split[1]:", split[1]);
    console.log(JSON.stringify(split));
    if (!isValidUsername(username)){
        socket.write("ERROR | Invalid username\n");
        console.log("VALIDATION INPUT:", JSON.stringify(username));
        return;
    }

    //finds player
    let player = findPlayerByName(username);

    if (player) {
        socket.write(`LOGIN_OK|${player.uuid}\n`);
    } else {
        const uuid = crypto.randomUUID();
        

        player = {
            uuid,
            username,
            entity : {
                type: "player",
                lat,
                lng
            }
        };

    addPlayer(player);

    console.log("CreatedPlayer",username);

    socket.write(`LOGIN_OK|${uuid}\n`);
    }
};