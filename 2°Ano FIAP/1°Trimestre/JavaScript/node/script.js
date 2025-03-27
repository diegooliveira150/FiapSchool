var http = require ('http');
var url = require ('url');
var fs = require ('fs');

function readFile(response, file){
    
    fs.readFile(file, function(err, data){
        response.end(data);
    }); 

}
    
function callback(request, response) {
    response.writeHead(200, { "Content-type" : "application/json; charset=utf-8" })

    var parts = url.parse(request.url);
    var path = parts.path;  

    if (path == '/loja/categorias') {
        readFile(response, 'categorias.json');
    }

    else if (path == '/loja/produtos') {
        readFile(response, 'produtos.json');
    }

    else if (path == '/loja/clientes') {
        readFile(response, 'clientes.json');
    }

    else if (path == '/loja/pedidos') {
        readFile(response, 'pedidos.json');
    }
    
    else {
        response.end('Path não encontrado'+ path)
    }
}

var server = http.createServer(callback);

server.listen(3000);

console.log("Servidor iniciado em http://localhost:3000/");