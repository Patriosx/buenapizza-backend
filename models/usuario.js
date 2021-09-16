const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

// Esquema de usuario
const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true 
    },
    telefono: {
        type: String,
        required: true
    },
    fNacimiento: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    puntos: {
        type: Number,
        default: 0
    },
    conectado: {
        type: Boolean,
        default: false
    },
    pedidos: [{
        type: mongoose.Types.ObjectId, 
        ref: 'Pedido'}] 
});

usuarioSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Usuario', usuarioSchema);