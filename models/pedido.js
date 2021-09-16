const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

// Esquema de pedido
const pedidoSchema = new Schema({
    id_usuario: {
        type: mongoose.Types.ObjectId, // [] --> Si el pedido tiene varios usuarios.
        required: true, 
        ref: 'Usuario'
    },
    id_pizzas: [{
        type: mongoose.Types.ObjectId, 
        required: true,
        ref: 'Pizza'
    }],
    fecha_hora: {
        type: Date, default: Date.now
    },
    entregado: {
        type: Boolean,
        default: false
    },
    /*tipo: {
        type: String,
        required: true
    }*/
    precio: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Pedido', pedidoSchema);