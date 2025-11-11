import {Router} from 'express';

const userRouter = Router();

userRouter.get('/', (req, res) => res.json({title: 'Get all users'}))

userRouter.get('/:id', (req, res) => res.json({title: 'Get user details'}))

userRouter.post('/', (req, res) => res.json({title: 'Create a users'}))

userRouter.put('/:id', (req, res) => res.json({title: 'update user'}))

userRouter.delete('/:id', (req, res) => res.json({title: 'Delete user'}))

export default userRouter;