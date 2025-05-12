import { Entity } from '@domain/types/entity';

/**
 * Generic repository interface
 * This interface defines the standard operations to be performed on a model
 * @template T - The entity type this repository handles
 */
export interface Repository<T extends Entity<any>> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}
