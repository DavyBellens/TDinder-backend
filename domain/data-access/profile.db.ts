import { Gender, Preference } from '@prisma/client';
import { Role } from '../../types';
import database from '../../util/database';
import { Profile } from '../model/profile';

const createProfile = async (
    email: string,
    password: string,
    name: string,
    role: Role,
    preference: Preference,
    age: number,
    gender: Gender,
    interests: string[],
    socials: (string | null)[],
    pictures: string[],
    bio?: string
): Promise<Profile> => {
    try {
        const profilePrisma = await database.profile.create({
            data: {
                createdAt: new Date(),
                updatedAt: new Date(),
                email,
                name,
                password,
                role,
                preference,
                bio,
                age,
                gender,
                interests,
                pictures,
                socials: socials.map((s) => (s !== null ? s : '')),
            },
        });
        if (profilePrisma) return Profile.from(profilePrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Database error when creating profile. See server log for details.');
    }
};

const getAllProfiles = async (): Promise<Profile[]> => {
    try {
        const profilesPrisma = await database.profile.findMany();
        if (profilesPrisma) return profilesPrisma.map((profilePrisma) => Profile.from(profilePrisma));
    } catch (error) {
        console.log(error);
        throw new Error('Database error when getting all profiles. See server log for details.');
    }
};

const getProfileById = async (id: number): Promise<Profile> => {
    try {
        const profilePrisma = await database.profile.findUnique({
            where: {
                id,
            },
        });
        if (profilePrisma) return Profile.from(profilePrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Database error when getting profile by id. See server log for details.');
    }
};

const getProfileByEmail = async (email: string): Promise<Profile> => {
    try {
        const profilePrisma = await database.profile.findUnique({
            where: {
                email,
            },
        });
        if (profilePrisma) return Profile.from(profilePrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Database error when getting profile by email. See server log for details.');
    }
};

const updateBio = async (id: number, newBio: string): Promise<Profile> => {
    try {
        const updatedProfile = await database.profile.update({
            where: { id },
            data: { bio: newBio },
        });
        return updatedProfile ? Profile.from(updatedProfile) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error when updating profile bio. See server log for details.');
    }
};

const updateEmail = async (id: number, newEmail: string): Promise<Profile> => {
    try {
        const updatedProfile = await database.profile.update({
            where: { id },
            data: { email: newEmail },
        });
        return updatedProfile ? Profile.from(updatedProfile) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error when updating profile email. See server log for details.');
    }
};

const updatePassword = async (id: number, newPassword: string): Promise<Profile> => {
    try {
        const updatedProfile = await database.profile.update({
            where: { id },
            data: { password: newPassword },
        });
        return updatedProfile ? Profile.from(updatedProfile) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error when updating profile password. See server log for details.');
    }
};

const updateName = async (id: number, newName: string): Promise<Profile> => {
    try {
        const updatedProfile = await database.profile.update({
            where: { id },
            data: { name: newName },
        });
        return updatedProfile ? Profile.from(updatedProfile) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error when updating profile Name. See server log for details.');
    }
};

const updateRole = async (id: number, newRole: Role): Promise<Profile> => {
    try {
        const updatedProfile = await database.profile.update({
            where: { id },
            data: { role: newRole },
        });
        return updatedProfile ? Profile.from(updatedProfile) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error when updating profile role. See server log for details.');
    }
};

const updatePictures = async (id: number, newPictures: string[]): Promise<Profile> => {
    try {
        const updatedProfile = await database.profile.update({
            where: { id },
            data: { pictures: newPictures },
        });
        return updatedProfile ? Profile.from(updatedProfile) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error when updating profile role. See server log for details.');
    }
};

const updatePreference = async (id: number, newPreference: Preference) => {
    try {
        const updatedProfile = await database.profile.update({
            where: { id },
            data: { preference: newPreference },
        });
        return updatedProfile ? Profile.from(updatedProfile) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error when updating profile preference. See server log for details.');
    }
};

const updateAge = async (id: number, newAge: number) => {
    try {
        const updatedProfile = await database.profile.update({
            where: { id },
            data: { age: newAge },
        });
        return updatedProfile ? Profile.from(updatedProfile) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error when updating profile age. See server log for details.');
    }
};

const updateGender = async (id: number, newGender: Gender) => {
    try {
        const updatedProfile = await database.profile.update({
            where: { id },
            data: { gender: newGender },
        });
        return updatedProfile ? Profile.from(updatedProfile) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error when updating profile gender. See server log for details.');
    }
};

const updateInterests = async (id: number, newInterests: string[]) => {
    try {
        const updatedProfile = await database.profile.update({
            where: { id },
            data: { interests: newInterests },
        });
        return updatedProfile ? Profile.from(updatedProfile) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error when updating profile interests. See server log for details.');
    }
};

const updateSocials = async (id: number, newSocials: string[]) => {
    try {
        const updatedProfile = await database.profile.update({
            where: { id },
            data: { socials: newSocials },
        });
        return updatedProfile ? Profile.from(updatedProfile) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error when updating profile socials. See server log for details.');
    }
};

const deleteProfile = async (id: number): Promise<Profile> => {
    try {
        const deletedProfile = await database.profile.delete({
            where: { id },
        });
        return Profile.from(deletedProfile);
    } catch (error) {
        console.error(error);
        throw new Error('Database error when deleting profile. See server log for details.');
    }
};

const getAllProfilesByGender = async (gender: Gender) => {
    try {
        const prismaProfiles = await database.profile.findMany({
            where: { gender },
        });
        return prismaProfiles ? prismaProfiles.map((p) => Profile.from(p)) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error when deleting profile. See server log for details.');
    }
};

export default {
    getAllProfilesByGender,
    createProfile,
    getAllProfiles,
    getProfileById,
    getProfileByEmail,
    updateBio,
    updateEmail,
    updatePassword,
    updateName,
    updateRole,
    updatePictures,
    updatePreference,
    updateAge,
    updateGender,
    updateInterests,
    updateSocials,
    deleteProfile,
};
