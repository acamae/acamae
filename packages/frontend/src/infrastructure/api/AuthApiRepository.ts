import { USER_ROLES } from '@domain/constants/user';
import { User } from '@domain/entities/User';
import { AuthRepository } from '@domain/repositories/AuthRepository';
import { UserResponse } from '@domain/types/api';
import api from '@shared/services/axiosService';

function mapUserResponse(data: UserResponse): User {
  return {
    id: data.id,
    email: data.email,
    username: data.username,
    role: (data.role === USER_ROLES.ADMIN ? USER_ROLES.ADMIN : USER_ROLES.USER),
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt)
  };
}

export class AuthApiRepository implements AuthRepository {
  async login(email: string, password: string): Promise<User> {
    try {
      const { data } = await api.post<UserResponse>('/auth/login', { email, password });
      return mapUserResponse(data);
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  async register(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const { data } = await api.post<UserResponse>('/auth/register', user);
      return mapUserResponse(data);
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      throw new Error('Forgot password request failed');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', { token, password: newPassword });
    } catch (error) {
      throw new Error('Reset password failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      throw new Error('Logout failed');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data } = await api.get<UserResponse>('/auth/me');
      return mapUserResponse(data);
    } catch (error) {
      return null;
    }
  }

  async findAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<User | null> {
    try {
      const { data } = await api.get<UserResponse>(`/users/${id}`);
      return mapUserResponse(data);
    } catch (error) {
      return null;
    }
  }

  async save(entity: User): Promise<User> {
    try {
      const { data } = await api.put<UserResponse>(`/users/${entity.id}`, {
        email: entity.email,
        username: entity.username,
        role: entity.role
      });
      return mapUserResponse(data);
    } catch (error) {
      throw new Error('Failed to update user');
    }
  }
  
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  }
}
