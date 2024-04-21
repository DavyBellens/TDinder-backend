import { AuthenticatedToken } from '../../types';
import database from '../../util/database';
import { Match } from '../model/match';
import { Profile } from '../model/profile';

const getAllMatches = async () => {
    try {
        const matchesPrisma = await database.match.findMany();
        return matchesPrisma ? matchesPrisma.map((m) => Match.from(m)) : null;
    } catch (error) {
        console.log(error);
        throw new Error('Database error when creating match. See server log for details.');
    }
};

const getMatchById = async (id: number) => {
    try {
        const matchPrisma = await database.match.findUnique({
            where: {
                id,
            },
        });
        return matchPrisma ? Match.from(matchPrisma) : null;
    } catch (error) {
        console.log(error);
        throw new Error('Database error when creating match. See server log for details.');
    }
};

const matchProfiles = async (profile1: Profile, profile2: Profile) => {
    try {
        const matchPrisma = await database.match.create({
            data: {
                timestamp: new Date(),
                profileId1: profile1.id,
                profileId2: profile2.id,
            },
        });
        return matchPrisma ? Match.from(matchPrisma) : null;
    } catch (error) {
        console.log(error);
        throw new Error('Database error when creating match. See server log for details.');
    }
};

const getMatchByProfiles = async (profileId1: number, profileId2: number) => {
    try {
        const matchPrisma = await database.match.findFirst({
            where: {
                OR: [
                    {
                        profileId1: profileId1,
                        profileId2: profileId2,
                    },
                    {
                        profileId1: profileId2,
                        profileId2: profileId1,
                    },
                ],
            },
        });
        return matchPrisma ? Match.from(matchPrisma) : null;
    } catch (error) {
        console.log(error);
        throw new Error('Database error when getting match. See server log for details.');
    }
};

const deleteMatchById = async (id: number) => {
    try {
        const matchPrisma = await database.match.delete({
            where: {
                id,
            },
        });
        return matchPrisma ? Match.from(matchPrisma) : null;
    } catch (error) {
        console.log(error);
        throw new Error('Database error when deleting match. See server log for details.');
    }
};

const getMatchesFromProfile = async (profileId: number) => {
    try {
        const matchesPrisma = await database.match.findMany({
            where: {
                OR: [{ profileId1: profileId }, { profileId2: profileId }],
            },
        });
        return matchesPrisma ? matchesPrisma.map((m) => Match.from(m)) : null;
    } catch (error) {
        console.log(error);
        throw new Error('Database error when getting match. See server log for details.');
    }
};

export default {
    getAllMatches,
    getMatchById,
    matchProfiles,
    getMatchByProfiles,
    deleteMatchById,
    getMatchesFromProfile,
};
