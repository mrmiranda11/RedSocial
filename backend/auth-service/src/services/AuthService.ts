import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AutenticaData } from '../models/AutenticaData';
import { User } from '../models/User';

export class AuthService {
    constructor(private pool: Pool) {}
  
   async loginUser(email: string, password: string) {

      
      const result = await this.pool.query(
        'SELECT * FROM usuarios WHERE email = $1',
        [email]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Correo no registrado');
      }
      const user: User = result.rows[0];
      const resultaut = await this.pool.query(
        'SELECT * FROM autenticacion WHERE id = $1',
        [user.id]
      );
      
      
      const aut: AutenticaData = resultaut.rows[0];
      //const isValidPassword = await bcrypt.compare(password, aut.contrasena);
      const isValidPassword = password===aut.contrasena;
        
      
      if (!isValidPassword) {
        throw new Error('Credenciales no validas');
      }
      
      const token = this.generateToken(user.id);
  
      return {
        message: 'Login exitoso',
        token,
        user: {
          id: user.id,
          email: user.email,
          primer_nombre: user.primer_nombre,
          segundo_nombre: user.segundo_nombre,
          primer_apellido: user.primer_apellido,
          segundo_apellido: user.segundo_apellido,
          fecha_nacimiento: user.fecha_nacimiento
        }
      };
    }
  
    async getUserById(id: number) {
      const result = await this.pool.query(
        'SELECT id, email, first_name, last_name, birth_date, alias, created_at FROM users WHERE id = $1',
        [id]
      );
  
      return result.rows[0] || null;
    }
  
    private generateToken(userId: number): string {
      return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );
    }
  }