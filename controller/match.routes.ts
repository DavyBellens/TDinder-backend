import express, { NextFunction, Request, Response } from 'express';
import matchService from '../service/match.service';
import { AuthenticatedToken } from '../types';

const matchRouter = express.Router();

matchRouter.get('/', async (req: Request & { auth: AuthenticatedToken }, res: Response, next: NextFunction) => {
    try {
        const auth = req.auth;
        const matches = await matchService.getAllMatches(auth);

        res.status(200).json({ status: 'success', message: 'all the matches', matches });
    } catch (error) {
        next(error);
    }
});

matchRouter.delete(
    '/unmatch',
    async (req: Request & { auth: AuthenticatedToken }, res: Response, next: NextFunction) => {
        try {
            const id = req.query.profileId1 as string;
            const id2 = req.query.profileId2 as string;
            const logged = req.auth;

            const match = await matchService.unmatch(parseInt(id), parseInt(id2), logged);
            res.status(200).json({
                status: 'success',
                message: `successfully unmatched profiles ${id} and ${id2}`,
                match,
            });
        } catch (error) {
            next(error);
        }
    }
);

matchRouter.get('/match', async (req: Request & { auth: AuthenticatedToken }, res: Response, next: NextFunction) => {
    try {
        const auth = req.auth;
        const matchId: string | null = req.query.matchId as string;
        const match = await matchService.getMatchById(parseInt(matchId), auth);

        res.status(200).json({
            status: 'success',
            message: 'match with id ' + matchId,
            match,
        });
    } catch (error) {
        next(error);
    }
});
matchRouter.get('/profile', async (req: Request & { auth: AuthenticatedToken }, res: Response, next: NextFunction) => {
    try {
        const auth = req.auth;
        const profileId: string = req.query.profileId as string;
        const matches = await matchService.getAllMatchesFromProfile(profileId, auth);

        res.status(200).json({
            status: 'success',
            message: 'All the matches for profile with id ' + profileId,
            matches,
        });
    } catch (error) {
        next(error);
    }
});

export { matchRouter };
