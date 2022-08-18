const express = require('express')
const app = express();
const sql = require('mssql')
const sqlConfig = require('./db.js')

app.listen(3000,() => {console.log('Sever rodando: http://localhost:3000')})

sql.on('error', err => {
    console.log(err)
 })
 
 app.get('/', async () => {
  try {
   await sql.connect(sqlConfig)
   const result = await sql.query`select * from usuario`
   console.log(result)
  } catch (err) {
   console.log(err)
  }
 })