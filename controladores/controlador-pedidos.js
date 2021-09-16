const {validationResult} = require('express-validator');
const mongoose = require('mongoose');

const Pedido = require('../models/pedido');
const Usuario = require('../models/usuario');
const Pizza = require('../models/pizza');

// Recuperar pedidos
async function recuperarPedidos(req, res, next) {
    let pedidos;
    try {
        pedidos = await Pedido.find().populate('id_pizzas');
    } catch (error) {
        const err = new Error('No se han podido recuperar los datos')
        err.code = 500; // Internal Server Error
        return next(err);
    }
    if (!pedidos || pedidos.length === 0) {
        const error = new Error('No se han podido encontrar los pedidos');
        error.code = 404;
        return next(error);
    } else {
        res.json({
            pedidos
        })
    };
}
// Recuperar pedidos por ID
async function recuperaPedidosPorId(req, res, next) {
    const idPedido = req.params.pid; 
    let pedido;
    try {
        pedido = await Pedido.findById(idPedido);
    } catch (error) {
        const err = new Error('No se han podido recuperar los datos')
        err.code = 500; // Internal Server Error
        return next(err);
    }
    if (!pedido) {
        const error = new Error('No se ha podido encontrar el pedido con esa ID');
        error.code = 404;
        return next(error);
    } else {
        res.json({
            pedido: pedido
        });
    }
}
// Recuperar pedidos por ID de usuario
async function recuperaPedidosPorIdUsuario(req, res, next) {
    const idUsuario = req.params.uid;
    let pedidos;
    try {
        pedidos = await Pedido.find({id_usuario: idUsuario});
    } catch (err) {
        const error = new Error('Ha fallado la recuperación. Inténtelo de nuevo más tarde');
        error.code = 500;
        return next(error);
    }
    if (!pedidos || pedidos.length === 0) {
        const error = new Error('No se han podido encontrar pedidos para el usuario proporcionado');
        error.code = 404;
        next(error);
    } else {
        res.json({
            pedidos
        });
    }
}
// Crear pedido
async function crearPedido(req, res, next) {
    const errores = validationResult(req); // Valida en base a las especificaciones en el archivo de rutas para este controller específico
    if (!errores.isEmpty()) {
        const error = new Error('Error de validación. Compruebe sus datos');
        error.code = 422;
        return next(error);
    }
    const {
        id_usuario,
        id_pizzas,
        precio
    } = req.body;
    const nuevoPedido = new Pedido({
        id_usuario,
        id_pizzas,
        precio
    })
    let usuario; // Localizamos al usuario que se corresponde con el id_usuario que hemos recibido en el request
    try {
        usuario = await Usuario.findById(id_usuario);
    } catch (error) {
        const err = new Error('Ha fallado la creación del pedido');
        err.code = 500;
        return next(err);
    }
    if (!usuario) {
        const error = new Error('No se ha podido encontrar un usuario con el id proporcionado');
        error.code = 404;
        return next(error);
    }
    let pizza; // Localizamos las pizzas que se corresponde con el id_pizzas que hemos recibido en el request
    try {
        pizza = await Pizza.findById(id_pizzas);
    } catch (error) {
        const err = new Error('Ha fallado la creación del pedido');
        err.code = 500;
        return next(err);
    }
    if (!pizza || pizza.length === 0) {
        const error = new Error('No se ha podido encontrar las pizzas con las id proporcionadas');
        error.code = 404;
        return next(error);
    }
    // Inicio de sesión y Transacciones
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await nuevoPedido.save({
            session: sess
        })
        usuario.pedidos.push(nuevoPedido);
        await usuario.save({
            session: sess
        });
        // pizza.pedidos.push(nuevoPedido);
        // await pizza.save({
        //     session: sess
        // });
        await sess.commitTransaction();
    } catch (error) {
        const err = new Error('No se han podido guardar los datos');
        err.code = 500;
        return next(err);
    }
    res.status(201).json({
        pedido: nuevoPedido
    });
}
// Modificar un pedido
async function modificarPedido(req, res, next) {
    const {entregado} = req.body;
    const idPedido = req.params.pid;
    let pedido;
    try {
        pedido = await Pedido.findById(idPedido); // Localizar el pedido en la BDD
    } catch (error) {
        const err = new Error('No se ha podido realizar la operación')
        err.code = 500; // Internal Server Error
        return next(err);
    }
    if (pedido.id_usuario.toString() !== req.userData.userId) {
        const err = new Error('No tiene permiso para modificar este pedido')
        err.code = 401; // Error de autorización
        return next(err);
    }
    // Modificamos los datos necesarios
    pedido.entregado = entregado;
    // Guardamos los datos modificados en la BDD
    try {
        pedido.save();
    } catch (error) {
        const err = new Error('Ha habido algún problema. No se ha podido guardar la información actualizada')
        err.code = 500; // Internal Server Error
        return next(err);
    }
    res.status(200).json({
        pedido
    });
}
// Eliminar pedido por ID
async function eliminarPedidoPorId(req, res, next) {
    const idPedido = req.params.pid;
    let pedido;
    // Localizar pedido en base a su id
    try {
        pedido = await Pedido.findById(idPedido).populate('id_usuario');
    } catch (error) {
        const err = new Error('No se han podido recuperar los datos para eliminación')
        err.code = 500; // Internal Server Error
        return next(err);
    }
    if(!pedido) {
        const error = new Error('No se ha podido encontrar un pedido con el id proporcionado')
        error.code = 404;
        return next(error);
    } else {
        if (pedido.id_usuario.id !== req.userData.userId) {
            const error = new Error('No tiene permiso para eliminar este pedido')
            error.code = 404;
            return next(error);
        }
        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await pedido.remove({session: sess});
            pedido.id_usuario.pedidos.pull(pedido);
            await pedido.id_usuario.save({session: sess});
            await sess.commitTransaction();
        } catch (error) {
            const err = new Error('Ha habido algún error. No se han podido eliminar los datos')
            err.code = 500; // Internal Server Error
            return next(err);
        }
        res.status(200).json({
            message: 'Pedido eliminado'
        });
    }
}

exports.recuperarPedidos = recuperarPedidos;
exports.recuperaPedidosPorId = recuperaPedidosPorId;
exports.recuperaPedidosPorIdUsuario = recuperaPedidosPorIdUsuario;
exports.crearPedido = crearPedido;
exports.modificarPedido = modificarPedido;
exports.eliminarPedidoPorId = eliminarPedidoPorId;