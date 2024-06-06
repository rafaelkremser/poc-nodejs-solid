import { CheckInsRepository } from '@/repositories/checkInsRepository';
import { CheckIn } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resourceNotFoundError';
import dayjs from 'dayjs';
import { LateCheckInValidationError } from './errors/lateCheckInValidationError';

interface ValidateUseCaseRequest {
    checkInId: string;
}

interface ValidateUseCaseResponse {
    checkIn: CheckIn;
}

export class ValidateUseCase {
    constructor(private checkInsRepository: CheckInsRepository) {}

    async handle({
        checkInId,
    }: ValidateUseCaseRequest): Promise<ValidateUseCaseResponse> {
        const checkIn = await this.checkInsRepository.findById(checkInId);

        if (!checkIn) {
            throw new ResourceNotFoundError();
        }

        const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
            checkIn.created_at,
            'minutes'
        );

        if (distanceInMinutesFromCheckInCreation > 20) {
            throw new LateCheckInValidationError();
        }

        checkIn.validated_at = new Date();

        await this.checkInsRepository.save(checkIn);

        return {
            checkIn,
        };
    }
}
