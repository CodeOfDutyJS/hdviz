const express = require('express');
const fs = require('fs');
const func = require('./func');
const mysql = require('mysql');

async function getTables(dbname,config){
  switch (config.DB_Type) {
    case 'MySQL':
      var result = await func.getTables(dbname,config,MySQLConn(config));
      return result;
      break;
    case 'PostgreSQL':

      break;
    case 'MongoDB':

      break;
    case 'SQLite':

      break;
    default:
      console.log('Invalid DB Type');
      break;

  }
}

function MySQLConn(config){
  var connection = mysql.createConnection({
    host: config.DB_Address,
    user: config.DB_Username,
    password: config.DB_Password,
    database: config.DB_Name,
  });

  connection.connect();
  if(connection)
    return connection;
  else
    console.log('Not Connected to the DB');
}



module.exports = {
  getTables,
};
