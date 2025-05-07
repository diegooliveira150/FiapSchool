const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3000;

const produtosPath = path.join(__dirname,'produtos.json');


app.use(express.json());
app.use(express.urlencoded({ extended: true}));

function salvarDados (produtos) {
    fs.writeFileSync(produtosPath,JSON.stringify(produtos, null, 4))
};

app.get('', (req,res) => {
    res.sendFile(produtosPath)
});

app.get('/atualizar-produto', (req,res) =>{
    res.sendFile(path.join(__dirname,'/atualizar.html'))
});

app.post('/atualizar-produto', (req,res) => {
    const { nome, novoPreco} = req.body;

    let produtoData = fs.readFileSync(produtosPath,'utf-8');
    let produtos = JSON.parse(produtoData);

    const produtoIndex = produtos.findIndex(carro =>  carro.nome.toLowerCase() === nome.toLowerCase());

    if(produtoIndex === -1) {
        res.send('<h1>Produto não encotrado.</h1>')
        return;
    }

    produtos[produtoIndex].preço = novoPreco;
    salvarDados(produtos);
    res.send('<h1>O produto foi alterado com sucesso!</h1>')
});

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`) 
});