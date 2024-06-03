import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { CheckInsRepository } from '../checkInsRepository';

export class PrismaCheckInsRepository implements CheckInsRepository {
    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = await prisma.checkIn.create({
            data,
        });

        return checkIn;
    }

    async findByUserIdOnDate(userId: string, date: Date) {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        return user;
    }
}
