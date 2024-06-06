import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/inMemory/inMemoryCheckInsRepository';
import { GetUserMetrics } from './getUserMetrics';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetrics;

describe('Ger User Metrics Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new GetUserMetrics(checkInsRepository);
    });

    it('should be able to get check-ins count from metrics', async () => {
        await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        });

        await checkInsRepository.create({
            gym_id: 'gym-02',
            user_id: 'user-01',
        });

        const { checkInsCount } = await sut.handle({
            userId: 'user-01',
        });

        expect(checkInsCount).toEqual(2);
    });
});
