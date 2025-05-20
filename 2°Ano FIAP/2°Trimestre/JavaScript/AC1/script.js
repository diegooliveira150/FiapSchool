const fs = require('fs');
const path = require('path')
const express = require('express');
const app = express();
const port = 3000;

const enciclopediaPath = path.join(__dirname,'enciclopedia.json');
let enciclopediaData = fs.readFileSync(enciclopediaPath, 'utf-8');    
let enciclopedia = JSON.parse(enciclopediaData);

function salvarDados(){
    fs.writeFileSync(enciclopediaPath, JSON.stringify(enciclopedia, null, 2));
};

app.use(express.json());
app.use(express.urlencoded({extended:true}));

function Buscarmateria(nome){
    return enciclopedia.find(materia =>
    materia.nome.toLowerCase() === nome.toLowerCase());
}

function BuscarId (id){
    return enciclopedia.find(materia => 
    materia.id.toLowerCase() === id.toLowerCase());
}

app.get('/', (req,res) => {
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

app.get('/buscar-id/:id', (req,res) => {
    const IdMateria = req.params.id;
    const IdEncontrado = BuscarId(IdMateria);

    if(IdEncontrado){
         res.send(`<h1>ID encontrado:</h1><pre>
        ${JSON.stringify(IdEncontrado, null, 2)}</pre>`)
    }
    else {
        res.send('<h1>ID não encontrado</h1>')
    }
});

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

app.get('/atualizar-materia', (req,res) => {
    res.sendFile(path.join(__dirname,'atualizar.html'));
});

app.post('/atualizar-materia', (req,res) => {
    const { nome, novaDescricao, novaURL} = req.body;
    const materiaIndex = enciclopedia.findIndex(materia => materia.nome.toLowerCase() === nome.toLowerCase());

    if(materiaIndex === -1){
        res.send('<h1>Matéria não encontrada.')
        return;
    };

    enciclopedia[materiaIndex].desc = novaDescricao;
    enciclopedia[materiaIndex].url_info = novaURL;

    salvarDados(enciclopedia);

    res.send('<h1>Dados da matéria atualizados com sucesso!</h1>');
});

app.get('/excluir-materia', (req,res) => {
    res.sendFile(path.join(__dirname,'excluir.html'))
});

app.post('/excluir-materia', (req,res) =>{
    const {nome} = req.body;
    const materiaIndex = enciclopedia.findIndex(materia => materia.nome.toLowerCase() === nome.toLowerCase());

    if(materiaIndex === -1){
        res.send('<h1>Matéria não encontrada.')
        return;
    };

     res.send(`
    <script>
      if (confirm('Tem certeza de que deseja excluir essa matéria ${nome}?')){
        window.location.href = '/excluir-materia-confirmado?nome=${nome}';
      } else{
        window.location.href = '/excluir-materia'
      }      
    </script>
    `);
});

app.get('/excluir-materia-confirmado', (req,res) => {
    const nome = req.query.nome;
    const materiaIndex = enciclopedia.findIndex(materia => materia.nome.toLowerCase() === nome.toLowerCase());

    enciclopedia.splice(materiaIndex, 1);

    salvarDados(enciclopedia);
    res.send(`<h1>A materia ${nome} foi excluída com sucesso!</h1>`)
})

app.listen(port,() => {
    console.log(`Servidor iniciado em http://localhost:${port}`)
});