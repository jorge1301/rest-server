
//==========================
// Puerto
//==========================

process.env.PORT = process.env.PORT || 3000;


//==========================
// Entorno
//==========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//==========================
// Base de datos
//==========================

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB='mongodb://localhost:27017/cafe'
}else{
urlDB = 'mongodb+srv://jorge1301:A8cHeGnP0nwDmwZM@cluster0-idfvn.mongodb.net/test?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB;


