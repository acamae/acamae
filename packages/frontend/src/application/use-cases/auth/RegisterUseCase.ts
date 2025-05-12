import { USER_ROLES } from '@domain/constants/user';
import { User } from '@domain/entities/User';
import { AuthRepository } from '@domain/repositories/AuthRepository';

export interface RegisterUseCaseInput {
  email: string;
  password: string;
  username: string;
}

export class RegisterUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(input: RegisterUseCaseInput): Promise<User> {
    const user = await this.authRepository.register({
      email: input.email,
      password: input.password,
      username: input.username,
      role: USER_ROLES.USER,
    });
    return user;
  }
}
