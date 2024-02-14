const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const bcrypt = require("bcryptjs");
require("./mongoose/db");
const user = require("./mongoose/userModel");
const session = require("express-session");

app.use(express.json());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
// const home = app.use(express.static(path.join(__dirname, "public")))

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello I am home page");
  res.render("home");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", async (req, res) => {
  const { userName, password, email } = req.body;
  // hashing password
  const hashedPassword = await bcrypt.hash(password, 10);
  const createUser = await user.create({
    userName: userName,
    email: email,
    password: hashedPassword,
  });
  if (createUser) {
    req.session.user = user;
    res.redirect("/logIn");
    // res.status(200).send("user created successfully..");
  } else {
    return res.status(400).send("user not created successfully..");
  }
});

app.post("/logIn", async (req, res) => {
  const { password, email } = req.body;

  const findUser = await user.findOne({ email });
  if (!user) {
    return res.status(400).send("User not found");
  }
  const comparedPassword = await bcrypt.compare(password, findUser.password);
  if (!comparedPassword) {
    return res.status(400).send("something is wrong");
  } else {
    return res.status(200).send("User signIn sucessfully");
  }
});
app.post("/logout", async (req, res) => {
  req.session.destroy();
  res.send("user log out sucessfully...");
});

app.post("/uploadVideo", (req, res) => {});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
