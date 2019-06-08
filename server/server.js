require('./config/config')
let express = require('express');
let app = express();
let bodyParser = require('body-parser');

//Middlewares
// parse application/x - www - form - urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Routes
app.get('/usuario', (req, res) => {
    res.json('get Usuario');
});

app.post('/usuario', (req, res) => {
    let body = req.body;
    if(body.nombre === undefined){
        res.status(400).json({
            ok:false,
            mensaje: 'El nombre es necesario'
        });
    }else {

    
    res.json({
        persona:body
    });
    }
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', (req, res) => {
    res.json('delete Usuario');
});
app.listen(process.env.PORT, () => {
    console.log('Iniciando el puerto 3000');
})