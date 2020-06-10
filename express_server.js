const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs"); //asking app to use EJS as its template engine
app.use(cookieParser()); //asking app to use cookieParser parameter

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
  

//create random users ID
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@email.com",
    password: "purple-apple"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@email.com",
    password: "clear-text"
  }
}

const bodyParser = require("body-parser"); //this should be declared before all of the routes
app.use(bodyParser.urlencoded({extended: true}));




app.get("/", (req, res) => {
  res.send("Hello!");
 
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  //let templateVars = { urls: urlDatabase };
  console.log(req.cookies)
  let userID = req.cookies['user_ID'];
  console.log('userID', userID);
  let currentUserObj = users[userID];
  console.log('currentUserObj', currentUserObj);
  let email = 'myemail';
  //if (currentUserObject) {
  //  email = currentUserObj.email;
  //}
  //let templateVars = {username: req.cookies["username"], urls: urlDatabase};
  let templateVars = {email: email, urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
 // let templateVars = {username: req.cookies["username"]} //http://localhost8080/urls/new
 let templateVars = {email: req.cookies["email"]}
 res.render("urls_new", templateVars)                   //GET Route to show the Form to the user
});

app.post("/urls", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  let randShortURL = generateRandomString();
  urlDatabase[randShortURL] = req.body.longURL;
  res.redirect(`/urls/${randShortURL}`);
});

//deleate short URL
app.post("urls/:shortURL/delete", (req, res) => { //http://localhost:8080/urls/b2xVn2/delete
  let shortURLName = req.params.shortURL;
  //console.log("ShortURLName", shortURLName)
  //console.log('urlDatabase', urlDatabase)
  delete urlDatabase[shortURLName];
  res.redirect(`/urls`);
});

// display the form from urls_show
app.get("/urls/:id", (req, res) => {  
  let longURL = urlDatabase[req.params.id];
  res.render('urls_show', {shortURL: req.params.id, longURL: longURL});
});

// update URL
app.post('urls/:id', (req, res) => {
  let change = req.body.longURL;
  urlDatabase[req.params.id] = change;
  res.redirect('/urls');
});




//generate a Random ShortURL
function generateRandomString() {
let randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
let randomNumber = "";
for(var i = 0; i < 6; i++) {
  randomNumber += randomCharacters.charAt(Math.floor(Math.random()*randomCharacters.length));
}
return randomNumber;
}


//need to be on top of route definition
app.get("/urls/new", (req, res) => { 
  res.render("urls_new"); //GET Route to Show the Form to the User
});

app.get("/urls/:shortURL", (req, res) => { //route definition
  let shortURLName = req.params.shortURL;
  //let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[shortURLName]}; 
  let templateVars = {email: req.cookies["email"], shortURL: req.params.shortURL, longURL: urlDatabase[shortURLName]};
  res.render("urls_show", templateVars);
});


app.get("/u/:shortURL", (req, res) => {//shorter version for our redirect link: http://localhost:8080?u/shortURL
  let shortURLName = req.params.shortURL; // http://localhost:8080/u/b2xVn2
  let longURL = urlDatabase[shortURLName];
  res.redirect(longURL);
});


app.post("/logout", (req, res) => { //Logout
  console.log('logout');
  res.clearCookie("username");
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});



//added edit link on the main page
app.post("/urls?:shortURL/update", (req, res) => {
  delete urlDataBase[req.params.shortURL];
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/urls`);
});



//newUser = function(username) {
  //console.log("function running");
  // for (let newUser in user) {
  //  console.log();
  //  if (user[newUser].email === username) {
  //    return user[newUser];
  //  }
 // }
//};

function findUserByEmail(email, users) {
  for (let user_ID in users) {
    if (email === users[user_ID].email) {
      return false;
    }
  }
  return true;
};

app.get("/register", (req, res) => {  //   http://localhost:8080/register
     res.render("urls_register"); //return the register template
 });

app.post("/register", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  
  if (!email || !password) {
    res.statusCode = 400;
    res.end("Unknown");
  } else {
  
    let user_ID = generateRandomString();
    users[user_ID] = {id: user_ID,
                      email: email,
                      password: password}

   cookieParser.JSONCookie(user_ID)
   res.cookie("user_ID", user_ID);
   res.redirect("/urls");
    }
});







app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});