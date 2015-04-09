#!/usr/bin/env node

"use strict";

var http = require("http"), querystring = require("querystring"), express = require("express");
var app = express();
app.use(express.static('public'));

function status(res, stat){
    res.json(stat);
}

function play(req, res, act, stat, obj2index, senario){
    var ai = Math.floor(Math.random() * 5);
    var result = senario[obj2index[act]][ai];
    stat.outcome = result;
    if (result == "win"){
        stat.wins+=1;
    } else if (result == "lose") {
        stat.losses+=1;
    } else if (result == "tie") {
        stat.ties+=1;
    } else {
        stat.outcome= "did not count";
    }
    status(res, stat);
    
}

var obj2index = {rock: 0, paper: 1, scissors: 2, lizard: 3, spock: 4};
var senario = [ ["tie", "lose", "win" , "win", "lose"],
                ["win", "tie", "lose" , "lose", "win"],
                ["lose", "win", "tie" , "win", "lose"],
                ["lose", "win", "lose" , "tie", "win"],
                ["win", "lose", "win" , "lose", "tie"]];
var stat = {outcome: "no play", wins: 0, losses: 0, ties: 0};


app.all('/play/:move', function(req, res) {
    var move = req.params.move;
    if(move==="rock" || move==="paper" || move==="scissors" || move==="lizard" || move==="spock"){
        play(req, res, move, stat, obj2index, senario);
    } else {
        stat.outcome = "no play";
        status(res, stat);
    }
});

app.all('*', function(req, res) {
    stat.outcome = "no play";
    //res.json(stat);
    res.sendFile(__dirname + '/public/play.html');
});


var server = app.listen(11111);
var address = server.address();
console.log("nudge is listening at http://localhost:" + address.port + "/");
