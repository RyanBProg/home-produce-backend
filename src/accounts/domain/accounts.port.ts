import type { Account } from '../domain/accounts.entity';

export interface CreateAccountInput {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
}

export interface EditAccountInput {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  passwordHash?: string;
}

export interface AccountsPort {
  getAccountById(id: string): Promise<Account | null>;
  createAccount(payload: CreateAccountInput): Promise<Account | null>;
  editAccount(payload: EditAccountInput): Promise<Account | null>;
  deleteAccount(id: string): Promise<void>;
}
