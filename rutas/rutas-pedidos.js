const express = require('express');
const {check} = require('express-validator'); // check es un metodo del validator.
const router = express.Router();
const checkAuth = require('../middleware/check-auth'); // Importacion del archivo js de autentificacion.

const controladorPedidos = require('../controladores/controlador-pedidos');

// Consulta a los pedidos.
router.get('/', controladorPedidos.recuperarPedidos);
// Consulta a los pedidos por ID.
router.get('/:pid', controladorPedidos.recuperaPedidosPorId);
// Consulta a los pedidos por Id de usuario.
router.get('/usuarios/:uid', controladorPedidos.recuperaPedidosPorIdUsuario);
// Protección de rutas.
router.use(checkAuth);
// Eliminar pedido por ID.
router.delete('/:pid', controladorPedidos.eliminarPedidoPorId);
// Crear nuevo pedido.
router.post('/',[
    check('id_usuario').not().isEmpty(),
    check('id_pizzas').not().isEmpty(),
    check('precio').not().isEmpty()
] , controladorPedidos.crearPedido);
// Modificar avión.
router.patch('/:pid', controladorPedidos.modificarPedido);

module.exports = router;