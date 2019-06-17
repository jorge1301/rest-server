const express = require('express');
const app = express();
const _ = require('underscore');
let {verificaToken,verificaAdmin_Role} = require('../middlewares/autenticacion');
let Categoria = require('../models/categoria')

//Mostrar todas las categorias
app.get('/categoria',verificaToken,(req, res) => {
    let desde = Number(req.query.desde|| 0);
    let limite = Number(req.query.limite|| 5);
    Categoria.find({},'descripcion usuario')
    .sort('descripcion')
    .populate('usuario','nombre email')
    .skip(desde)
    .limit(limite)
    .exec((err,categoria)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err

            });
        }
        Categoria.countDocuments((err,conteo)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoria,
                conteo
            });
        });
    });
});

//Muesta una categoria por id
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id,(err,categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        if (!categoriaDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'No existe esa categoria'
                }
            })
        }

        res.json({
            ok:true,
            categoria: categoriaDB
        })
    })
});

//Crear nueva categoria
app.post('/categoria',verificaToken,(req, res) => {
    let usuario= req.usuario._id
    let categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario
    });
    categoria.save((err,categoriaDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err

            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        });
    });
});

//Actualizar categoria --descripcion --usuario

app.put('/categoria/:id', verificaToken,(req, res) => {
    let usuario = req.usuario._id; //Lo obtenemos del token
    req.body.usuario=usuario;
    let id = req.params.id; //De la id de la categoria
    let body = _.pick(req.body,['descripcion','usuario']);
    /*let categorias = {
        descripcion:req.body.descripcion,
        usuario
    }*/
    Categoria.findByIdAndUpdate(id,body,{new:true, runValidators:true},(err,categoriaDB)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }
        res.json({
            ok:true,
            categoria:categoriaDB
        })
    })
});

app.delete('/categoria/:id',[verificaToken,verificaAdmin_Role] ,(req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id,(err,categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        if(!categoriaDB){
            return res.json({
                ok:false,
                err:{
                    message: 'No existe esa categoria'
                }
            })
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        })
    })
});

module.exports = app;