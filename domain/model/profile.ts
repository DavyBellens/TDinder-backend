import { Gender, Preference, Profile as ProfilePrisma } from '@prisma/client';
import { Role } from '../../types';

export class Profile {
    readonly id: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly email: string;
    readonly name: string;
    readonly password: string;
    readonly role: Role;
    readonly preference: Preference;
    readonly age: number;
    readonly gender: Gender;
    readonly interests: string[];
    readonly socials: string[];
    readonly pictures: string[];
    readonly bio?: string;

    constructor(profile: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        name: string;
        password: string;
        role: Role;
        preference: Preference;
        age: number;
        gender: Gender;
        interests: string[];
        socials: string[];
        pictures: string[];
        bio?: string;
    }) {
        Profile.validate(
            profile.email,
            profile.name,
            profile.password,
            profile.role,
            profile.preference,
            profile.age,
            profile.gender,
            profile.interests,
            profile.socials,
            profile.pictures,
            profile.bio
        );
        this.id = profile.id;
        this.createdAt = profile.createdAt;
        this.updatedAt = profile.updatedAt;
        this.email = profile.email;
        this.name = profile.name;
        this.password = profile.password;
        this.role = profile.role;
        this.preference = profile.preference;
        this.age = profile.age;
        this.gender = profile.gender;
        this.interests = profile.interests;
        this.socials = profile.socials;
        this.pictures = profile.pictures;
        this.bio = profile.bio;
    }

    equals(otherProfile: {
        email: string;
        name: string;
        password: string;
        role: Role;
        preference: Preference;
        age: number;
        gender: Gender;
        interests: string[];
        socials: string[];
        pictures: string[];
        bio?: string;
    }): boolean {
        return (
            this.email === otherProfile.email &&
            this.name === otherProfile.name &&
            this.password === otherProfile.password &&
            this.role === otherProfile.role &&
            this.preference === otherProfile.preference &&
            this.age === otherProfile.age &&
            this.gender === otherProfile.gender &&
            this.interests === otherProfile.interests &&
            this.socials === otherProfile.socials &&
            this.pictures === otherProfile.pictures &&
            this.bio === otherProfile.bio
        );
    }

    static validate(
        email: string,
        name: string,
        password: string,
        role: Role,
        preference: Preference,
        age: number,
        gender: Gender,
        interests: string[],
        socials: string[],
        pictures: string[],
        bio?: string
    ): void {
        Profile.validateEmail(email);
        Profile.validateName(name);
        Profile.validatePassword(password);
        Profile.validateRole(role);
        Profile.validatePreference(preference);
        Profile.validateAge(age);
        Profile.validateGender(gender);
        Profile.validateInterests(interests);
        Profile.validateSocials(socials);
        Profile.validatePictures(pictures);
        Profile.validateBio(bio);
    }

    static validateEmail = (email: string): void => {
        if (!email) throw new Error('Email is required');
        if (!email.includes('@')) throw new Error("Email must contain a '@'");
    };

    static validatePassword = (password: string): void => {
        if (!password?.trim()) throw new Error('Password is required');
        if (password.length < 8) throw new Error('Password must be at least 8 characters long');
        if (!password.match(/\d/)) throw new Error('Password must contain at least 1 number');
        if (!password.match(/[A-Z]/)) throw new Error('Password must contain at least 1 capital letter');
    };

    static validateRole = (role: Role): void => {
        if (!['ADMIN', 'USER'].includes(role)) {
            throw new Error('Role must be one of "ADMIN", "USER"');
        }
    };

    static validateName = (name: string): void => {
        if (!name) throw new Error('Name is required');
        if (name.length > 50) throw new Error('Name cannot be longer than 50 characters');
    };

    static validateBio = (bio: string): void => {
        if (bio != null && bio.length > 200) throw new Error('Bio cannot be longer than 200 characters');
    };

    static validatePictures = (pictures: string[]) => {
        pictures.map((picture) => {
            if (!picture.trim()) throw new Error("Picture can't be empty");
        });
    };

    static validatePreference = (preference: Preference) => {
        if (!preference) throw new Error('Preference required');
        if (!Object.values(Preference).includes(preference))
            throw new Error('You must prefer either Male, Female, Both or Other.');
    };
    static validateAge = (age: number) => {
        if (age < 0) throw new Error("Age can't be negative");
    };

    static validateGender = (gender: Gender) => {
        if (!Object.values(Gender).includes(gender)) throw new Error('Unsupported gender');
    };

    static validateInterests = (interests: string[]) => {
        interests.forEach((i) => {
            if (!i.trim()) throw new Error("Interest can't be empty");
        });
    };

    static validateSocials = (socials: string[]) => {
        if (socials.length !== 5) throw new Error('List of socials must be 5 long');
        let nullCount = 0;
        socials.forEach((i) => {
            if (i == undefined) nullCount += 1;
        });
        if (nullCount == 5) throw new Error('At least one social is required');
    };

    static from({
        id,
        createdAt,
        updatedAt,
        email,
        name,
        password,
        role,
        preference,
        age,
        gender,
        interests,
        socials,
        pictures,
        bio,
    }: ProfilePrisma): Profile {
        return new Profile({
            id,
            createdAt,
            updatedAt,
            email,
            name,
            password,
            role,
            preference,
            age,
            gender,
            interests,
            socials,
            pictures,
            bio,
        });
    }
}
