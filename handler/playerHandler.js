const { getPlayers, findPlayerByUUID, updatePlayerPosition } = require('../service/playService');

module.exports = function(socket,split){
    const uuid = split[1];
    const lat =  parseFloat(split[2]);
    const lng = parseFloat(split[3]);

    const requester = findPlayerByUUID(uuid);

    if (!requester) {
        socket.write("ERROR|Invalid UUID");
        return;
    }

    updatePlayerPosition(uuid,lat,lng);

    const players = getPlayers();

    for (const player of players){
        socket.write(
            `${player.uuid}` + 
            `${player.username}` +
            `${player.entity.lat}` +
            `${player.entity.lng}\n`
        );
    }

    socket.write("DATA_END");
};