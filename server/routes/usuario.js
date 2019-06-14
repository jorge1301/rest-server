const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const _ = require('underscore');
const Usuario = require('../models/usuario')
const app = express();
const { verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion')

//Routes
app.get('/usuario', verificaToken,(req, res) => {
    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);
    Usuario.find({ estado: true},'nombre email role estado google img')
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        Usuario.countDocuments({estado:true},(err,conteo)=>{
            res.json({
                ok: true,
                usuarios,
                conteo
            });
        })
       
    })
});

app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre:body.nombre,
        email:body.email,
        password:bcrypt.hashSync(body.password,bcrypt.genSaltSync(10)),
        role:body.role
    });
    usuario.save((err,usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok:true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
   
    Usuario.findByIdAndUpdate(id,body,{new:true, runValidators:true},(err,usuarioDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
                
        res.json({
            ok:true,
            usuario: usuarioDB
        });
    })   
});

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
   let id = req.params.id;
   let cambiarEstado = {
       estado:false
   }
   
   Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true}, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })  
   
   
   
   /*
   // Eliminar usuario sin actualizar el estado
   Usuario.findByIdAndRemove(id,(err,usuarioBorrado) =>{
       if (err) {
           return res.status(400).json({
               ok: false,
               err
           });
       }
       if (!usuarioBorrado){
           return res.status(400).json({
               ok: false,
               err:{
                   message: 'Usuario no encontrado'
               }
           });
       }
       res.json({
           ok:true,
           usuario: usuarioBorrado
       });

   });
   */
});


module.exports = app;