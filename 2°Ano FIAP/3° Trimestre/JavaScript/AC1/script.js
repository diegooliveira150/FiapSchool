const express = require('express');
const { MongoClient, ObjectId} = require('mongodb');
const app = express();
const methodOverride = require('method-override');
const port = 3000;
 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
 
const url = "mongodb://127.0.0.1:27017";
const dbName = 'GerenciadorDeVendas';
let collectionName = '';
 
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
});
 
app.get('/cadastro-paciente', (req,res)=> {
    res.sendFile(__dirname + '/cadastrarPaciente.html');
});
 
app.post('/cadastro-paciente', async(req,res) => {
    const novoPaciente = req.body;
 
    const client = new MongoClient(url);
    collectionName = "pacientes";
 
    try {
        await client.connect();
 
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
 
        const result = await collection.insertOne(novoPaciente);
        console.log(`Novo paciente cadastrado com sucesso. ID: ${result.insertedId}`);
        res.redirect('/')
    } catch(err){
        console.error('Erro ao cadastrar o paciente: ', err);
        res.status(500).send('Erro ao cadastrar o paciente. Por favor, tente novamente mais tarde.')
    } finally{
        client.close();
    };
});
 
app.get('/atualizar-paciente', (req,res) => {
    res.sendFile(__dirname, + '/atualizarPaciente.html');
});
 
app.post('/atualizar-paciente', async (req,res) => {
    const {id, nome, dataNascimento, cpf} = req.body;
    collectionName = "pacientes";

    const client = new MongoClient(url);

    try{
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.updateOne(
            { _id: new ObjectId(id)},
            {
                $set: {nome, dataNascimento, cpf}
            }
        )
        if(result.modifiedCount > 0){
            console.log(`Paciente com ID: ${id} atualizado com sucesso.`);
            res.redirect('/')
        } else{
            res.status(404).send('Paciente não encontrado.');
        }
    } catch (err) {
        console.error('Erro ao atualizar paciente: ', err);
        res.status(500).send('Erro ao buscar paciente. Por favor, tente novamente mais tarde');
    } finally{
        client.close();
    }
});

app.get('/paciente/:id', async  (req,res) => {
    const {id} = req.params;
    collectionName = 'pacientes';

    const client = new MongoClient(url);
    
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const paciente = await collection.findOne({ _id: new ObjectId(id)});

        if(!paciente){
            return res.status(404).send('Paciente não encontrado.');
        }
        res.json(paciente);
    } catch (err){
        console.error('Erro ao buscar paciente: ', err);
        res.status(500).send('Erro ao buscar o paciente. Por favor, tente novamente mais tarde.');
    } finally{
        client.close();
    }
});

app.post('/deletar-paciente', async (req, res) =>{
    const {id} = req.body;

    collectionName = 'pacientes';
    const client = new MongoClient(url);

    try{
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.deleteOne({ _id: new MongoClient(id) });

        if (result.deletedCount > 0){
            console.log(`Paciente com ID: ${id} deletado com sucesso.`);
            res.redirect('/');
        } else{
            res.status(404).send('Paciente não encotrado.');
        }
    } catch (err){
        console.error('Erro ao deletar paciente: ', err);
        res.status(500).send('Erro ao deletar o livro. Por favor, tente novamente mais tarde.');
    } finally{
        client.close()
    }
});

app.get('/pacientes', async (req,res) => {
    const client = new MongoClient

    collectionName = 'pacientes';

    try{
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const pacientes = await collection.find({}, { projection: { _id: 1, nome: 1, cpf: 1} }).toArray();

        res.json(pacientes);
    } catch (err){
        console.error('Erro ao buscar o pacientes: ', err);
        res.status(500).send('Erro ao buscar pacientes. Tente novamente mais tarde.');
    } finally {
        client.close()
    }
});

app.listen(port, () => {
    console.log(`Servidor Node.js  em execução em http://localhost:${port}`);
});

console.clear()