import { CheckInsRepository } from '@/repositories/checkInsRepository';
import { CheckIn } from '@prisma/client';

interface CheckInUseCaseRequest {
    userId: string;
    gymId: string;
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn;
}

export class CheckInUseCase {
    constructor(private checkInsRepository: CheckInsRepository) {}

    async handle({
        userId,
        gymId,
    }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
        const checkIn = await this.checkInsRepository.create({
            user_id: userId,
            gym_id: gymId,
        });

        return {
            checkIn,
        };
    }
}
