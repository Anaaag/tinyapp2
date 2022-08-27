const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser')

app.set("view engine", "ejs");
app.use(cookieParser())


function generateRandomString() {
  return Math.random().toString(23).slice(8);
};

const urlDatabase = {
  'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', userID: '123' },
  '9sm5xK': { longURL: 'http://www.google.com', userID: '345' }
};


  const users = {
    "userRandomID": {
      id: "userRandomID",
      email: "ccc@example.com",
      password: "1234"
    },
    "user2RandomID": {
      id: "userRandomID",
      email: "ddd@example.com",
      password: "12345"
    }
  
  }


const bodyParser = require("body-parser");
const res = require("express/lib/response");
app.use(bodyParser.urlencoded({extended: true}));

//first route to update

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"],};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"]}
  res.render("urls_new", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL
  console.log(req.body);  
  res.redirect(`/urls/${shortURL}`)        
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL
  delete urlDatabase[shortURL] 
  res.redirect("/urls")
});

app.post("/urls/:id", (req, res) => {
  console.log(req.params)
  console.log(req.params.id)
  console.log(urlDatabase[req.params.id])
  res.redirect("/urls")
});

//LOGIN

app.post("/login", (req, res) => {
  const username = req.body.username
  res.cookie("username", username)
  res.redirect("/urls")
})


  app.get("/register", (req, res) => {
    const user = users[req.cookies.userId]
    if (user) return res.redirect("/urls")
    const templateVars = { shortURL: req.params.shortURL, longURL: req.params.url, user};
  res.render("registration", templateVars);
  });

  app.post("/register", (req, res) => {
    const {email, password} = req.body;
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
      password: password
    }
    res.cookie("userId", userId);
    console.log(users);
    res.redirect("/urls");
  });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});