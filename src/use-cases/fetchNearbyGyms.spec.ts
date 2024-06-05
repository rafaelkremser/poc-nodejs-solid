import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/inMemoryGymsRepository';
import { FetchNearbyGymsUseCase } from './fetchNearbyGyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Search Gym Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new FetchNearbyGymsUseCase(gymsRepository);
    });

    it('should be able to search for gyms by title or description', async () => {
        await gymsRepository.create({
            id: 'gym-01',
            title: 'javascript gym',
            description: 'typescript',
            phone: null,
            latitude: -19.9385967,
            longitude: -44.0196337,
        });

        await gymsRepository.create({
            id: 'gym-02',
            title: 'typescript gym',
            description: null,
            phone: null,
            latitude: 35.3066554,
            longitude: 139.496285,
        });

        await gymsRepository.create({
            id: 'gym-03',
            title: 'typescript gym',
            description: null,
            phone: null,
            latitude: -19.9407523,
            longitude: -43.9415088,
        });

        const { gyms } = await sut.handle({
            userLatitude: -19.9385875,
            userLongitude: -44.0196173,
        });

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ id: 'gym-01' }),
            expect.objectContaining({ id: 'gym-03' }),
        ]);
    });
});
