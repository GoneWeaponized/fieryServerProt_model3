const { updatePlayerPosition } = require("../service/playService");

module.exports = function(socket,split){
    const uuid = split[1];
    const lat = parseFloat(split[2]);
    const lng = parseFloat(split[3]);


    const player = updatePlayerPosition(
        uuid,lat,lng
    );

    if (!player){
        socket.write("ERROR|Player not found.");
        return;
    }

    socket.write("POSITION_OK");
};