const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/miDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Ruta de prueba
app.get('/api', (req, res) => {
    res.send('API funcionando');
});

app.get('/api/saludo', (req, res) => {
    res.json({ mensaje: 'Hola desde el backend' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
