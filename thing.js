const net = require("net");
const fs = require("fs");
const crypto = require("crypto");

const PORT = 5010;
const PLAYERS_FILE = "./players.json";

let players = [];

// Load existing players
if (fs.existsSync(PLAYERS_FILE)) {
    players = JSON.parse(
        fs.readFileSync(PLAYERS_FILE, "utf8")
    );
}

// Save helper
function savePlayers() {
    fs.writeFileSync(
        PLAYERS_FILE,
        JSON.stringify(players, null, 2)
    );
}

// Find by username
function findPlayerByName(username) {
    return players.find(
        p => p.username === username
    );
}

const server = net.createServer(socket => {

    console.log("Client connected");

    socket.on("data", buffer => {

        const msg = buffer.toString().trim();

        console.log("Received:", msg);

        const split = msg.split("|");

        const command = split[0];

        // =========================
        // LOGIN
        // =========================

        if (command === "LOGIN") {

            const username = split[1];
            const ilat = parseFloat(split[2]);
            const ilong = parseFloat(split[3]);

            if (!username) {
                socket.write("ERROR|Invalid username\n");
                return;
            }

            let player = findPlayerByName(username);

            // Existing player
            if (player) {

                socket.write(
                    `${player.uuid}\n`
                );

            } else {

                // Create new player
                const uuid = crypto.randomUUID();

                player = {
                    uuid: uuid,
                    username: username,

                    entity: {
                        type: "player",
                        lat: ilat,
                        lng: ilong
                    }
                };

                players.push(player);

                savePlayers();

                console.log(
                    "Created player:",
                    username
                );

                socket.write(
                    `${uuid}\n`
                );
            }
        }

        // =========================
        // GET_PLAYERS
        // =========================

        else if (command === "GET_PLAYERS") {
            const uuid = split[1];
            const lat = parseFloat(split[2]);
            const lng = parseFloat(split[3]);

            const requester = players.find(
            p => p.uuid === uuid );
    
            if (!requester) {
            socket.write("ERROR|INVALID_UUID\n");
            console.log("Invalid get users request.")
            return;
                }
            requester.entity.lat = lat;
            requester.entity.lng = lng;

            savePlayers();
            for (const player of players) {

                socket.write(
                    `${player.uuid}|` + //rem such later
                    `${player.username}|` +
                    `${player.entity.lat}|` +
                    `${player.entity.lng}\n`
                );
            }

            socket.write("END\n");
        }

        //===========POS UPDATION=================
        //Changed position updation in GET_PLAYERS

        else if (command === "UPDATE_POSITION") {

            const uuid = split[1];
            const lat = parseFloat(split[2]);
            const lng = parseFloat(split[3]);

            const player = players.find(
                p => p.uuid === uuid
            );

            if (!player) {
                socket.write("ERROR|Player not found\n");
                return;
            }

            player.entity.lat = lat;
            player.entity.lng = lng;

            savePlayers();

            socket.write("POS_OK\n");
        }

        else {
            socket.write("ERROR|Unknown command\n");
        }
    });


    socket.on("close", () => {
        console.log("Client disconnected");
    });

    socket.on("error", err => {
        console.log(err);
    });
});

server.listen(PORT, () => {
    console.log(`TCP Server running on ${PORT}`);
});
