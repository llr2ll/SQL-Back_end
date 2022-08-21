const express = require('express')
const app = express();
const sql = require('mssql')
const sqlConfig = require('./db.js')

sql.on('error', err => { return res.status(500).json({ message: err.message }) })
app.listen(3000,() => {console.log('Sever rodando: http://localhost:3000')})
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://dg-solutions-back-end.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
  
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
  
    next();
  });

 app.get('/', async (req, res) => {
    try {
        await sql.connect(sqlConfig)
            const result = await sql.query(`SELECT * FROM usuario`)
        return res.status(200).json(result.recordset);
    } 
    catch (err) { return res.status(500).json({ message: err.message }) }
 })

 app.post('/', async (req,res) => {
    const { nome, email } = req.body
    try {
        let pool = await sql.connect(sqlConfig)
        let result = await pool.request()
            .input('nome', sql.VarChar, nome)
            .input('email', sql.VarChar, email)
            .query('INSERT INTO usuario(nome, email) VALUES (@nome, @email)')
        return res.status(200).json(result.recordset);
    } 
    catch (err) { return res.status(500).json({ message: err.message }) }
})

app.put('/usuarios/:id', async(req,res) =>{
    const nome = req.body.nome
    const email  = req.body.email
    const id = req.params.id 
    try {
        let pool = await sql.connect(sqlConfig)
        let result = await pool.request()
            .input('nome', sql.VarChar, nome)
            .input('email', sql.VarChar, email)
            .input('id', sql.VarChar, id)
            .query('UPDATE usuario SET nome=@nome , email=@email  WHERE id=@id')
        return res.status(200).json(result.recordset);
    } 
    catch (err) { return res.status(500).json({ message: err.message }) }
})

app.delete('/usuarios/:id', async(req, res) => {
    const id = req.params.id 
    try {
        let pool = await sql.connect(sqlConfig)
        let result = await pool.request()
            .input('id', sql.VarChar, id)
            .query('Delete FROM usuario WHERE id=@id')
        return res.status(200).json(result);
    } 
    catch (err) { return res.status(500).json({ message: err.message }) }
})
