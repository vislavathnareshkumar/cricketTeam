const express = require("express");

const app = express();
app.use(express.json());

const path = require("path");

const pathDb = path.join(__dirname, "cricketTeam.db");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;

const intializeDBAndServer = async () => {
  try {
    db = await open({
      filename: pathDb,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
  }
};

intializeDBAndServer();

//API 1

app.get("/players/", async (request, response) => {
  const getPlayers = `
    SELECT 
    *
    FROM 
    cricket_team`;

  const playerList = await db.all(getPlayers);

  const ans = (playerList) => {
    return {
      playerId: playerList.player_id,
      playerName: playerList.player_name,
      jerseyNumber: playerList.jersey_number,
      role: playerList.role,
    };
  };

  const player = playerList.map((eachplayer) => ans(eachplayer));

  response.send(player);
});

//API 2

app.post("/players/", async (request, response) => {
  const playerDetail = request.body;
  const { playerName, jerseyNumber, role } = playerDetail;

  const addplayer = `

    
    INSERT INTO 
    cricket_team
    (player_name, jersey_number, role)
    VALUES ('${playerName}', ${jerseyNumber}, '${role}')
    
    
    
    `;

  const result = await db.run(addplayer);

  response.send(result);
  console.log(result);
});

//API 3

app.get("/players/:playerId/", async (request, response) => {
  const playerId = request.params;

  const playerQuery = `
    
    SELECT
    *
    FROM
    cricket_team
    WHERE
    player_id = ${playerId}`;

  const player = await db.get(playerQuery);

  const finalPlayer = (player) => {
    return {
      playerId: player.player_id,
      playerName: player.player_name,
      jerseyNumber: player.jersey_number,
      role: player.role,
    };
  };

  response.send(finalPlayer);

  console.log("hello");
});

//API 4

app.put("/players/:playerId/", async (request, response) => {
  const playerId = request.params.playerId;

  const { playerName, jerseyNumber, role } = request.body;

  const playerUpdateQuery = `
    UPDATE
    cricket_team
    SET
    player_name= '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
    
    
    `;

  const playerupdated = await db.run(playerUpdateQuery);

  response.send("Player Details Updated");
});
