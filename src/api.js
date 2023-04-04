const express = require("express");
const serverless = require("serverless-http");

const { sample_foods, sample_tags, sample_users } = require("./data");

const app = express();
const router = express.Router();

const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
router.use(bodyParser.json());

router.use(
  cors({
    // credentials: true,
    // origin: ["http://localhost:4200/"],
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
  })
);

//get All foods
router.get("/foods", (req, res) => {
  res.send(sample_foods);
});

//get food via search term
router.get("/foods/search/:searchTerm", (req, res) => {
  const searchTerm = req.params.searchTerm;
  const food = sample_foods.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  res.send(food);
});

//get  All tags
router.get("/foods/tags", (req, res) => {
  res.send(sample_tags);
});

//get food by special tag
router.get("/foods/tag/:tagName", (req, res) => {
  const tagName = req.params.tagName;
  const foods = sample_foods.filter((food) => food.tags?.includes(tagName));
  res.send(foods);
});

//get food by id
router.get("/foods/:foodId", (req, res) => {
  const foodId = req.params.foodId;
  const food = sample_foods.find((food) => food.id == foodId);
  res.send(food);
});

//login api
router.post("/users/login", (req, res) => {
  //var query = {email:req.body.email, password:req.body.password};

  let email = req.body.email;
  let password = req.body.password;
  //let user: any[] = [];
  //const { email, password } = req.body;

  let user = sample_users.find((user) => {
    if (user.password === password && user.email === email) return user;
  });

  if (user) {
    res.send(generaTokenResponse(user));
  } else {
    res.status(400).send("یوزرنیم یا پسورد نادرست است");
  }
});

const generaTokenResponse = (user) => {
  const token = jwt.sign(
    {
      email: user.email,
      isAdmin: user.isAdmin,
    },
    "TestyCodeiz",
    {
      expiresIn: "30d",
    }
  );
  user.token = token;
  return user;
};

router.get("/", (req, res) => {
  res.json({
    hello: "hi!",
  });
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
