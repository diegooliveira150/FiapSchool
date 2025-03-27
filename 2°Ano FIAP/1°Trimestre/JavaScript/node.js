const http = require('http');
const server =  http .createServer((req,res) => {

    //Rota principal 
    if (req.url ==='/') {
        res.writeHead(200, {'Content-Type':'text/plain'});
        res.end('Bem-vindo ao meu servidor Node.js!');
    }

    //Rota para o aluno 
    else if (req.url === '/aluno') {
       res.writeHead(200, {'Content-':'text/plain'});
       res.end('ALUNOS');
    }
    
    //Rota para professores
    else if(req.url === '/professor') {
        res.writeHead(200, {'Content-Type':'text/plain'});
        res.end('PROFESSORES')
    }
    
    //Rota não encotrada
    else{
        res.writeHead(404,{ 'Content-Type':'text/palin'});
        res.end('Rota não encontrada');
    }
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Servidor rodando em https://localhost:${PORT}`);
});
