import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || "postgres",
  password: "admin",
  database: process.env.DB_NAME || "red_social",
});

pool.on('connect', () => {
  console.log('Conectado a PostgreSQL exitosamente');
});

pool.on('error', (err) => {
  console.error('Error en la conexión a PostgreSQL:', err);
});

// Test manual opcional:
/*async function testConnection() {
    try {
      const res = await pool.query('SELECT NOW()');
      console.log('✅ Test de conexión:', res.rows[0]);
    } catch (err) {
      console.error('❌ Error al hacer query:', err);
    } finally {
      await pool.end(); // Cierra el pool
    }
  }

  if (require.main === module) {
    testConnection();
  }*/

export default pool;