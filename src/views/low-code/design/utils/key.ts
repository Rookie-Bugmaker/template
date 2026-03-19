import { uuid } from '@/utils/unique-key-util';

export function generateKey(): string {
  return uuid(32);
}
