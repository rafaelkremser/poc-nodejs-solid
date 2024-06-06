import { CheckInsRepository } from '@/repositories/checkInsRepository';
import { GymsRepository } from '@/repositories/gymsRepository';
import { CheckIn } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resourceNotFoundError';
import { getDistanceBetweenCoordinates } from '@/utils/getDistanceBetweenCoordinates';
import { MaxDistanceError } from './errors/maxDistanceError';
import { MaxNumberOfCheckInsError } from './errors/maxNumberOfCheckInsError';

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

        checkIn.validated_at = new Date();

        await this.checkInsRepository.save(checkIn);

        return {
            checkIn,
        };
    }
}
