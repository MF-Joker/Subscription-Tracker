import {Router} from 'express';

import {login, signup, signout} from '../Controllers/auth.controller.js';

const authRouter = Router();
//POST pass some DATA Request

// Path: /api/v1/auth/login
authRouter.post('/login', login);
authRouter.post('/sign-up', signup);
authRouter.post('/sign-out', signout);

export default authRouter;