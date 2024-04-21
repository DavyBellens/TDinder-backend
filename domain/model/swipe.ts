import { Swipe as SwipePrisma } from '@prisma/client';
import { Direction } from '../../types';

export class Swipe {
    readonly id: number;
    readonly swiperId: number;
    readonly swipeeId: number;
    readonly direction: Direction;

    constructor(swipe: { id: number; swiperId: number; swipeeId: number; direction: Direction }) {
        Swipe.validate(swipe.swiperId, swipe.swipeeId, swipe.direction);
        this.id = swipe.id;
        this.swiperId = swipe.swiperId;
        this.swipeeId = swipe.swipeeId;
        this.direction = swipe.direction;
    }

    equals(otherSwipe: { swiperId: number; swipeeId: number; direction: Direction }) {
        return (
            this.swiperId === otherSwipe.swiperId &&
            this.swipeeId === otherSwipe.swipeeId &&
            this.direction === otherSwipe.direction
        );
    }

    static validate(swiperId: number, swipeeId: number, direction: Direction) {
        if (swiperId == null) throw new Error('Swiper ID cannot be null');
        if (swipeeId == null) throw new Error('Swipee ID cannot be null');
        Swipe.validateDirection(direction);
    }

    static validateDirection(direction: Direction) {
        if (direction !== 'L' && direction !== 'R') throw new Error('Invalid direction');
    }

    static from({ id, swiperId, swipeeId, direction }: SwipePrisma) {
        return new Swipe({ id, swiperId, swipeeId, direction });
    }
}
