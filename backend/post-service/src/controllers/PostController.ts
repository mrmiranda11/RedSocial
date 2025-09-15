import { Request, Response } from 'express';
import { Pool } from 'pg';
import { PostService } from '../services/PostService';

interface AuthenticatedRequest extends Request {
  userId?: number;
}


export class PostController {
    private postService: PostService;
  
    constructor(pool: Pool) {
      this.postService = new PostService(pool);
    }

    getPosts = async (req: AuthenticatedRequest, res: Response) => {
      try {
        const userId = Number(req.query.userId);
        console.log("getPosts***************  ",userId);
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;
  
        /*if (!userId) {
          return res.status(401).json({ error: 'Usuario no autenticado' });
        }*/
  
        const result = await this.postService.getPosts(userId, limit, offset);
        res.json({
          posts: result.posts,
        });
      } catch (error) {
        console.error('Get posts controller error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    };

    crearPost = async (req: Request, res: Response) => {
      try {
          const { usuario, content } = req.body;
  
        // Validate required fields
        if (!usuario || !content) {
          return res.status(400).json({ 
            error: 'Todos los campos son requeridos',
            fields: ['usuario', 'content']
          });
        }
  
        const result = await this.postService.registrarPost({
          id: "0",
          usuario: usuario,
          content: content,
          likes:"0",
          comments:"",
          liked:"0",
          
        });
        res.status(201).json(result);
      } catch (error: any) {
        console.error('crearPost controller error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    };
  
    registarLike =   async (req: Request, res: Response) => {
      try {
          const { usuario_id, post_id,reaction } = req.body;
  
        // Validate required fields
        if (!usuario_id || !post_id || !reaction) {
          return res.status(400).json({ 
            error: 'Todos los campos son requeridos',
            fields: ['usuario_id', 'post_id','reaction']
          });
        }
        const result = await this.postService.registrarLike({
          id: "0",
          usuario_id: usuario_id,
          post_id: post_id,
          reaction:true,
        });
        res.status(201).json(result);
      } catch (error: any) {
        console.error('Like controller error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    };

    eliminarLike =   async (req: Request, res: Response) => {
      try {
          const { usuario_id, post_id } = req.body;
  
        // Validate required fields
        if (!usuario_id || !post_id) {
          return res.status(400).json({ 
            error: 'Todos los campos son requeridos',
            fields: ['usuario_id', 'post_id']
          });
        }
        const result = await this.postService.borrarLike({
          usuario_id,post_id
        });
        res.status(200).json(result);
      } catch (error: any) {
        console.error('Like controller error:', error);
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