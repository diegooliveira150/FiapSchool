const fs = require('fs');
const path = require('path')
const express = require('express')

const app = express();

const port = 3000;

const carrosPath = path.join(__dirname, 'carros_classicos.json');

const carrosData = fs.readFileSync(carrosPath, 'utf-8');
const   carros= JSON.parse(carrosData);

function buscarCarroPorNome(nome){
    return carros.find(carro =>
        carro.nome.toLowerCase() === nome.toLowerCase());
       
}

app.get('/buscar-carro/:nome', (req,res) => {
    const NomeDoCarroBuscado = req.params.nome;
    const carroEncontrado = buscarCarroPorNome(NomeDoCarroBuscado);

    if (carroEncontrado) {
        res.send (`<h1>Carro encontrado:</h1><pre>
        ${JSON.stringify(carroEncontrado, null, 2)}</pre>`);
    }
    else {
        res.send('<h1>Carro não encontrado </h1>');
    };
    
});

app.listen(port,() => {
    console.log(`Servidor iniciado em http://localhost:${port}`)
});