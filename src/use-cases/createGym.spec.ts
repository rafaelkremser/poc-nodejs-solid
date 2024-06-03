import { describe, it, expect, beforeEach } from 'vitest';
import { CreateGymUseCase } from './createGym';
import { InMemoryGymsRepository } from '@/repositories/in-memory/inMemoryGymsRepository';
import { Decimal } from '@prisma/client/runtime/library';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new CreateGymUseCase(gymsRepository);
    });

    it('should be able to crate a gym', async () => {
        const { gym } = await sut.handle({
            title: 'javascript gym',
            description: null,
            phone: null,
            latitude: 16.1471697,
            longitude: -40.2968506,
        });

        expect(gym.id).toEqual(expect.any(String));
    });
});
