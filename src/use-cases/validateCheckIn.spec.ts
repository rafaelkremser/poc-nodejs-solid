import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/inMemoryCheckInsRepository';
import { MaxNumberOfCheckInsError } from './errors/maxNumberOfCheckInsError';
import { ValidateUseCase } from './validateCheckIn';
import { ResourceNotFoundError } from './errors/resourceNotFoundError';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateUseCase;

describe('Validate Check-in Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new ValidateUseCase(checkInsRepository);

        // vi.useFakeTimers();
    });

    // afterEach(() => {
    //     vi.useRealTimers();
    // });

    it('should be able to validate the check-in', async () => {
        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        });

        const { checkIn } = await sut.handle({ checkInId: createdCheckIn.id });

        expect(checkIn.validated_at).toEqual(expect.any(Date));
        expect(checkInsRepository.items[0].validated_at).toEqual(
            expect.any(Date)
        );
    });

    it('should not be able to validate an inexistent check-in', async () => {
        await expect(() =>
            sut.handle({ checkInId: 'inexistent-check-in-id' })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
});
