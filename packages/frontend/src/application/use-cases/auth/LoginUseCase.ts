import { User } from '@domain/entities/User';
import { AuthRepository } from '@domain/repositories/AuthRepository';

export interface LoginUseCaseInput {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(input: LoginUseCaseInput): Promise<User> {
    const user = await this.authRepository.login(
      input.email,
      input.password
    );
    return user;
  }
}
