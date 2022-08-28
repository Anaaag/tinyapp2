const express = require("express");
const app = express();
const PORT = 8080; 
const cookieSession = reuire('cookie-session');
const bcrypt = require('bcryptjs');
const bodyParser = require("body-parse");
const { getUserByEmail, generateRandomString, urlsForUser } = require('./helpers');
// const res = require("express/lib/response");


// App config and middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: ["key1"]
}));

// Test database 
const urlDatabase = {

  'b2xVn2': {
    longURL: 'http://www.lighthouselabs.ca', userId: "userRandomID"
  },

  '9sm5xK': {
    longURL: 'http://www.google.com', userId: "userRandomID"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "aaa@example.com",
    password: "1234"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "bbb@example.com",
    password: "12345"
  }
};


// Get routing 
app.get("/register", (req, res) => {
  const user = users[req.session.userId]
  if (user) return res.redirect("/urls")
  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.url, user };
  res.render("registration", templateVars);
});

app.get("/login", (req, res) => {
  const user = users[req.sessions.userId]
  if (user) return res.redirect("/urls")
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user }
  res.render("login", templateVars);
});

// User dashboard 
app.get("/urls", (req, res) => {
  const user = users[req.session.userId]
  if (!user) return res.redirect("/login")
  const usersURLs = urlsForUser(user.id)
  const templateVars = { urls: usersURLs, user };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.session.userId]
  if (!user) return res.sendStatus(401)
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

// Short url 
app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.ession.userId]
  if (!user) return res.sendStatus(401)
  const shortURL = req.params.shortURL
  if (user.id !== urlDatabase[shortURL].userId) return res.sendStatus(403)
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user };
  console.log(req.session["user"]);
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]?.longURL
  res.redirect(longURL);
});

// Post routing 
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(req.body.password)
  if (!email || !password) {
    return res.status(400).send("Error")
  }
  const user = getUserByEmail(email)

  if (user) {
    return res.status(400).send("Account already exists")
  }

  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email: email,
    password: hashedPassword
  }
  res.session.userId = userId;
  console.log(users);
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);
  if (!email || !password) {
    return res.sendStatus(400)
  }
  if (!user) return res.status(400).send("Invalid Login")

  if (!bcrypt.compareSync(password, users.password)) return res.status(400).send("Invalid Password")

  req.session.userId = userId[getUserByEmail(email, users)].id;
  res.redirect("/urls");
});

// New short url
app.post("/urls", (req, res) => {
  const user = users[req.session.userId]
  if (!user) return res.sendStatus(401)
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = { longURL: req.body.longURL, userId: user.id }
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const user = users[req.session.userId]
  if (!user) return res.sendStatus(401)
  const shortURL = req.params.shortURL
  if (user.id !== urlDatabase[shortURL].userId) return res.sendStatus(403)
  delete urlDatabase[shortURL]
  res.redirect("/urls")
});

// Edit short url

app.post("/urls/:id", (req, res) => {
  const user = users[req.session.userId]
  if (!user) return res.sendStatus(401)
  const shortURL = req.params.id;
  if (user.id !== urlDatabase[shortURL].userId) return res.sendStatus(403)
  urlDatabase[shortURL].longURL = req.body.longURL
  res.redirect("/urls")
});

app.post("/logout", (req, res) => {
  res.session = null;
  res.redirect("/login");
});

// Run server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});