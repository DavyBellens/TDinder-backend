import matchDb from '../domain/data-access/match.db';
import { Match } from '../domain/model/match';
import { AuthenticatedToken } from '../types';
import profileService from './profile.service';

const getAllMatches = async (auth: AuthenticatedToken): Promise<Match[]> => {
    if (auth.role != 'ADMIN') throw new Error("You can't view other people's matches");
    return await matchDb.getAllMatches();
};

const getMatchById = async (id: number, auth: AuthenticatedToken): Promise<Match> => {
    const match = await matchDb.getMatchById(id);
    if (!match) throw new Error('No match with ID ' + id);
    if (
        (match.profileId1 as unknown as string) != auth.id &&
        (match.profileId2 as unknown as string) != auth.id &&
        auth.role != 'ADMIN'
    )
        throw new Error("You can't view other people's matches");
    return match;
};

const deleteMatch = async (id: number, auth: AuthenticatedToken) => {
    await matchDb.deleteMatchById(id);
};

const match = async (profileId1: number, profileId2: number, cupid: AuthenticatedToken): Promise<Match> => {
    if (parseInt(cupid.id) != profileId1 && cupid.role !== 'ADMIN')
        throw new Error('Fuck you tryna be cupid or sumthin?');
    if (profileId1 == profileId2) throw new Error('Did you really just try to match yourself?');
    else {
        const profile1 = await profileService.getProfileById(profileId1);
        const profile2 = await profileService.getProfileById(profileId2);
        const existingMatch = await matchDb.getMatchByProfiles(profile1.id, profile2.id);
        if (existingMatch) throw new Error(`profiles with id's ${profile1.id} ad ${profile2.id} already have a match`);
        const match = await matchDb.matchProfiles(profile1, profile2);
        return match;
    }
};

const unmatch = async (profileId1: number, profileId2: number, cupid: AuthenticatedToken): Promise<Match> => {
    if (parseInt(cupid.id) != profileId1) throw new Error('Why the fuck you tryna interfere with love?');
    if (profileId1 == profileId2) throw new Error('Did you really just try to unmatch yourself?');
    else {
        const profile1 = await profileService.getProfileById(profileId1);
        const profile2 = await profileService.getProfileById(profileId2);
        const matchToDelete = await matchDb.getMatchByProfiles(profile1.id, profile2.id);
        if (!matchToDelete) throw new Error(`Profiles with id's ${profile1.id} and ${profile2.id} have no match`);
        const deletedMatch = await matchDb.deleteMatchById(matchToDelete.id);
        return deletedMatch;
    }
};

const getAllMatchesFromProfile = async (profileId: string, auth: AuthenticatedToken): Promise<Match[]> => {
    if (auth.id != profileId) throw new Error("You can't view other people's matches");
    const profile = await profileService.getProfileById(parseInt(profileId));
    return await matchDb.getMatchesFromProfile(profile.id);
};

export default {
    getAllMatches,
    getMatchById,
    match,
    unmatch,
    getAllMatchesFromProfile,
    deleteMatch,
};
