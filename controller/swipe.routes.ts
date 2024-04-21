import express, { NextFunction, Request, Response } from 'express';
import { AuthenticatedToken, SwipeInput, SwipeResponse } from '../types';
import swipeService from '../service/swipe.service';
const swipeRouter = express.Router();

swipeRouter.get('/', async (req: Request & { auth: AuthenticatedToken }, res: Response, next: NextFunction) => {
    try {
        const id = req.auth.id as unknown as number;
        const swipes = await swipeService.getAllSwipes(id);
        res.status(200).json({ status: 'success', message: 'here are your swipes', data: swipes });
    } catch (error) {
        next(error);
    }
});

swipeRouter.post('/', async (req: Request & { auth: AuthenticatedToken }, res: Response, next: NextFunction) => {
    try {
        const swipeInput = req.body as SwipeInput;
        const swipe: SwipeResponse = await swipeService.createSwipe(swipeInput, req.auth);
        if (swipe.isMatch) {
            res.status(200).json({ status: 'success', message: 'match', data: swipe.object });
        } else {
            res.status(200).json({ status: 'success', message: 'swipe', data: swipe.object });
        }
    } catch (error) {
        next(error);
    }
});

export { swipeRouter };
