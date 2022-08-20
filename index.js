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

 app.post('/', async(req,res) =>{
    const {nome, email} = req.body
    /*
    var connection = sql.Connection(sqlConfig, function(err) {
        var r = new sql.Request(connection);
        r.input('nome', sql.VarChar, nome);
        r.input('email', sql.VarChar, email);
        r.multiple = true;
        r.query("INSERT INTO usuario (nome, email) VALUES (@nome, @email)", function(err, recordsets) {
    
            connection.close();
        });
    });
    */
    try {
        await sql.connect(sqlConfig)
            const ps = new sql.PreparedStatement()
            ps.input('nome', sql.VarChar, nome);
            ps.input('email', sql.VarChar, email);
            const result = await sql.query("INSERT INTO usuario (nome, email) VALUES (@nome, @email)", function(err, recordsets) {
                console.log(recordsets)
                console.log(err)
            })
        return res.status(200).json(result);
    } 
    catch (err) { return res.status(500).json({ message: err.message }) }
})

app.put('/usuarios/:id', async(req,res) =>{
    const nome = req.body.nome
    const dataNascimento  = req.body.dataNascimento
    const id = req.params.id 

    try {
        await sql.connect(sqlConfig)
            const result = await sql.query('UPDATE usuario SET nome=?, dataNascimento=? WHERE id=?',[nome, dataNascimento,id ]);
        return res.status(200).json(result);
    } 
    catch (err) { return res.status(500).json({ message: err.message }) }
})


app.delete('/usuarios/:id', async(req, res) => {
    try {
        let id = req.params.id
        const ps = new sql.PreparedStatement()
        ps.input("param", sql.Int, id)
        sql.query('Delete FROM usuario WHERE id=@param')

        /*
        await sql.connect(sqlConfig)
            const result = await sql.query('Delete FROM usuario WHERE id=?', (id) );
        return res.status(200).json(result);
        */
    } 
    catch (err) { return res.status(500).json({ message: err.message }) }
})