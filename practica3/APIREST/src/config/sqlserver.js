import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

/**
 * rm -rf node_modules package-lock.json
   npm install
 */


export const sqlServerConfig = {
  user: process.env.SQLSERVER_USER,
  password: process.env.SQLSERVER_PASSWORD,
  server: process.env.SQLSERVER_SERVER,
  database: process.env.SQLSERVER_DB,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};


export const sqlServerConfig = {
  user:     'IngeWeb',
  password: 'Password123',
  server:   'mitnick\\SQLEXPRESS',
  database: 'ingeweb',
  options: {
    encrypt:               false,
    trustServerCertificate: true,
  },
};


export const getConnection = async () => {
  try {
    return await sql.connect(sqlServerConfig);
  } catch (error) {
    console.error('SQL Server connection error:', error);
  }
};