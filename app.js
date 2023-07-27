const express = require("express");

const app = express();

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
