require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const rutasUsuarios = require("./rutas/rutas-usuarios");
const rutasPedidos = require("./rutas/rutas-pedidos");
const rutasPizzas = require("./rutas/rutas-pizzas");

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Origin, X-Request-With, Authorization, Accept");
	next();
});

app.use("/api/usuarios", rutasUsuarios);
app.use("/api/pedidos", rutasPedidos);
app.use("/api/pizzas", rutasPizzas);

// Si no encuentra las rutas.
app.use((req, res, next) => {
	res.status(404);
	res.json({
		mensaje: "Usuarios, pedidos o pizzas no encontrado",
	});
});

// Gestión de errores
app.use((error, req, res, next) => {
	if (res.headersSent) {
		// Si ya se ha enviado una respuesta desde el servidor
		return next(error); // seguimos para adelante
	}
	res.status(error.code || 500); // Proporciona código de error y si no hay proporciona el código 500.
	res.json({
		message: error.message || "Ha ocurrido un error desconocido",
	});
});

// Conexión a la base de datos (MongoDB Atlas) y arrancar el servidor (Express)
mongoose
	.connect(process.env.MONGO_DB_URI)
	.then(() => {
		app.listen(process.env.PORT, () => console.log("Escuchando en puerto " + process.env.PORT));
	})
	.catch((error) => console.log(error));
