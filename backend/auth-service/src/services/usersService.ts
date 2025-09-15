import { Pool } from 'pg';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import cors from 'cors';

export class UsersService {
    constructor(private pool: Pool) { }

    async registrarUsuario(userData: User) {
        // Check if user exists
        const existeUser = await this.pool.query(
            'SELECT id FROM usuarios WHERE email = $1',
            [userData.email]
        );

        if (existeUser.rows.length > 0) {
            throw new Error('User already exists');
        }

        // Insertar user
        const result = await this.pool.query(
            `INSERT INTO usuarios (email, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, estado)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id, email, primer_nombre, segundo_nombre,primer_apellido,segundo_apellido, fecha_nacimiento, estado`,
            [
                userData.email,
                userData.primer_nombre,
                userData.segundo_nombre,
                userData.primer_apellido,
                userData.segundo_apellido,
                userData.fecha_nacimiento,
                userData.estado
            ]
        );

        const user = result.rows[0];
        const token = this.generateToken(user.id);

        return {
            message: 'Usuario creado exitosamente',
            token,
            user: {
                id: user.id,
                email: user.email,
                primer_nombre: user.primer_nombre,
                segundo_nombre: user.segundo_nombre,
                primer_apellido: user.primer_apellido,
                segundo_apellido: user.segundo_apellido,
                fecha_nacimiento: user.fecha_nacimiento,
                estado: user.estado
            }
        };
    }

    async registraAut(userData: User) {
        // Check if user exists
        const existeUser = await this.pool.query(
            'SELECT id FROM autenticacion WHERE id = $1',
            [userData.id]
        );
        
        if (existeUser.rows.length > 0) {
            throw new Error('El Usuario ya existe');
        }

        // Encriptar contraseña
        //const hashedPassword = await bcrypt.hash(userData.contrasena, 10);

        // Insertar user
        const result = await this.pool.query(
            `INSERT INTO autenticacion(id, usuario, contrasena)
                VALUES ($1, $2, $3)
           RETURNING id, usuario, creado_at, actualizado_at`,
            [
                userData.id,
                userData.primer_nombre,
                userData.password
            ]
        );

        const user = result.rows[0];
        const token = this.generateToken(user.id);

        return {
            message: 'Usuario creado exitosamente',
            token,
            user: {
                id: user.id,
                email: user.email,
                primer_nombre: user.primer_nombre,
                segundo_nombre: user.segundo_nombre,
                primer_apellido: user.primer_apellido,
                segundo_apellido: user.segundo_apellido,
                fecha_nacimiento: user.fecha_nacimiento,
                estado: user.estado
            }
        };
    }

    private generateToken(userId: number): string {
        return jwt.sign(
            { userId },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );
    }
}