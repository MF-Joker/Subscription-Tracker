import {Router} from 'express';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req,res) => res.json({title: 'Get all subscriptions'}));

subscriptionRouter.get('/:id', (req,res) => res.json({title: 'Get subscriptions details'}));

subscriptionRouter.post('/', (req,res) => res.json({title: 'CREATE subscriptions'}));

subscriptionRouter.put('/:id', (req,res) => res.json({title: 'UPDATE subscriptions'}));

subscriptionRouter.delete('/:id', (req,res) => res.json({title: 'DELETE subscriptions'}));

subscriptionRouter.get('/user/:id', (req,res) => res.json({title: 'Get all user subscriptions'}));

subscriptionRouter.put('/:id/cancel', (req,res) => res.json({title: 'CANCEL subscriptions'}));

subscriptionRouter.get('/upcoming-renewals', (req,res) => res.json({title: 'Get upcoming renewals'}));

export default subscriptionRouter;
