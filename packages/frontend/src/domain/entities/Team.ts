import { Entity } from '@domain/types/entity';

import { User } from './User';

/**
 * Team entity
 * Represents an esports team in the system
 */
export interface Team extends Entity {
  name: string;
  tag: string;
  logoFilename?: string;
  description?: string;
  userId: string;
  user?: User;
}

/**
 * CreateTeamDto
 * Used for team creation
 */
export interface CreateTeamDto {
  name: string;
  tag: string;
  logoFilename?: string;
  description?: string;
}

/**
 * UpdateTeamDto
 * Used for team updates
 */
export interface UpdateTeamDto {
  name?: string;
  tag?: string;
  logoFilename?: string;
  description?: string;
} 