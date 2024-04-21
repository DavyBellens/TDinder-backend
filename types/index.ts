import { Gender, Match, Preference } from '@prisma/client';

type Role = 'ADMIN' | 'USER';
type Direction = 'L' | 'R';

type Swipe = {
    swiperId: number;
    swipeeId: number;
    direction: Direction;
};
type SwipeInput = {
    id: number;
    swiperId?: number;
    swipeeId?: number;
    direction?: Direction;
};

type ProfileInput = {
    email?: string;
    name?: string;
    password?: string;
    role?: Role;
    age?: number;
    preference?: Preference;
    gender?: Gender;
    interests?: string[];
    socials?: string[];
    pictures?: string[];
    bio?: string;
    matches?: Match[];
};

type ProfileReply = {
    personalInformation: {
        email: string;
        name: string;
        password: string;
        role: Role;
        age: number;
        interests?: string[];
        bio?: string;
    };
    preference: Preference;
    gender: Gender;
    socials: string[];
    pictures: string[];
};

type Token = {
    value: string;
};

type AuthenticatedToken = {
    email: string;
    id: string;
    role: Role;
};

type AuthenticatedProfile = {
    email: string;
    name: string;
    id: string;
    role: Role;
};

type AuthenticationResponse = {
    token: Token;
    profile: AuthenticatedProfile;
};

type SwipeResponse = {
    object: Swipe | Match;
    isMatch: boolean;
};

export {
    Role,
    Direction,
    Swipe,
    SwipeInput,
    ProfileInput,
    ProfileReply,
    AuthenticatedToken,
    AuthenticationResponse,
    SwipeResponse,
};
