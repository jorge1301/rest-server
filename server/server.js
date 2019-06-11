require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

//Middlewares
// parse application/x - www - form - urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Llamado de routes
app.use(require('./routes/usuario'));


mongoose.connect(process.env.URLDB, { dbName: 'cafe',useNewUrlParser: true, useCreateIndex: true, useFindAndModify:false},(err) =>{
    if(err)throw err;
    console.log('Base de datos conectada');
})
.catch(err =>console.log)

app.listen(process.env.PORT, () => {
    console.log('Iniciando el puerto 3000');
})