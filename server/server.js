const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

if (process.env.NODE_ENV !== 'development') {
    require('dotenv').config();
    
}else{
    require('dotenv').config();
    process.env.MONGODB_URI = process.env.MONGODB_URI_LOCAL
       
}

//Middlewares
// parse application/x - www - form - urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Llamado de routes
app.use(require('./routes/usuario'));


mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify:false},(err) =>{
    if(err)throw err;
    console.log('Base de datos conectada');
})
.catch(err =>console.log)

app.listen(process.env.PORT, () => {
    console.log(`Iniciando el puerto ${process.env.PORT}`);
})