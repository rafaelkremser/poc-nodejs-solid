import { CheckInsRepository } from '@/repositories/checkInsRepository';
import { GymsRepository } from '@/repositories/gymsRepository';
import { CheckIn } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resourceNotFoundError';
import { getDistanceBetweenCoordinate } from '@/repositories/utils/getDistanceBetweenCoordinates';

interface CheckInUseCaseRequest {
    userId: string;
    gymId: string;
    userLatitude: number;
    userLongitude: number;
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn;
}

export class CheckInUseCase {
    constructor(
        private checkInsRepository: CheckInsRepository,
        private gymsRepositoy: GymsRepository
    ) {}

    async handle({
        userId,
        gymId,
        userLatitude,
        userLongitude,
    }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
        const gym = await this.gymsRepositoy.findById(gymId);

        if (!gym) {
            throw new ResourceNotFoundError();
        }

        const distance = getDistanceBetweenCoordinate(
            {
                latitude: userLatitude,
                longitude: userLongitude,
            },
            {
                latitude: gym.latitude.toNumber(),
                longitude: gym.longitude.toNumber(),
            }
        );

        const MAX_DISTANCE_IN_KILOMETERS = 0.1;

        if (distance > MAX_DISTANCE_IN_KILOMETERS) {
            throw new Error();
        }

        const checkInOnSameDay =
            await this.checkInsRepository.findByUserIdOnDate(
                userId,
                new Date()
            );

        if (checkInOnSameDay) {
            throw new Error();
        }

        const checkIn = await this.checkInsRepository.create({
            user_id: userId,
            gym_id: gymId,
        });

        return {
            checkIn,
        };
    }
}
