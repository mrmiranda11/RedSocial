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


    registarComentario =  async (req: Request, res: Response) => {
      try {
          const { usuario_id, post_id,comentario } = req.body;
  
        // Validate required fields
        if (!usuario_id || !post_id || !comentario) {
          return res.status(400).json({ 
            error: 'Todos los campos son requeridos',
            fields: ['usuario_id', 'post_id','comentario']
          });
        }
        const result = await this.postService.registrarComentario({
          id: "0",
          usuario: usuario_id,
          post_id: post_id,
          texto:comentario,
        });
        res.status(201).json(result);
      } catch (error: any) {
        console.error('Comentario controller error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    };
  }