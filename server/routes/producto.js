const Producto = require('../models/producto')
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const express = require('express');
let app = express();
const _ = require('underscore');
/*
 GET todos los productos, con populate y paginado
*/
app.get('/producto', verificaToken, (req, res) => {
    let desde = Number(req.params.desde||0);
    let limite = Number(req.params.limite || 5);
    Producto.find({disponible:true})
    .populate('categoria', 'descripcion')
    .populate('usuario', 'nombre email')
    .sort('nombre')
    .skip(desde)
    .limit(limite)
    .exec((err,productoDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        Producto.countDocuments({disponible:true},(err,conteo)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoDB,
                conteo
            })

        })
       


    })
});


/*
GET producto por id
*/
app.get('/producto/:id',verificaToken, (req, res) => {
    let desde = Number(req.params.desde || 0);
    let limite = Number(req.params.limite || 5);
    let id = req.params.id;
    Producto.findById(id)
    .populate('usuario','nombre email')
    .populate('categoria', 'descripcion')
    .skip(desde)
    .limit(limite)
    .exec((err,productoDB)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe ese producto'
                }
            })
        }
        
        if(productoDB.disponible==false){
            return res.json({
                ok:false,
                err: {
                    message: 'No existe ese producto'
                }
            })
        }

        res.json({
            ok:true,
            producto:productoDB
        })
    })
});

/*
Search producto
*/
app.get('/producto/buscar/:termino',verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino,'i');
    Producto.find({ nombre: regex})
        .populate('categoria','descripcion')
        .exec((err,productoDB)=>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok:true,
                productoDB
            })
        })
});

/*
POST producto
*/
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body
    let usuario = req.usuario._id;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario
    })

    producto.save((err, productoDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        res.json({
            ok:true,
            producto:productoDB
        });
    });

});
/*
PUT producto
*/
app.put('/producto/:id',[verificaToken,verificaAdmin_Role] ,(req, res) => {
    let usuario= req.usuario._id;
    let id = req.params.id;
    req.body.usuario = usuario;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria', 'usuario']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true },(err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe ese producto'
                }
            })
        }
       res.json({
           ok:true,
           producto:productoDB
       })

    })

});
/*
DELETE producto cambiando el disponible
*/
app.delete('/producto/:id',[verificaToken,verificaAdmin_Role],(req, res) => {
    let id = req.params.id;
    let estado = {
        disponible:false
    }
    Producto.findByIdAndUpdate(id, estado, { new: true },(err,productoDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err :{
                    message: 'No existe ese producto'
                }
            })
        }
        res.json({
            ok:true,
            producto:productoDB
        })
    })
});
module.exports = app;