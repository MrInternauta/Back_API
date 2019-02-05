const express = require('express');
const app = express();


app.use(require('./usuario'));
app.use(require('./login'));
app.use(require("./mensaje"));
app.use(require('./upload'));
app.use(require('./imagenes'));

app.use(require('./hospital'));
app.use(require('./medico'));
app.use(require('./busqueda'));

module.exports = app;