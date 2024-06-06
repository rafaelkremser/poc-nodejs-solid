import { describe, it, expect, beforeEach } from 'vitest';
import { GetUserProfileUseCase } from './getUserProfile';
import { InMemoryUsersRepository } from '@/repositories/inMemory/inMemoryUsersRepository';
import { hash } from 'bcryptjs';
import { ResourceNotFoundError } from './errors/resourceNotFoundError';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get user profile Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileUseCase(usersRepository);
    });

    it('should be able to get user profile', async () => {
        const createdUser = await usersRepository.create({
            name: 'Jonh Doe',
            email: 'jonhdoe@email.com',
            password_hash: await hash('123456', 6),
        });

        const { user } = await sut.handle({
            userId: createdUser.id,
        });

        expect(user.id).toEqual(expect.any(String));
        expect(user.name).toEqual('Jonh Doe');
    });

    it('should not be able to get user profile with worng id', async () => {
        await expect(() =>
            sut.handle({
                userId: 'wrong id',
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
});
