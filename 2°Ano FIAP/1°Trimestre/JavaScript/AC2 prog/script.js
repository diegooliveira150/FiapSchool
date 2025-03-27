const fs = require('fs');
const path = require('path')
const express = require('express');
const app = express();
const port = 3000;

const enciclopediaPath = path.join(__dirname,'enciclopedia.json');

let enciclopediaData = fs.readFileSync(enciclopediaPath, 'utf-8');    
let enciclopedia = JSON.parse(enciclopediaData);

function Buscarmateria(nome){
    return enciclopedia.find(materia =>
    materia.nome.toLowerCase() === nome.toLowerCase());
}

app.get('', (req,res) => {
    res.sendFile(path.join(__dirname,'index.html'))
});

 app.get ('/enciclopedia',(req,res) => {
    res.send(enciclopedia)
});

app.get('/buscar-materia/:nome', (req,res) => {
    const NomeMateria = req.params.nome;
    const materiaEncontrada = Buscarmateria(NomeMateria);


    if (materiaEncontrada) {
        res.send(`<h1>Materia encontrada:</h1><pre>
        ${JSON.stringify(materiaEncontrada, null, 2)}</pre>`);
    }
    else {
        res.send('<h1>Materia não encontrada</h1>');
    };
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));

function salvarDados(){
    fs.writeFileSync(enciclopediaPath, JSON.stringify(enciclopedia, null, 2));
};

app.get('/adicionar-materia', (req,res) => {
    res.sendFile(path.join(__dirname,'adicionar.html'))
});

app.post('/adicionar-materia', (req,res) =>{
    const novaMateria = req.body;

    if (enciclopedia.find(materia => materia.nome.toLowerCase() === novaMateria.nome.toLowerCase())) {
        res.send('<h1> Materia já existente. Não foi possivel adicionar.</h1>');
        return;
    }

    enciclopedia.push(novaMateria);
    salvarDados();
    res.send('<h1>Nova matéria adicionada com sucesso!</h1>');
});

app.listen(port,() => {
    console.log(`Servidor iniciado em http://localhost:${port}`)
});
