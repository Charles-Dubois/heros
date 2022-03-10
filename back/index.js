const express = require("express");
const app = express();
app.use(express.json());
const superHeros = [
  {
    name: "Iron Man",
    power: ["money"],
    color: "red",
    isAlive: true,
    age: 46,
    image:
      "https://blog.fr.playstation.com/tachyon/sites/10/2019/07/unnamed-file-18.jpg?resize=1088,500&crop_strategy=smart",
  },
  {
    name: "Thor",
    power: ["electricity", "worthy"],
    color: "blue",
    isAlive: true,
    age: 300,
    image:
      "https://www.bdfugue.com/media/catalog/product/cache/1/image/400x/17f82f742ffe127f42dca9de82fb58b1/9/7/9782809465761_1_75.jpg",
  },
  {
    name: "Daredevil",
    power: ["blind"],
    color: "red",
    isAlive: false,
    age: 30,
    image:
      "https://aws.vdkimg.com/film/2/5/1/1/251170_backdrop_scale_1280xauto.jpg",
  },
];
app.use((_req, _res, next) => {
  console.log("ceci est un middleware");
  next();
});
app.get("/", (_req, res) => {
  res.send(
    "endpoint (/heroes) to show all heroes \n endpoint (/heroes/HeroesName) to show a hero"
  );
});

app.get("/heroes", (req, res) => {
  if (!req.params.heroes) {
    return res.json(superHeros);
  } else {
    superHeros.find((hero) => {
      return hero.name === req.params.name;
    });
  }
});

app.get("c", (req, res) => {
  const heroName = () =>
    superHeros.find((hero) => {
      return hero.name === req.params.name;
    });
  res.send(heroName());
});
app.delete("/heroes/:name", (req, res) => {
  const heroName = () =>
    superHeros.find((hero) => {
      return hero.name === req.params.name;
    });

  res.send(heroName);
});

app.get("/heroes/:name/powers", (req, res) => {
  const heroName = () =>
    superHeros.find((hero) => {
      return hero.name === req.params.name;
    });
  res.send(heroName().power);
});

app.post("/heroes", (req, res, next) => {
  req.body.name = req.body.name.toLowerCase();

  const checkHero = () =>
    superHeros.find((hero) => {
      return req.body.name === hero.name;
    });

  console.log(req.body.name);
  if (!checkHero()) {
    next();
  } else {
    res.send("error this super hero already exists");
  }
});
app.post("/heroes", (req, res) => {
  superHeros.push(req.body);
  res.send("Ok, héros ajouté");
});
app.patch("/heroes/:name/powers", (req, res) => {
  const heroName = () =>
    superHeros.find((hero) => {
      return hero.name === req.params.name;
    });
  heroName().power.push(req.body.power);
  res.send("Pouvoir ajouté !");
});
app.get("*", (_req, res) => {
  res.send("error 404");
});
app.listen(8000, () => console.log("listening on port 8000"));
