import { Request, Response } from 'express';
import { Pool } from 'pg';
import { AuthService } from '../services/AuthService';


export class LoginController {
    private authService: AuthService;
  
    constructor(pool: Pool) {
      this.authService = new AuthService(pool);
    }

    loginUser = async (req: Request, res: Response) => {
      try {
        const { email, password } = req.body;
        debugger;
        // Validate required fields
        if (!email || !password ) {
          return res.status(400).json({ 
            error: 'Todos los campos son requeridos',
            fields: ['email', 'password']
          });
        }
  
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ error: 'Formato de email inválido' });
        }
        
        const result = await this.authService.loginUser(email,password);
        res.status(201).json(result);
      } catch (error: any) {
        //console.error('Usuario no existente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    };
  
 
    /*updateProfile = async (req: AuthenticatedRequest, res: Response) => {
      try {
        const userId = req.userId;
        const { first_name, last_name, birth_date } = req.body;
  
        if (!userId) {
          return res.status(401).json({ error: 'Usuario no autenticado' });
        }
  
        // Validate fields
        if (!first_name || !last_name || !birth_date) {
          return res.status(400).json({ 
            error: 'Todos los campos son requeridos',
            fields: ['first_name', 'last_name', 'birth_date']
          });
        }
  
        // Validate names (only letters and spaces)
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!nameRegex.test(first_name) || !nameRegex.test(last_name)) {
          return res.status(400).json({ 
            error: 'Los nombres solo pueden contener letras y espacios' 
          });
        }
  
        // Validate birth date
        const birthDate = new Date(birth_date);
        const currentDate = new Date();
        const minAge = new Date(currentDate.getFullYear() - 13, currentDate.getMonth(), currentDate.getDate());
        
        if (birthDate > minAge) {
          return res.status(400).json({ error: 'Debes ser mayor de 13 años' });
        }
  
        const maxAge = new Date(currentDate.getFullYear() - 120, currentDate.getMonth(), currentDate.getDate());
        if (birthDate < maxAge) {
          return res.status(400).json({ error: 'Fecha de nacimiento inválida' });
        }
  
        const updatedProfile = await this.usersService.updateUserProfile(userId, {
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          birth_date
        });
  
        res.json({
          message: 'Perfil actualizado exitosamente',
          profile: updatedProfile
        });
      } catch (error) {
        console.error('Update profile controller error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    };
  
    getUserById = async (req: AuthenticatedRequest, res: Response) => {
      try {
        const targetUserId = parseInt(req.params.id);
        const currentUserId = req.userId;
  
        if (!currentUserId) {
          return res.status(401).json({ error: 'Usuario no autenticado' });
        }
  
        if (isNaN(targetUserId) || targetUserId <= 0) {
          return res.status(400).json({ error: 'ID de usuario inválido' });
        }
  
        const userProfile = await this.usersService.getPublicUserProfile(targetUserId);
  
        if (!userProfile) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }
  
        res.json({ user: userProfile });
      } catch (error) {
        console.error('Get user by id controller error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    };
  
    searchUsers = async (req: AuthenticatedRequest, res: Response) => {
      try {
        const userId = req.userId;
        const { q: query, limit = 10, page = 1 } = req.query;
  
        if (!userId) {
          return res.status(401).json({ error: 'Usuario no autenticado' });
        }
  
        if (!query || typeof query !== 'string' || query.trim().length === 0) {
          return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
        }
  
        const searchLimit = Math.min(parseInt(limit as string), 50); // Max 50 results
        const searchPage = Math.max(parseInt(page as string), 1);
        const offset = (searchPage - 1) * searchLimit;
  
        const result = await this.usersService.searchUsers(
          query.trim(), 
          searchLimit, 
          offset,
          userId
        );
  
        res.json({
          users: result.users,
          pagination: {
            page: searchPage,
            limit: searchLimit,
            total: result.total,
            totalPages: Math.ceil(result.total / searchLimit),
            hasNext: searchPage * searchLimit < result.total,
            hasPrev: searchPage > 1
          }
        });
      } catch (error) {
        console.error('Search users controller error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    };
  
    getUserStats = async (req: AuthenticatedRequest, res: Response) => {
      try {
        const userId = req.userId;
  
        if (!userId) {
          return res.status(401).json({ error: 'Usuario no autenticado' });
        }
  
        const stats = await this.usersService.getUserStats(userId);
  
        res.json({ stats });
      } catch (error) {
        console.error('Get user stats controller error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    };*/
  }