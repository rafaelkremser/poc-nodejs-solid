import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterUseCase } from './registerUser';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/inMemoryUsersRepositoriy';
import { UserAlreadyExistsError } from './errors/userAlreadyExistsError';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new RegisterUseCase(usersRepository);
    });

    it('should be able to register', async () => {
        const { user } = await sut.handle({
            name: 'Jonh Doe',
            email: 'jonhdoe@email.com',
            password: '123456',
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('should hash user password upon registration', async () => {
        const { user } = await sut.handle({
            name: 'Jonh Doe',
            email: 'jonhdoe@email.com',
            password: '123456',
        });

        const isPasswordCorrectlyHashed = await compare(
            '123456',
            user.password_hash
        );

        expect(isPasswordCorrectlyHashed).toBe(true);
    });

    it('should not be able to register with same email twice', async () => {
        const email = 'jonhdoe@email.com';

        await sut.handle({
            name: 'Jonh Doe',
            email,
            password: '123456',
        });

        await expect(() =>
            sut.handle({
                name: 'Jonh Doe',
                email,
                password: '123456',
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
});
