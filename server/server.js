require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
if (process.env.NODE_ENV == 'development') {
    process.env.MONGODB_URI = process.env.MONGODB_URI_LOCAL
    process.env.SEED = process.env.SEED_LOCAL
}

//Middlewares
// parse application/x - www - form - urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//habilitar carpeta public
app.use(express.static(path.resolve(__dirname , '../public')));

//Llamado de routes
app.use(require('./routes/index'));


mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify:false},(err) =>{
    if(err)throw err;
    console.log('Base de datos conectada');
})
.catch(err =>console.log)

app.listen(process.env.PORT, () => {
    console.log(`Iniciando el puerto ${process.env.PORT}`);
})