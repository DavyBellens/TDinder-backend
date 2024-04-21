import { Profile } from './profile';
import { Match as MatchPrisma } from '@prisma/client';

export class Match {
    readonly id: number;
    readonly profileId1: number;
    readonly profileId2: number;
    readonly timestamp: Date;
    constructor(match: { id: number; profileId1: number; profileId2: number; timestamp: Date }) {
        this.id = match.id;
        this.profileId1 = match.profileId1;
        this.profileId2 = match.profileId2;
        this.timestamp = match.timestamp;
    }

    static from({ id, profileId1, profileId2, timestamp }: MatchPrisma) {
        return new Match({
            id,
            profileId1,
            profileId2,
            timestamp,
        });
    }
}
