    const fs = require('fs');
    const path = require('path');
    const express = require('express');
    const app = express();
    const port = 3000;

    const agendaPath = path.join(__dirname, 'agenda.json');
    const agendaData = fs.readFileSync(agendaPath,'utf-8');
    const agenda = JSON.parse(agendaData);
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));

    function criarTabela(materia){

        return`
        <tr>
        <td><h6>${materia.materia}</h6></td>
        <td><h6>${materia.titulo}</h6></td>
        <td><p>${materia.desc}</p></td>
        `;
    }

    app.get('', (req,res) => {
        const tableHtml = agenda.map(materia => criarTabela(materia)).join('');
        const pageHtmlPath = path.join(__dirname, 'dadosAgenda.html');
        let pageHtml = fs.readFileSync(pageHtmlPath, 'utf-8');
        pageHtml = pageHtml.replace('{{tableHtml}}', tableHtml);
        
        res.send(pageHtml)
    });

    app.get('/buscar', (req,res) => {
        res.sendFile(path.join(__dirname,'buscar.html'))
    });

    app.post('/buscar',(req,res) => {
        const buscar = req.body.titulo;
        
        const agendaIndex = agenda.findIndex(atividade => atividade.titulo.toLowerCase() === buscar.toLowerCase());

        if(agendaIndex === -1){
            res.send('<h1>Atividade não encontrada</h1>')   
        }
        const tableHtml = criarTabela(agenda[agendaIndex]);
        const pageHtmlPath = path.join(__dirname, 'buscarResposta.html');
        let pageHtml = fs.readFileSync(pageHtmlPath, 'utf-8');
        pageHtml = pageHtml.replace('{{tableHtml}}', tableHtml);
        res.send(pageHtml)
    })

    function salvarDados() {
        fs.writeFileSync(agendaPath, JSON.stringify(agenda, null, 2))
    }

    app.get('/adicionar',(req,res) => {
        res.sendFile(path.join(__dirname,'adicionar.html'))
    });

    app.post('/adicionar', (req,res) => {
        const novaAtividade = req.body;
        
        if(agenda.find(atividade => atividade.titulo.toLowerCase() === novaAtividade.titulo.toLowerCase())){
            res.send('<h1>Matéria já existente.</h1>')
            return 
        };
        
        agenda.push(novaAtividade);
        salvarDados();
        res.send('<h1>A atividade foi adicionada com sucesso!</h1>');
        return;
    });

    app.get('/atualizar', (req,res) => {
        res.sendFile(path.join(__dirname, 'atualizar.html'))
    });

    app.post('/atualizar', (req,res) => {
        const {titulo, novoTitulo, novaDesc} = req.body;

        const agendaIndex = agenda.findIndex(atividade => atividade.titulo.toLowerCase() === titulo.toLowerCase());

        if(agendaIndex === -1){
            res.send('<h1>Atividade não encontrada.</h1>')
            return;
        }

        agenda[agendaIndex].titulo = novoTitulo;
        agenda[agendaIndex].desc = novaDesc;

        salvarDados();
        res.send('<h1>Dados da agenda atualizados!</h1>')
    });

    app.get('/excluir',(req,res) => {
        res.sendFile(path.join(__dirname,'excluir.html'))
    });

        app.post('/excluir', (req,res) => {
            const {titulo} = req.body;

            const agendaIndex = agenda.findIndex(atividade => atividade.titulo.toLowerCase() === titulo.toLowerCase());

            if(agendaIndex === -1){
                res.send('<h1>Matéria não encontrada.</h1>')
                return; 
            }
            res.send(`
            <script>
            if(confirm('Tem certeza que deseja excluir essa atividade? ${titulo}')){
                window.location.href = '/excluir-confirmado?nome=${titulo}';
            } else{
                window.location.href = '/excluir'
            }
            </script>
            `);
        });

    app.get('/excluir-confirmado', (req,res) => {
        const materia = req.query.nome;

        const agendaIndex = agenda.findIndex(atividade => atividade.titulo.toLowerCase() === materia.toLowerCase())

        agenda.splice(agendaIndex, 1);
        salvarDados(agenda);
        res.send(`<h1>Atividade de ${materia} foi excluída com sucesso!</h1>`)
    });

    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`)
    });