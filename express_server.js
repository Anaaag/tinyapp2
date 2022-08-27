const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser')

app.set("view engine", "ejs");
app.use(cookieParser())


function generateRandomString() {
  return Math.random().toString(23).slice(8);
};



  const getUserByEmail =function(email) {
    for (let id in users) {
      if (users[id].email === email) {
        return users[id]
      }
  
    }
    return null;
  }

  const urlsForUser = function(id) {
    const usersURLs = {};
    for (const key in urlDatabase) {
    if (urlDatabase[key].userId === id) {
      usersURLs[key] = urlDatabase[key];
      console.log(usersURLs);
    }
    }
     return usersURLs;
   }


  const urlDatabase = {
  
    'b2xVn2':  {
      longURL: 'http://www.lighthouselabs.ca', userId: "userRandomID"
    },
  
    '9sm5xK': {
      longURL: 'http://www.google.com', userId: "userRandomID" 
  }
  }
  
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
  }

  

const bodyParser = require("body-parser");
const res = require("express/lib/response");
app.use(bodyParser.urlencoded({extended: true}));

//first route to update

app.get("/urls", (req, res) => {
  const user = users[req.cookies.userId]
  if (!user) return res.redirect("/login")
  const usersURLs = urlsForUser(user.id)
  const templateVars = { urls: usersURLs,  user};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies.userId]
  if (!user) return res.sendStatus(401)
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies.userId]
  if (!user) return res.sendStatus(401)
  const shortURL = req.params.shortURL
  if (user.id !== urlDatabase[shortURL].userId) return res.sendStatus(403)
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL,  user};
  console.log(req.cookies["user"]); 
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const user = users[req.cookies.userId]
  if (!user) return res.sendStatus(401)    
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = {longURL: req.body.longURL, userId: user.id}  
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`)  
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const user = users[req.cookies.userId]
  if (!user) return res.sendStatus(401)
  const shortURL = req.params.shortURL
  if (user.id !== urlDatabase[shortURL].userId) return res.sendStatus(403)
  delete urlDatabase[shortURL] 
  res.redirect("/urls")
});

app.post("/urls/:id", (req, res) => {
  const user = users[req.cookies.userId]
  if (!user) return res.sendStatus(401)
  const shortURL = req.params.id;
  if (user.id !== urlDatabase[shortURL].userId) return res.sendStatus(403)
  urlDatabase[shortURL].longURL = req.body.longURL
  res.redirect("/urls")
});

//LOGIN

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email);
  if (!email || !password) {
    return res.sendStatus(400)
  }
  if (!user) return res.status(400).send("Invalid Login")

  if (password !== user.password) return res.status(400).send("Invalid Login")


  res.cookie("userId", user.id);
  res.redirect("/urls");
})

app.get("/login", (req, res) => {
  const user = users[req.cookies.userId]
  if (user) return res.redirect("/urls")
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],  user}
  res.render("login", templateVars);
})

//LOGOUT

app.post("/logout", (req, res) => {

  res.clearCookie("userId");
  res.redirect("/login");
});







//REGISTER

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