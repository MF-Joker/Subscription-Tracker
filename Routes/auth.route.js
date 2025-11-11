import {Router} from 'express';

const authRouter = Router();

authRouter.post('/login', async (req, res) => res.json({title: 'Login'}));

authRouter.post('/sign-up', async (req, res) => res.json({title: 'Sign Up'}));

authRouter.post('/sign-out', async (req, res) => res.json({title: 'Sign Out'}));

export default authRouter;
