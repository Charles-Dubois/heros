const express = require("express");
const app = express();
app.use(express.json());
//* postgreSQL
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

//* mongoDB
const mongoose = require("mongoose");
const mongoKey = require("./mongoKey");
const Hero = require("./models/heroModel");
mongoose
  .connect(mongoKey, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Mongo connection done"))
  .catch((err) => console.log(err));
app.get("/", (_req, res) => {
  res.send(
    "endpoint (/heroes) to show all heroes \n endpoint (/heroes/HeroesName) to show a hero"
  );
});

app.get("/heroes", async (req, res) => {
  //* MongoDB
  let heroes;
  try {
    heroes = await Hero.find();
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }

  res.json(heroes);

  //* PostGreSQL
  // let heroes;
  // try {
  //   heroes = await Postgres.query("SELECT * FROM heroes");
  // } catch (err) {
  //   console.log(err);
  //   return res.status(400).json({ message: "Error" });
  // }
  // const result = heroes.rows;
  // res.json(result);
});

app.get("/heroes/:name", async (req, res) => {
  //* MongoDB
  let heroes;
  try {
    heroes = await Hero.find(req.params);
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }

  res.json(heroes);

  //* PostGreSQL
  // let heroes;
  // try {
  //   heroes = await Postgres.query(
  //     "SELECT * FROM heroes WHERE LOWER(name)= $1",
  //     [req.params.name.toLowerCase()]
  //   );
  // } catch (err) {
  //   console.log(err);
  //   return res.status(400).json({ message: "Error" });
  // }
  // const result = heroes.rows;
  // res.json(result);
});

app.delete("/heroes/:name", async (req, res) => {
  try {
    await Hero.findOneAndDelete(req.params.name);
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }

  res.send("hero removed");

  //* PostGreSQL
  // const heroName = () =>
  //   superHeros.find((hero) => {
  //     return hero.name === req.params.name;
  //   });

  // res.send(heroName);
});

app.get("/heroes/:name/powers", async (req, res) => {
  //* MongoDB
  let powers;
  try {
    powers = await Hero.find(req.params).select("power");
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }
  powers = powers[0].power;

  res.json(powers);

  //* PostGreSQL

  // let heroes;
  // try {
  //   heroes = await Postgres.query(
  //     "SELECT power FROM heroes WHERE LOWER(name)= $1",
  //     [req.params.name.toLowerCase()]
  //   );
  // } catch (err) {
  //   console.log(err);
  //   return res.status(400).json({ message: "Error" });
  // }

  // const result = heroes.rows;
  // res.json(result);
});

app.post("/heroes", async (req, res) => {
  try {
    await Hero.create(req.body);
  } catch (err) {
    console.log(err);

    return res.status(400).send("error 400");
  }
  res.status(201).json({
    message: "hero added ! ",
    description: req.body,
  });
  //* PostGreSQL
  // add = req.body;
  // try {
  //   await Postgres.query(
  //     "INSERT INTO heroes(name, power, color, isAlive, age, image) VALUES($1, $2, $3 , $4 , $5, $6)",
  //     [add.name, add.power, add.color, add.isAlive, add.age, add.image]
  //   );
  // } catch (err) {
  //   console.log(err);
  //   return res.status(400).json({ message: "Error" });
  // }
  // res.send("hero added");
});

app.patch("/heroes/:name/powers", async (req, res) => {
  //* MongoDB
  let powers;
  try {
    powers = await Hero.find(req.params).select("power");
    powers = powers[0].power;
    powers.push(req.body.power);
    console.log(powers);
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }

  try {
    await Hero.updateOne(
      { name: req.params.name },
      {
        power: powers,
      }
    ).select("power");
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }

  res.json(powers);

  //* PostGreSQL
  // let heroes;
  // try {
  //   heroes = await Postgres.query(
  //     "SELECT power FROM heroes WHERE LOWER(name)= $1",
  //     [req.params.name.toLowerCase()]
  //   );
  // } catch (err) {
  //   console.log(err);
  //   return res.status(400).json({ message: "Error" });
  // }
  // const result = heroes.rows[0].power;

  // result.push(req.body.power);

  // try {
  //   await Postgres.query("UPDATE heroes SET power = $1 WHERE LOWER(name)= $2", [
  //     result,
  //     req.params.name.toLowerCase(),
  //   ]);
  // } catch (err) {
  //   console.log(err);
  //   return res.status(400).json({ message: "Error" });
  // }
  // res.send("power added");
});

app.get("*", (_req, res) => {
  res.send("error 404");
});
app.listen(8000, () => console.log("listening on port 8000"));
