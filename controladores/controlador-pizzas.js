const {validationResult} = require('express-validator');

const Pizza = require('../models/pizza');

// Recuperar pizzas
async function recuperarPizzas(req, res, next) {
    let pizzas;
    try {
        pizzas = await Pizza.find();
    } catch (error) {
        const err = new Error('No se han podido recuperar los datos')
        err.code = 500; // Internal Server Error
        return next(err);
    }
    if (!pizzas || pizzas.length === 0) {
        const error = new Error('No se han podido encontrar las pizzas');
        error.code = 404;
        return next(error);
    } else {
        res.json({
            pizzas
        })
    };
}
// Recuperar pizzas por ID
async function recuperaPizzasPorId(req, res, next) {
    const idPizza = req.params.pizid; 
    let pizza;
    try {
        pizza = await Pizza.findById(idPizza);
    } catch (error) {
        const err = new Error('No se han podido recuperar los datos')
        err.code = 500; // Internal Server Error
        return next(err);
    }
    if (!pizza) {
        const error = new Error('No se ha podido encontrar la pizza con esa ID');
        error.code = 404;
        return next(error);
    } else {
        res.json({
            pizza: pizza
        });
    }
  }
// Recuperar pizzas por ID de pedido
async function recuperaPizzasPorIdPedido(req, res, next) {
    const idPedido = req.params.pid;
    let pizzas;
    try {
        pizzas = await Pizza.find({id_pedido: idPedido});
    } catch (err) {
        const error = new Error('Ha fallado la recuperación. Inténtelo de nuevo más tarde');
        error.code = 500;
        return next(error);
    }
    if (!pizzas || pizzas.length === 0) {
        const error = new Error('No se han podido encontrar pizzas para el pedido proporcionado');
        error.code = 404;
        next(error);
    } else {
        res.json({
            pizzas
        });
    }
}

// Crear pizza
async function crearPizza(req, res, next) {
    const errores = validationResult(req); // Valida en base a las especificaciones en el archivo de rutas para este controller específico
    if (!errores.isEmpty()) {
        const error = new Error('Error de validación. Compruebe sus datos');
        error.code = 422;
        return next(error);
    }
    const {
        nombre,
        tamaño,
        precio,
        masa_pizza,
        pedidos
    } = req.body;
    const nuevaPizza = new Pizza({
        nombre: nombre,
        tamaño: tamaño,
        precio: precio,
        masa_pizza: masa_pizza,
        pedidos: pedidos
    })
    try {
        await nuevaPizza.save();
    } catch (error) {
        const err = new Error('Ha fallado la creación de la pizza');
        err.code = 500;
        return next(err);
    }
    res.status(201).json({
        pizza: nuevaPizza
    });
  }

// Modificar un pedido
async function modificarPizza(req, res, next) {
    const {precio, masa_pizza} = req.body;
    const idPizza = req.params.pizid;
    let pizza;
    try {
        pizza = await Pizza.findById(idPizza); // Localizar la pizza en la BDD por ID
    } catch (error) {
        const err = new Error('No se ha podido realizar la operación')
        err.code = 500; // Internal Server Error
        return next(err);
    }

    // Modificamos los datos necesarios
    pizza.precio = precio;
    pizza.masa_pizza = masa_pizza;

    try {
    // Guardar los datos modificados en la BDD
        pizza.save();
    } catch (error) {
        const err = new Error('Ha habido algún problema. No se ha podido guardar la información actualizada')
        err.code = 500; // Internal Server Error
        return next(err);
    }
    res.status(200).json({
        pizza: pizza
    });
}

// Eliminar pizza por ID
async function eliminarPizzaPorId(req, res, next) {
    const idPizza = req.params.pizid;
    let pizza;
    // Localizar pedido en base a su id
    try {
        pizza = await Pizza.findByIdAndRemove(idPizza);
    } catch (error) {
        const err = new Error('No se han podido recuperar los datos para eliminación')
        err.code = 500; // Internal Server Error
        return next(err);
    }
    if(!pizza) {
        const error = new Error('No se ha podido encontrar la pizza con el id proporcionado')
        error.code = 404;
        return next(error);
    } else {
        res.status(200).json({
            message: 'Pizza eliminada por ID'
        });
    }
}

exports.recuperarPizzas = recuperarPizzas;
exports.recuperaPizzasPorId = recuperaPizzasPorId;
exports.recuperaPizzasPorIdPedido = recuperaPizzasPorIdPedido;
exports.crearPizza = crearPizza;
exports.modificarPizza = modificarPizza;
exports.eliminarPizzaPorId = eliminarPizzaPorId;