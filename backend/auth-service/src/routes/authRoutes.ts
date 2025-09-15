import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { UsersController } from '../controllers/UsersController';
import { LoginController } from '../controllers/LoginController';

const router = Router();
const usersController = new UsersController(pool);
const loginController = new LoginController(pool);


router.post('/registar', async (req, res) => {
    try {
      const result = await usersController.crearUsuario(req,res);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

router.post('/login', async(req: Request, res: Response) => {
    try {
        const result = await loginController.loginUser(req,res);
        res.status(200).json(result);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
});

router.post('/register', (req: Request, res: Response) => {
  res.send('Ruta de registro');
});

export default router;