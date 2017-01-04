'use strict'

const express = require('express');
const oauth = require('oracle-apex-oauth');
const app = express();
const session = require('express-session');
const request = require('request');
const config = require('./config');

app.use(session({
    secret: config.CLIENT_ID,
    resave: false,
    saveUninitialized: false
}));

const port = (process.env.PORT || 5000);
const server = app.listen(port, function(){
    console.log('Server is running on port ' + port);
});

app.use('/oauth', oauth({
    client_id: config.CLIENT_ID,
    client_secret: config.CLIENT_SECRET,
    flow: 'code',
    workspace: config.WORKSPACE,
    login_url: '/',
    logout_url: '/logout'
}));

app.get('/', function(req, res, next){
    if (!req.session.oauth){
        res.redirect('/oauth');
        return;
    }

    res.json(req.session.oauth);
});

app.get('/employees', function(req, res, next){
    if (!req.session.oauth){
        res.status(401).send('Unauthorized.');
        return;
    }

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + req.session.oauth.access_token
    }
    let url = 'https://apex.oracle.com/pls/apex/' + config.WORKSPACE + '/hr/employees/';
    request({
        method: 'get',
        headers: headers,
        url: url,
        json: true
    }, function(error, response, body){
        if (error || response.statusCode != 200){
            res.status(response.statusCode).send('Failed to get employees.');
            return;
        }
        res.json(body);
    });
});

app.get('/logout', function(req, res, next){
    res.send('Logged out.');
});

module.exports = app;
