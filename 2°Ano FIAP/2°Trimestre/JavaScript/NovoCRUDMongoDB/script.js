const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');
const app = express();
const port = 3000;
const methodOverride = require('method-override');

//Midleware para processar dados JSON e formulários
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));// Middleware para suportar métodos HTTP alternativos

// COnfiguração da URL
const url = 'mongodb+srv://diegooliveira150:%40Diego0205@cluster0.z2w4dpq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'livraria';
const collectionName = 'livros';

// Rota para exibir a página inicial
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html')
});

// Rota para exibir o formulário de cadastro 
app.get('/cadastro',(req,res)=>{
    res.sendFile(__dirname + '/cadastro.html')
});

// Rota para lidar com a submissão do formulário de cadastro     
app.post('/cadastro',async (req,res) => {
    const novoLivro = req.body;// Dados do livros enviados pelo formulários

    // Conectar ao MongoDB
    const client = new MongoClient(url)

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Inserir o novo livro no banco de dados
        const result = await collection.insertOne(novoLivro);
        console.log(`Livro cadastrado com sucesso. ID: ${result.insertedId}`);

        // Redirecionar para a página inicial após o cadastro
        res.redirect('/')
    } catch (err){
        console.error('Erro ao cadastrar o livro: ', err);
        res.status(500).send('Erro ao cadastrar o livro. Por favor, tente mais tarde.');
    } finally {
        client.close();
    }
});

// Rota para exibir o formulário de atualizações
app.get('/atualizar',async(req,res)=>{
    res.sendFile(__dirname + '/atualizar.html')
});

// Rota para lidar com submissação de formulário de atualização
app.post('/atualizar',async(req,res)=>{
    const {id, titulo, autor, ano_publicao, genero, editora, paginas, idioma, ISBN, disponivel} = req.body;
    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Atualizar o livro no banco de dados
        const result = await collection.updateOne(
            {_id: new ObjectId(id)},// Utilize o ObjectId importado
            {
                $set: {titulo, autor, ano_publicao, genero, editora, paginas, idioma, ISBN, disponivel: disponivel === 'true'}
            }
        );
        
        if(result.modifiedCount > 0){
            console.log(`Livro com ID: ${id} atualizado com sucesso.`);
            res.redirect('/');
        } else{
            res.status(404).send('Livro não encontrado.');
        } 
    } catch (err){
        console.error('Erro ao atualizar o livro: ', err);
        res.status(500).send('Erro ao atualizar o livro. Por favor, tente novamente mais tarde.');
    } finally{
        client.close();
    }  
});

app.get('/livro/:id', async(req,res)=>{
    const {id} = req.params;

    // Conectar ao MongoDB
    const client = new MongoClient(url);

    try{
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Encotrar o livro pelo ID
        const livro = await collection.findOne({_id: new ObjectId(id)});

        if(!livro){
            return res.status(404).send('Livro não encontrado');
        }
        res.json(livro);
    } catch(err){
        console.error('Erro ao buscar o livro: ',err);
        res.status(500).send('Erro ao buscar o livro. Por favor, tente novamente mais tarde.');
    } finally{
        client.close();
    }
});

// Rota para lidar com a submissão do formulário de delação 
app.post('/deletar', async(req,res) => {
    const {id} = req.body;

    const client = new MongoClient(url)

    try{
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Deletar o livro no banco de Dados
        const result = await collection.deleteOne({_id: new ObjectId(id)});

        if(result.deletedCount > 0){
            console.log(`Livro com ID:${id} deletado com sucesso.`)
            res.redirect('/'); // Redirecionar para a página inicial após a exclusão
        } else{
            res.status(404).send('Livro não encontrado');
        }
    } catch(err){
        console.error('Erro ao deletar o livro: ',err);
        res.status(500).send('Erro ao deletar o livro. Por favor, tente novamente mais tarde.');
    } finally{
        client.close();

    }
});

// Rota para obter dados todos os livros
app.get('/livros', async(req,res) => {
    const client = new MongoClient(url);

    try{
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const livros = await collection.find({}, {projection: {_id: 1, titulo: 1, autor: 1, editora: 1}}).toArray();

        res.json(livros);
    } catch(err){
        console.error('Erro ao buscar livros: ', err)
        res.status(500).send('Erro ao buscar livros. Por favor, tente novamente mais tarde.')
    } finally{
        client.close();
    }
});

// Iniciar servidor
app.listen(port,()=>{
    console.log(`Servidor Node.js em execução em http://localhost:${port}`)
});