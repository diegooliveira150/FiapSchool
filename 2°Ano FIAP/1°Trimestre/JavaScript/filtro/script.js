    const fs = require('fs');
    const path = require('path')
    const express = require('express')

    const app = express();

    const port = 3000;

    const carrosPath = path.join(__dirname, 'carros_classicos.json');

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    //Lendo os dados do arquivo json 
    let carrosData  = fs.readFileSync(carrosPath,'utf-8');
    let carros = JSON.parse(carrosData);

    //Função para salvar os dados atualizados no arquivo JSON
    function salvarDados() {
        fs.writeFileSync(carrosPath, JSON.stringify(carros, null, 2));
    }

    app.get ('adicionar-carro', (req,res)  =>{
        res.sendFile(pat.join(_dirname,'adicionar.html'))
    });

    app.post('/adicionar-carro', (req, res) => {
        const novoCarro = req.body;

        if (carros.find(carro => carro.nome.toLowerCase() === novoCarro.nome.toLowerCase())) {
            res.send('<h1>Carro já existe. Não é possível adicionar duplicatas.</h1>');
            return;
        }

        carros.push(novoCarro);
        salvarDados();
        res.send('<h1>Carro adicionado com sucesso!</h1>');
    });

    app.listen(port, () => {
        console.log(`Servidor iniciado em http://localhost:${port}`);
    });