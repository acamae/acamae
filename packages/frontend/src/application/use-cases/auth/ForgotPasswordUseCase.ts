import { AuthRepository } from '@domain/repositories/AuthRepository';

export interface ForgotPasswordUseCaseInput {
  email: string;
}

export class ForgotPasswordUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(input: ForgotPasswordUseCaseInput): Promise<void> {
    await this.authRepository.forgotPassword(input.email);
  }
}
