const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

// Esquema de pizza
const pizzaSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    tamaño: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    masa_pizza: {
        type: String,
        required: true
    },
    // pedidos: [{
    //     type: mongoose.Types.ObjectId, 
    //     ref: 'Pedido'
    // }]
})

module.exports = mongoose.model('Pizza', pizzaSchema);