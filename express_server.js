const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
  

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
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
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



app.get("/urls/new", (req, res) => { 
  res.render("urls_new"); //GET Route to Show the Form to the User
});

app.get("/urls/:shortURL", (req, res) => { //route definition
  let shortURLName = req.params.shortURL;
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[shortURLName]}; /* What goes here?*/
  res.render("urls_show", templateVars);
});


app.get("/u/:shortURL", (req, res) => {//shorter version for our redirect link: http://localhost:8080?u/shortURL
  let shortURLName = req.params.shortURL; 
  let longURL = urlDatabase[shortURLName];
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});