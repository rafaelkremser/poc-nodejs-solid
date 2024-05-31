import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { CheckInUseCase } from './checkIn';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/inMemoryCheckInsRepository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/inMemoryGymsRepository';
import { Decimal } from '@prisma/client/runtime/library';

let usersRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInUseCase(usersRepository, gymsRepository);

        gymsRepository.items.push({
            id: 'gym-01',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(0),
            longitude: new Decimal(0),
        });

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to check in', async () => {
        const { checkIn } = await sut.handle({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: 0,
            userLongitude: 0,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in twice on same day', async () => {
        await sut.handle({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0,
        });

        await expect(() =>
            sut.handle({
                gymId: 'gym-01',
                userId: 'user-01',
                userLatitude: 0,
                userLongitude: 0,
            })
        ).rejects.toBeInstanceOf(Error);
    });

    it('should be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await sut.handle({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0,
        });

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

        const { checkIn } = await sut.handle({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in on distant gym', async () => {
        gymsRepository.items.push({
            id: 'gym-02',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(16.1471697),
            longitude: new Decimal(-40.2968506),
        });

        await expect(() =>
            sut.handle({
                userId: 'user-01',
                gymId: 'gym-02',
                userLatitude: 35.306609,
                userLongitude: 139.495971,
            })
        ).rejects.toBeInstanceOf(Error);
    });
});
