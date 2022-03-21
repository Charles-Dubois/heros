const express = require("express");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const app = express();
app.use(express.json());
dotenv.config({
  path: "./config.env",
});
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

// app.use((_req, _res, next) => {
//   console.log("ceci est un middleware");
//   next();
// });
app.get("/", (_req, res) => {
  res.send(
    "endpoint (/heroes) to show all heroes \n endpoint (/heroes/HeroesName) to show a hero"
  );
});

app.get("/heroes", async (req, res) => {
  let heroes;

  try {
    heroes = await Postgres.query("SELECT * FROM heroes");
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Error" });
  }
  const result = heroes.rows;
  res.json(result);
});

app.get("/heroes/:name", async (req, res) => {
  let heroes;
  try {
    heroes = await Postgres.query(
      "SELECT * FROM heroes WHERE LOWER(name)= $1",
      [req.params.name.toLowerCase()]
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Error" });
  }

  const result = heroes.rows;
  res.json(result);
});

app.delete("/heroes/:name", (req, res) => {
  const heroName = () =>
    superHeros.find((hero) => {
      return hero.name === req.params.name;
    });

  res.send(heroName);
});

app.get("/heroes/:name/powers", async (req, res) => {
  let heroes;
  try {
    heroes = await Postgres.query(
      "SELECT power FROM heroes WHERE LOWER(name)= $1",
      [req.params.name.toLowerCase()]
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Error" });
  }

  const result = heroes.rows;
  res.json(result);
});

app.post("/heroes", async (req, res, next) => {
  add = req.body;
  try {
    await Postgres.query(
      "INSERT INTO heroes(name, power, color, isAlive, age, image) VALUES($1, $2, $3 , $4 , $5, $6)",
      [add.name, add.power, add.color, add.isAlive, add.age, add.image]
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Error" });
  }
  res.send("hero added");
});

app.patch("/heroes/:name/powers", async (req, res) => {
  let heroes;
  try {
    heroes = await Postgres.query(
      "SELECT power FROM heroes WHERE LOWER(name)= $1",
      [req.params.name.toLowerCase()]
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Error" });
  }
  const result = heroes.rows[0].power;

  result.push(req.body.power);

  try {
    await Postgres.query("UPDATE heroes SET power = $1 WHERE LOWER(name)= $2", [
      result,
      req.params.name.toLowerCase(),
    ]);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Error" });
  }
  res.send("power added");
});

app.get("*", (_req, res) => {
  res.send("error 404");
});
app.listen(8000, () => console.log("listening on port 8000"));
