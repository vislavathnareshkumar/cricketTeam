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
