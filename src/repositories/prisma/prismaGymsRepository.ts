import { Gym, Prisma } from '@prisma/client';
import { FindManyNearbyParams, GymsRepository } from '../gymsRepository';
import { prisma } from '@/lib/prisma';
import { getDistanceBetweenCoordinates } from '@/utils/getDistanceBetweenCoordinates';

export class PrismaGymsRepository implements GymsRepository {
    async create(data: Prisma.GymCreateInput) {
        const gym = await prisma.gym.create({
            data,
        });

        return gym;
    }

    async findById(id: string) {
        const gym = await prisma.gym.findFirst({
            where: { id },
        });

        return gym;
    }

    async searchMany(query: string, page: number) {
        const gyms = await prisma.gym.findMany({
            where: {
                title: { contains: query },
            },
            take: 20,
            skip: 20 * (page - 1),
        });

        return gyms;
    }

    async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
        const gyms = await prisma.$queryRaw<Gym[]>`
            SELECT * from gyms
            WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
        `;

        return gyms;
    }
}
