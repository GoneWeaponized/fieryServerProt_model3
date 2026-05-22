const { getPlayers, findPlayerByUUID, updatePlayerPosition } = require('../service/playService');

module.exports = function(socket,split){
const players = getPlayers();

    for (const player of players){
        socket.write(
    `${player.uuid}|${player.username}|${player.entity.lat}|${player.entity.lng}\n`
        );
    }

    socket.write("DATA_END\n");
};