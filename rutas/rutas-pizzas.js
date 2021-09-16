const express = require('express');
const {check} = require('express-validator'); // check es un metodo del validator.
const router = express.Router();

const controladorPizzas = require('../controladores/controlador-pizzas');

// Consulta a las pizzas.
router.get('/', controladorPizzas.recuperarPizzas);
// Consulta a las pizzas por ID.
router.get('/:pizid', controladorPizzas.recuperaPizzasPorId);
// Consulta a las pizzas por Id de pedido.
router.get('/pedidos/:pizid', controladorPizzas.recuperaPizzasPorIdPedido);
// Eliminar pedido por ID.
router.delete('/:pizid', controladorPizzas.eliminarPizzaPorId);
// Crear nuevo pedido.
router.post('/', controladorPizzas.crearPizza);
// Modificar avión.
router.patch('/:pizid', controladorPizzas.modificarPizza);

module.exports = router;