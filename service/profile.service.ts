import { Gender, Preference } from '@prisma/client';
import { UnauthorizedError } from 'express-jwt';
import profileDb from '../domain/data-access/profile.db';
import { Profile } from '../domain/model/profile';
import { AuthenticationResponse, ProfileInput, Role } from '../types';
import { generateJwtToken } from '../util/jwt';
import { comparePasswordWithHash, hashPassword } from '../util/password';
import matchService from './match.service';
import swipeService from './swipe.service';

const createProfile = async (profileInput: ProfileInput): Promise<Profile> => {
    const { email, name, password, role, preference, age, gender, interests, socials, pictures, bio } = profileInput;

    Profile.validate(email, name, password, role, preference, age, gender, interests, socials, pictures, bio);

    if (await profileDb.getProfileByEmail(email)) throw new Error(`Email already exists`);

    const hashedPassword = await hashPassword(password);

    return await profileDb.createProfile(
        email,
        hashedPassword,
        name,
        role,
        preference,
        age,
        gender,
        interests,
        socials,
        pictures,
        bio
    );
};

const getAllProfiles = async (role: Role): Promise<Profile[]> => {
    if (role !== 'ADMIN') {
        throw new UnauthorizedError('credentials_required', {
            message: 'Only admins can get all Profiles',
        });
    }
    return await profileDb.getAllProfiles();
};

const getProfileById = async (id: number): Promise<Profile> => {
    const profile = await profileDb.getProfileById(id);
    if (!profile) throw new Error(`Profile with id ${id} does not exist`);
    return profile;
};

const getProfileByEmail = async (email: string): Promise<Profile> => {
    const profile = await profileDb.getProfileByEmail(email);
    if (!profile) throw new Error(`Profile with email "${email}" does not exist`);
    return profile;
};

const updateBio = async (profile: Profile, bio: string): Promise<Profile> => {
    Profile.validateBio(bio);
    return await profileDb.updateBio(profile.id, bio);
};

const updateEmail = async (profile: Profile, email: string): Promise<Profile> => {
    Profile.validateEmail(email);
    return await profileDb.updateEmail(profile.id, email);
};

const updatePassword = async (profile: Profile, password: string): Promise<Profile> => {
    Profile.validatePassword(password);
    const hashedPassword = await hashPassword(password);
    return await profileDb.updatePassword(profile.id, hashedPassword);
};

const updateName = async (profile: Profile, name: string): Promise<Profile> => {
    Profile.validateName(name);
    return await profileDb.updateName(profile.id, name);
};

const updateRole = async (profile: Profile, role: Role): Promise<Profile> => {
    Profile.validateRole(role);
    return await profileDb.updateRole(profile.id, role);
};

const updatePictures = async (profile: Profile, pictures: string[]): Promise<Profile> => {
    Profile.validatePictures(pictures);
    return await profileDb.updatePictures(profile.id, pictures);
};

const updatePreference = async (profile: Profile, preference: Preference): Promise<Profile> => {
    Profile.validatePreference(preference);
    return await profileDb.updatePreference(profile.id, preference);
};

const updateAge = async (profile: Profile, age: string): Promise<Profile> => {
    Profile.validateAge(parseInt(age));
    return await profileDb.updateAge(profile.id, parseInt(age));
};

const updateGender = async (profile: Profile, gender: Gender): Promise<Profile> => {
    Profile.validateGender(gender);
    return await profileDb.updateGender(profile.id, gender);
};

const updateInterests = async (profile: Profile, interests: string[]): Promise<Profile> => {
    Profile.validateInterests(interests);
    return await profileDb.updateInterests(profile.id, interests);
};

const updateSocials = async (profile: Profile, socials: string[]): Promise<Profile> => {
    Profile.validateSocials(socials);
    return await profileDb.updateSocials(profile.id, socials);
};

