import { User } from '@domain/entities/User';
import { Repository } from '@domain/repositories/repository';

/**
 * Auth repository interface
 * Defines methods for authentication operations
 */
export interface AuthRepository extends Repository<User> {
  login(email: string, password: string): Promise<User>;
  register(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
