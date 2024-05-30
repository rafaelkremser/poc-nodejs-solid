import { describe, it, expect, beforeEach } from 'vitest';
import { CheckInUseCase } from './checkIn';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/inMemoryCheckInsRepository';
import { hash } from 'bcryptjs';

let usersRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryCheckInsRepository();
        sut = new CheckInUseCase(usersRepository);
    });

    it('should be able to check in', async () => {
        const { checkIn } = await sut.handle({
            userId: 'user-id',
            gymId: 'gym-id',
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });
});