const updateProfile = async (
    inputProfileId: string | number,
    profileInput: ProfileInput,
    auth: any
): Promise<Profile> => {
    const profileId: number = parseInt(inputProfileId as string);
    const realProfileId: number = parseInt(auth.id as string);

    if (realProfileId !== profileId) {
        throw new Error('Wtf are you trying to do? No present from santa this year!!!');
    }

    const profile = await getProfileById(profileId);
    const { email, password, name, role, preference, age, gender, interests, socials, pictures, bio } = profileInput;

    if (email) {
        const p = await profileDb.getProfileByEmail(email);
        if (p.id != profileId) throw new Error(`Email already exists`);
    }

    let result: Profile;

    if (bio) {
        result = await updateBio(profile, bio);
    }

    if (email) {
        result = await updateEmail(profile, email);
    }

    if (password) {
        result = await updatePassword(profile, password);
    }

    if (role) {
        result = await updateRole(profile, role);
    }

    if (name) {
        result = await updateName(profile, name);
    }

    if (pictures) {
        result = await updatePictures(profile, pictures);
    }

    if (preference) {
        result = await updatePreference(profile, preference);
    }
    if (age) {
        result = await updateAge(profile, age as unknown as string);
    }
    if (gender) {
        result = await updateGender(profile, gender);
    }
    if (interests) {
        result = await updateInterests(profile, interests);
    }
    if (socials) {
        result = await updateSocials(profile, socials);
    }

    return result;
};

const deleteProfile = async (inputProfileId: string | number, auth: any): Promise<Profile> => {
    const profileId: number = parseInt(inputProfileId as string);
    const realProfileId: number = parseInt(auth.id as string);
    const role: Role = auth.role;
    if (realProfileId !== profileId && role != 'ADMIN') {
        throw new Error('Wtf are you trying to do? No present from santa this year!!!');
    }
    await getProfileById(profileId);
    const matches = await matchService.getAllMatchesFromProfile(profileId as unknown as string, auth);
    matches.forEach(async (m) => {
        await matchService.deleteMatch(m.id, auth);
    });
    const swipes = await swipeService.getAllSwipes(profileId);
    swipes.forEach(async (s) => {
        await swipeService.deleteSwipe(s.id);
    });
    const swipedBy = await swipeService.getSwipedBy(profileId);
    swipedBy.forEach(async (sb) => {
        await swipeService.deleteSwipe(sb.id);
    });
    return await profileDb.deleteProfile(profileId);
};

const authenticate = async (email: string, password: string): Promise<AuthenticationResponse> => {
    const profile = await getProfileByEmail(email);
    const isValidPassword = await comparePasswordWithHash(password, profile.password);
    if (!isValidPassword) throw new Error('Invalid password');
    return {
        token: {
            value: generateJwtToken({ email, role: profile.role, id: profile.id }),
        },
        profile: {
            email: email,
            name: profile.name,
            id: String(profile.id),
            role: profile.role,
        },
    };
};

const getAllPossibleMatches = async (preference: Preference, auth: any) => {
    if (!Object.values(Preference).includes(preference)) throw new Error('Invalid preference');
    const email: string = auth.email;
    const swipes = await swipeService.getAllSwipes(auth.id);
    let swiped = [];
    if (swipes) swiped = swipes.map((s) => s.swipeeId);
    if (preference === 'FEMALE') {
        return (await profileDb.getAllProfilesByGender('WOMAN')).filter(
            (p) => p.email != email && !swiped.includes(p.id) && p.pictures.length > 0
        );
    } else if (preference === 'MALE') {
        return (await profileDb.getAllProfilesByGender('MAN')).filter(
            (p) => p.email != email && !swiped.includes(p.id) && p.pictures.length > 0
        );
    } else if (preference === 'BOTH') {
        return [
            ...(await profileDb.getAllProfilesByGender('MAN')),
            ...(await profileDb.getAllProfilesByGender('WOMAN')),
        ].filter((p) => p.email != email && !swiped.includes(p.id) && p.pictures.length > 0);
    } else if (preference === 'OTHER') {
        return (await profileDb.getAllProfiles()).filter(
            (p) => p.email != email && !swiped.includes(p.id) && p.pictures.length > 0
        );
    }
    return [];
};

export default {
    getAllPossibleMatches,
    createProfile,
    getAllProfiles,
    getProfileById,
    getProfileByEmail,
    updateName,
    updateEmail,
    updatePassword,
    updateRole,
    updateAge,
    updateGender,
    updateInterests,
    updateSocials,
    updatePictures,
    updateBio,
    updatePreference,
    updateProfile,
    deleteProfile,
    authenticate,
};
