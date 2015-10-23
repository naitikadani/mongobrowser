var express = require('express');
var app = express();                          // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var http = require('http');
var server = http.createServer(app);
var assert = require('assert');


var MongoClient = require('mongodb').MongoClient;
var db = null;

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ======================================
app.set('port', (process.env.PORT || 5009));
app.listen(app.get('port'));
console.log("App listening on port: 5009");


app.post('/connect',function(req,res){
    var host = req.body.host;
    var port = req.body.port;
    var username = req.body.username;
    var password = req.body.password;
    //var dbname = req.body.dbname.name; //
    var dbname = null;
    if(req.body.dbname)
    {
        if(typeof(req.body.dbname)=="object"){
            dbname =  req.body.dbname.name;
        }else{
            dbname = req.body.dbname;
        }
       // dbname =  req.body.dbname.name
    }
    var mongourl
    if(username && password){
        if(dbname){
            mongourl = 'mongodb://'+username+':'+password+'@'+host+':'+port+'/'+dbname;
        }else{
            mongourl = 'mongodb://'+username+':'+password+'@'+host+':'+port;
        }
    }else if(dbname){
        mongourl = 'mongodb://'+host+':'+port+'/'+dbname;

    }else {
        mongourl = 'mongodb://'+host+':'+port+'/examples';
    }

    MongoClient.connect(mongourl, function(err, databaseconnection) {
        console.log("Connected correctly to server");
        db= databaseconnection;
        if(!err){

            res.json('1');
        }else{
            res.json('0');
        }
    });

});
app.get('/mongodump',function(req,res){
    var param = req.query;

    var host = param.host;
    var port = param.port;
    var username = req.body.username;
    var password = req.body.password;

    var spawn = require('child_process').spawn;
    var args = ['--host',host,'--port',port,'--db', 'pcat', '--collection', 'products','--out','/home/vishant/tmp']
        , mongodump = spawn('/usr/bin/mongodump', args);
        mongodump.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });
        mongodump.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });
        mongodump.on('exit', function (code) {
            console.log('mongodump exited with code ' + code);
        });
});
app.post('/mongodatabases', function(req, res) {
   /* var dbNames = []
    var adminDb = db.admin();
    dbs = adminDb.runCommand({listDatabases: 1})
    for (var i in dbs.databases) {
        dbNames.push(dbs.databases[i].name)
    }
    res.json(dbNames);*/

    db.admin().listDatabases(function(err, dbs) {
        assert.equal(null, err);
        assert.ok(dbs.databases.length > 0);
        if(err){
            dbs = {};
            res.json(dbs);
        }
        else{
            res.json(dbs);
        }
    });
})

app.post('/mongodata', function(req, res) {
    var myFunc = function(err, docs){
        if (err)
            res.send(err)
        res.json(docs);
    }

    var params = req.body.text;

    var splited = params.split(".");
    splited[1] = "collection('"+splited[1]+"')";
    params = splited.join(".");

    params = params+".toArray(myFunc)";
    eval(params);

});

app.post('/mongocollections', function(req, res) {
    var host = req.body.host;
    var port = req.body.port;
    var username = req.body.username;
    var password = req.body.password;
    var dbname = req.body.dbname; //
    /*if(req.body.dbname)
    {
        var dbname =  req.body.dbname.name
    }*/
    var mongourl
    if(username && password){
        mongourl = 'mongodb://'+username+':'+password+'@'+host+':'+port;
    }else if(dbname){
        mongourl = 'mongodb://'+host+':'+port+'/'+dbname;
    }else {
        mongourl = 'mongodb://'+host+':'+port;
    }

    MongoClient.connect(mongourl, function(err, databaseconnection) {
        if(err) throw err;
        if(!err){
            db = databaseconnection;
            databaseconnection.collections(function(err, collections){
            //res.json(collections);
                    res.json(collections.map(function(collectionnames) {
                        return collectionnames.s.name;
                    })
                    );
        });
        }
    });
});




app.post('/mongoexecuteasits', function(req, res) {
    var callback = function(err, docs){
        if (err)  {
            res.send(err)
        }
        res.json(docs);
    }

    var params = req.body.text;

    var splited = params.split(".");
    splited[1] = "collection('"+splited[1]+"')";
    params = splited.join(".");

    params = params;
    eval(params);

});


app.all('*', function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');//'https://'+req.headers.host
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    if ('OPTIONS' == req.method) return res.send(200);
    next();
});

// application -------------------------------------------------------------
app.get('/', function(req, res) {
    res.sendFile('index.html', {
        root: path.join(__dirname, '../public')
    })
});


