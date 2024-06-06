import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/inMemory/inMemoryGymsRepository';
import { SearchGymsUseCase } from './searchGyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gym Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new SearchGymsUseCase(gymsRepository);
    });

    it('should be able to search for gyms by title or description', async () => {
        await gymsRepository.create({
            id: 'gym-01',
            title: 'javascript gym',
            description: 'typescript',
            phone: null,
            latitude: 16.1471697,
            longitude: -40.2968506,
        });

        await gymsRepository.create({
            id: 'gym-02',
            title: 'typescript gym',
            description: null,
            phone: null,
            latitude: 16.1471697,
            longitude: -40.2968506,
        });

        const { gyms } = await sut.handle({ query: 'typescript', page: 1 });

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ id: 'gym-01' }),
            expect.objectContaining({ id: 'gym-02' }),
        ]);
    });

    it('should be able to fetch paginated gym search', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `javascript gym ${i}`,
                description: null,
                phone: null,
                latitude: 16.1471697,
                longitude: -40.2968506,
            });
        }

        const { gyms } = await sut.handle({
            query: 'javascript',
            page: 2,
        });

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'javascript gym 21' }),
            expect.objectContaining({ title: 'javascript gym 22' }),
        ]);
    });
});
