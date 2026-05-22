const fs = require('fs');
const path = require("path");

const PLAYERS_FILE = path.join(__dirname, "..", "data", "players.json"); //better dynamic linking

let players = [];
console.log(PLAYERS_FILE);
console.log("RESOLVED PATH:", fs.realpathSync(PLAYERS_FILE));
console.log("PLAYERS LOADED AT START:", players.length);
console.log(players);

if (fs.existsSync(PLAYERS_FILE)){
    players = JSON.parse(fs.readFileSync(PLAYERS_FILE,"utf8"));
}

function savePlayers(){
    fs.writeFileSync(PLAYERS_FILE,JSON.stringify(players,null,2));
}

function getPlayers(){
    return players;
}

function findPlayerByName(username){
    const clean = username.trim().toLowerCase();
    return players.find(p => p.username.trim().toLowerCase() === clean);
}

function findPlayerByUUID(uuid){
    return players.find(p => p.uuid === uuid);
}

function addPlayer(player){
    players.push(player);
    savePlayers();
}

function updatePlayerPosition(uuid, lat, lng){
    const player = findPlayerByUUID(uuid);

    if(!player) return null;

    player.entity.lat = lat;
    player.entity.lng = lng;

    savePlayers();

    return player;
}

module.exports = {
    getPlayers,
    findPlayerByName,
    findPlayerByUUID,
    addPlayer,
    updatePlayerPosition
};
