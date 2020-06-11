const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs"); //asking app to use EJS as its template engine

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
  
//create user Object
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    //password: "purple-monkey-dinosaur"
    pasword: 'abc'
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

//generate a Random ShortURL
function generateRandomString() {
  let randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let randomNumber = "";
  for(var i = 0; i < 6; i++) {
    randomNumber += randomCharacters.charAt(Math.floor(Math.random()*randomCharacters.length));
  }
  return randomNumber;
}

function findUserByEmail(email) {
  for (let user_ID in users) {
      if (email === users[user_ID].email) {
          return users[user_ID];
    }
  }
  return false;
};


app.get("/", (req, res) => {
  res.redirect('/urls');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// ============
// === URLS ===
// ============
app.get("/urls", (req, res) => {
  const userId = req.cookies.user_ID;
  if (!userId) {
    res.redirect('/login');
  } else {
    const loggedInUser = users[userId];
    const templateVars = {
      email: loggedInUser.email,
      urls: urlDatabase
    };

    res.render("urls_index", templateVars);
  }
});

app.post("/urls", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  const randShortURL = generateRandomString();
  urlDatabase[randShortURL] = req.body.longURL;
  res.redirect(`/urls/${randShortURL}`);
});


app.get("/urls/new", (req, res) => {
  const userId = req.cookies.user_ID;
  const loggedInUser = users[userId];
 

  //const templateVars = { email: loggedInUser.email };
  //res.render("urls_new", templateVars);
  if (userId) {
    let templateVars = {user: loggedInUser, urls: urlDatabase, email: loggedInUser.email}
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  
  }                   
});

app.get("/urls/:shortURL", (req, res) => { //route definition
  const shortURLName = req.params.shortURL;
  const userId = req.cookies.user_ID;
  const loggedInUser = users[userId];

  const templateVars = {
    email: loggedInUser.email,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[shortURLName]
  };

  res.render("urls_show", templateVars);
});

//deleate short URL
//http://localhost:8080/urls/b2xVn2/delete
app.post("urls/:shortURL/delete", (req, res) => {
  const shortURLName = req.params.shortURL;
  delete urlDatabase[shortURLName];
  res.redirect(`/urls`);
});

// display the form from urls_show
app.get("/urls/:id", (req, res) => {  
  const longURL = urlDatabase[req.params.id];
  res.render('urls_show', {
    shortURL: req.params.id,
    longURL: longURL
  });
});

// update URL
app.post('urls/:id', (req, res) => {
  const change = req.body.longURL;
  urlDatabase[req.params.id] = change;
  res.redirect('/urls');
});


app.get("/u/:shortURL", (req, res) => {//shorter version for our redirect link: http://localhost:8080?u/shortURL
  const shortURLName = req.params.shortURL; // http://localhost:8080/u/b2xVn2
  const longURL = urlDatabase[shortURLName];
  res.redirect(longURL);
});


//added edit link on the main page
app.post("/urls?:shortURL/update", (req, res) => {
  delete urlDataBase[req.params.shortURL];
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/urls`);
});


// ======================
// === Authentication ===
// ======================
app.get("/register", (req, res) => {  //   http://localhost:8080/register
  res.render("register"); //return the register template
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  if (!email || !password) {
    res.statusCode = 400;
    res.end("Please provide email and password!");
  } else {
    if (!findUserByEmail(email)) {
    const user_ID = generateRandomString();
    users[user_ID] = {
      id: user_ID,
      email: email,
      password: password
    }
    res.cookie("user_ID", user_ID);
    res.redirect("/urls");
    } else {
      res.statusCode = 400;
      res.end("User has been register"); 

    }
  }
});
   
  

app.get('/login', (req, res) => {
  res.render("login", {});
  
})

app.post("/login", (req, res) => {

const user = findUserByEmail(req.body.email);
if(user && user.password === req.body.password) {
  res.cookie("user_ID", user.id);
  res.redirect("/urls");
} else {
  res.status(401).send("Failed to login");
  
}
  
  
});

//Logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_ID");
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



