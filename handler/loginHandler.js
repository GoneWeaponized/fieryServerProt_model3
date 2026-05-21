const crypto = require("crypto");

const{
    findPlayerByName, addPlayer
} = require("../service/playService");

const { isValidUsername } = require("../util/validation"); //you could probably use this file for something more

module.exports = function(socket,split){
    const username = split[1];
    const lat = parseFloat(split[2]);
    const lng = parseFloat(split[3]);

    if (!isValidUsername(username)){
        socket.write("ERROR | Invalid username\n");
        return;
    }

    //finds player
    let player = findPlayerByName(username);

    if (player) {
        socket.write(`${player.uuid}`);
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

    socket.write(`${uuid}`);
    }
};
