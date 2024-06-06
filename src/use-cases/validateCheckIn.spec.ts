import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/inMemory/inMemoryCheckInsRepository';
import { ValidateUseCase } from './validateCheckIn';
import { ResourceNotFoundError } from './errors/resourceNotFoundError';
import { LateCheckInValidationError } from './errors/lateCheckInValidationError';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateUseCase;

describe('Validate Check-in Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new ValidateUseCase(checkInsRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

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

    it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
        vi.setSystemTime(new Date(2024, 5, 4, 8, 0, 0));

        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        });

        const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21;

        vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS);

        await expect(() =>
            sut.handle({ checkInId: createdCheckIn.id })
        ).rejects.toBeInstanceOf(LateCheckInValidationError);
    });
});
