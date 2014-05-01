
/**
 * Module dependencies.
 */

var express = require('express')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
//var server = http.createServer();

app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(__dirname));
});
 
app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./routes')(app)

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

 
//websockets
var io = require('socket.io').listen(server);
var users = {};
io.sockets.on('connection',function(socket){
  console.log("la sochket inicio correctamente");
  //Cuando el cliente envia un mensaje
  socket.on('enviarMensaje', function(msg){
    //Enviarselo a todos los sockets
    datos = new Array;
    datos[0] = socket.nick;
    datos[1] = msg;
    io.sockets.emit('cargarMensaje',datos);
  });
  socket.on('enviarUsuario',function(user){
    
    if(users[user])
      socket.emit("errorUsuario");
    else 
    {
      socket.nick = user;
      users[user] = user;
      io.sockets.emit("usuario", users);
    }  
  });
  socket.on('disconnect',function(){
    delete users[socket.nick];
    io.sockets.emit('userDisconnect', users);
  });
  /*
  socket.on("prueba", function(){
    console.log("la sochket inicio correctamente");
    var mensaje = "Hola Socket :)";
    io.sockets.emit("nuevoMensaje",mensaje);
  });*/
});