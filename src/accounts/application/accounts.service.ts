import { Inject, Injectable } from '@nestjs/common';
import { Account } from '../domain/accounts.entity';
import type {
  AccountsPort,
  CreateAccountInput,
  EditAccountInput,
} from '../domain/accounts.port';
import { PRODUCER_REPOSITORY } from 'src/producers/tokens';

@Injectable()
export class AccountsService {
  constructor(
    @Inject(PRODUCER_REPOSITORY) private readonly accountsPort: AccountsPort,
  ) {}

  getAccountById(id: string): Promise<Account | null> {
    return this.accountsPort.getAccountById(id);
  }

  createAccount(account: CreateAccountInput): Promise<Account | null> {
    return this.accountsPort.createAccount(account);
  }

  editAccount(account: EditAccountInput): Promise<Account | null> {
    return this.accountsPort.editAccount(account);
  }

  deleteAccount(id: string): Promise<void> {
    return this.accountsPort.deleteAccount(id);
  }
}
