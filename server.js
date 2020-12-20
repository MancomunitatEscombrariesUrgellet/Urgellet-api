
// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');


// Configurar cabeceras y cors
//Això es necessari si volem que l'aplicació feta amb Angular pugui fer una petició a una API que éstà a un altre servidor.
//He copiat el codi de l'enllaç: https://victorroblesweb.es/2018/01/31/configurar-acceso-cors-en-nodejs/

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});





////////////////////////////////////////////////////////
// Conexión a la base de datos MongoDB a traves de Mongoose

// Parametros de conexion
const USER = process.env.user;
const PASSWORD = process.env.password;
const DATA_BASE = "UrgelletRecicla";

// Preparando cadena de conexion
const dbURI = `mongodb+srv://${USER}:${PASSWORD}@meucluster.d0ez5.mongodb.net/${DATA_BASE}?retryWrites=true&w=majority`;
const OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};




//var dbURI = 'mongodb://localhost/db_mean';
//mongoose.connect(dbURI, {useMongoClient: true});
mongoose.connect(dbURI, OPTIONS);
// Configuracion de los eventos de la conexión Mongoose
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// Si el proceso 'Node' termina, se cierra la conexión Mongoose
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});









// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
//app.use(express.static("public"));


//Cfg. del directorio 'dist' como directorio estatico.
//En este directorio tendremos los archivos obtenidos en el build de nuestra aplicación Angular
//app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'views')));



//Cfg. de las rutas
app.get('/api', (req, res) => {
  res.send('La API ja funciona');
});

require('./server/routes/tarea')(app);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

//Cfg. del puerto de escucha
const port = process.env.PORT || '3000';
app.set('port', port);

//Creamos el servidor http con la aplicación express y abrimos puerto
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));



