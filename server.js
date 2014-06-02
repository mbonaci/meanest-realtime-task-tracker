'use strict';

var express         = require('express'),
    fs              = require('graceful-fs'),
    path            = require('path'),
    mongoose        = require('mongoose'),
    morgan          = require('morgan'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('express-method-override'),
    app             = express(),
    server          = require('http').createServer(app),
    Primus          = require('primus');

var primus     = new Primus(server, { parser: 'JSON', transformer: 'sockjs' }),
    TASK_STATE = {
      ACTIVE    : 'Active',
      ON_HOLD   : 'On hold',
      COMPLETE  : 'Complete'
    },
    db;

// generate client library
// should go in deployment script, but it's fine for now
primus.save(path.join(__dirname, 'public/js/primus.js'));


/**
 * @primus events originated on the client (incoming):
 * incoming:client no       - outgoing:all:client no
 * incoming:task creation   - outgoing:others:task object
 * incoming:task order      - outgoing:others:info
 * incoming:task state      - outgoing:others:task id, new state
 * incoming:task deletion   - outgoing:others:task id
 */

primus.on('connection', function primusConnection(spark) {

  // immediately report number of connected clients
  primus.write({
    type: 'client no',
    meat: {clients: primus.connected}
  });

  // listen on client events
  spark.on('data', function primusData(data) {

    switch (data.type) {

      case 'client no':
        primus.write({
          type: 'client no',
          meat: {'clients': primus.connected}
        });
        break;

      case 'task creation':
        toOthers(spark.id, data);
        break;

      case 'task order':
        toOthers(spark.id, data);
        break;

      case 'task state':
        toOthers(spark.id, data);
        break;

      case 'task deletion':
        toOthers(spark.id, data);
        break;

    }
  });
});


/** client disconnects: refresh number of connected clients **/
primus.on('disconnection', function primusDisconnection(spark) {
  primus.write({
    type: 'client no',
    meat: {clients: primus.connected}
  });
});


// emits to all clients except the one with supplied id
var toOthers = function emitToOthers(exceptClientWithId, data) {
  primus.forEach(function (spark, id, connections) {

    console.log(spark.id, exceptClientWithId); // todo: remove

    if (spark.id !== exceptClientWithId) {
      spark.write(data);
    }
  });
};



/**
 * Mongo
 */

mongoose.connect('mongodb://127.0.0.1:27017/todo');
db = mongoose.connection;

db.once('open', function mongoReady() {
  console.log("Mongo 'app' and running!");
});


/**
 * Model
 */
var Task = mongoose.model('Task', {
  name  : String,
  desc  : String,
  state : String,
  order : Number
});


var updateTask = function mongoUpdate(taskId, changes, cb) {
  Task.findByIdAndUpdate(taskId, changes, cb);
};


/**
 * Express
 */
app.use(express.static(__dirname + '/public'));  // public root
// log requests with morgan, colors and all
app.use(morgan('dev'));
// parse application/json and application/x-www-form-urlencoded
app.use(bodyParser());  // allows req.body.param_name
app.use(methodOverride());



/**
 * API routes
 */

// fetch all
app.get('/api/tasks', function(req, res) {

  Task.find(function(err, tasks) {
    if (err)
      res.send(err);

    res.json(tasks);
  });
});


/** create new task **/
app.put('/api/tasks', function(req, res) {
  var newTask = {
    name  : req.body.name,
    desc  : req.body.desc,
    order : req.body.order,
    state : TASK_STATE.ACTIVE
  };

  // add task to db
  Task.create(newTask, function(err) {
    if (err)
      res.send(err);

    res.send(200);
  });
});


/** update task (order, state) **/
app.post('/api/tasks/:task_id', function(req, res) {
//  var stateChanged = req.body.meat.hasOwnProperty('state');
//  console.log('state changed: ', stateChanged);

  console.log('task_id: ', req.params.task_id);
  console.log('meat: ', req.body.meat);

  updateTask(req.params.task_id, req.body.meat, function(err, doc) {
    if (err) {
      console.log('error: ', err);
      res.status(500).send(err);
    } else {
      console.log('success: ', doc);
      res.send(200);
    }
  });


  // check what changed to avoid overhead
//  if (stateChanged) {

    // for simplicity, get and return all tasks after reordering
//    Task.find(function(err, tasks) {
//      if (err)
//        res.send(err);
//
//      res.json(tasks);
//    });

//  } else { // state changed

    // notify other connected users
//    primus.write({
//      type: 'task state',
//      meat: {
//        id: req.params.task_id,
//        state: req.body.state
//      }
//    });
//  }
});


/** delete task **/
app.delete('/api/tasks/:task_id', function(req, res) {
  Task.remove({_id : req.params.task_id}, function(err, task) {
    if (err)
      res.send(err);
    else
      res.send(200);

    // get and return all the tasks
//    Task.find(function(err, tasks) {
//      if (err)
//        res.send(err);
//      res.json(tasks);
//    });
  });
});


server.listen(3000);
console.info("Todo app ready to serve you, sir!");

// application -------------------------------------------------------------
app.get('*', function(req, res) {
    var file = __dirname + (req.url == '/' ? '/index.html' : req.url);
    fs.readFile(file, function(error, data) {
      if (error) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }
      res.writeHead(200);
      res.end(data, 'utf-8');
    });
//  res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});





//io.sockets.on('connection', function (socket) {
//  socket.emit('news', { hello: 'world' });
//  socket.on('my other event', function (data) {
//    console.log(data);
//  });
//});

//app.listen(3000);
//io = io.listen(server);