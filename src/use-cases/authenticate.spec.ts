import { describe, it, expect, beforeEach } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { InMemoryUsersRepository } from '@/repositories/in-memory/inMemoryUsersRepositoriy';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalidCredentialsError';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(usersRepository);
    });

    it('should be able to authenticate', async () => {
        await usersRepository.create({
            name: 'Jonh Doe',
            email: 'jonhdoe@email.com',
            password_hash: await hash('123456', 6),
        });

        const { user } = await sut.handle({
            email: 'jonhdoe@email.com',
            password: '123456',
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('should not be able to authenticate with wrong email', async () => {
        await expect(() =>
            sut.handle({
                email: 'email@email.com',
                password: '12',
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        await usersRepository.create({
            name: 'Jonh Doe',
            email: 'jonhdoe@email.com',
            password_hash: await hash('123456', 6),
        });

        await expect(() =>
            sut.handle({
                email: 'jonhdoe@email.com',
                password: '123123',
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});
