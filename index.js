'use strict'

const express = require('express');
const oauth = require('oracle-apex-oauth');
const app = express();
const session = require('express-session');
const request = require('request');
const debug = require('debug')("index");
const config = require('./config');

app.use(session({
    secret: config.CLIENT_ID,
    resave: false,
    saveUninitialized: false
}));

const port = (process.env.PORT || 5000);
const server = app.listen(port, function(){
    debug('Server is running on port ' + port);
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
        debug("OAuth Token not found. Redirecting to authentication url.");
        res.redirect('/oauth');
        return;
    }

    res.json(req.session.oauth);
});

app.get('/employees', function(req, res, next){
    let headers = {
        'Content-Type': 'application/json'
    }
    if (req.session && req.session.oauth && req.session.oauth.access_token){
        headers.Authorization = "Bearer " + req.session.oauth.access_token;
    }
    let url = 'https://apex.oracle.com/pls/apex/' + config.WORKSPACE + '/hr/employees/';
    request({
        method: 'get',
        headers: headers,
        url: url,
        json: true
    }, function(error, response, body){
        if (error || response.statusCode != 200){
            debug("Failed to get employees.");
            if (response.statusCode == 401){
                let body = "<html><body>Authentication Required<br/><a href='/oauth'>Login</a></body></html>";
                return res.status(response.statusCode).send(body);
            }
            return res.status(response.statusCode).send(body);
        }
        res.json(body);
    });
});

app.get('/logout', function(req, res, next){
    res.send('Logged out.');
});

module.exports = app;
