import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { PostController } from '../controllers/PostController';


const router = Router();

const postController = new PostController(pool);


router.get('/', async (req, res) => {
    try {
      await postController.getPosts(req,res);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

router.post('/publicar', async(req: Request, res: Response) => {
    try {
        const result = await postController.crearPost(req,res);
        res.status(200).json(result);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
});

router.post('/like', async(req: Request, res: Response) => {
  try {
    const result = await postController.registarLike(req,res);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/unlike', async(req: Request, res: Response) => {
  try {
    const result = await postController.eliminarLike(req,res);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/coment', async(req: Request, res: Response) => {
  try {
    const result = await postController.registarComentario(req,res);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;