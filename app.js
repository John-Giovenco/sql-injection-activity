const http = require('http'),
path = require('path'),
express = require('express'),
bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const db = new sqlite3.Database(':memory:');
db.serialize(function () {
 db.run(â€œCREATE TABLE user (username TEXT, password TEXT, title TEXT)â€œ);
 db.run(â€œINSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')â€œ);
});

app.get('/', function (req, res) {
    res.sendFile('indes.html');
});

app.post('/login', function (req,res) {
    var username = req.body.username;
    var password = req.body.password;
    var query = "SELECT title FROM user where username = '" + username + "' and password = '" + password + "";

    console.log("username: " + username);
    console.log("password: " + password);
    console.log('query: ' + query);

    db.get(query, function (err, row) {
        
        if (err) {
            console.log('ERROR', err);
            res.redirect("/index.html#error")
        } else if (!row) {
            res.redirect("/index.html#unathorized");
        } else {
            res.send('Hello <b>' + row.title + '!</b><br /> This file contais your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/index.html"> go back to login</a>');
        }
    });
});

app.listen(3000);