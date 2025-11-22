import {
  AccountsPort,
  CreateAccountInput,
  EditAccountInput,
} from '../domain/accounts.port';

export class AccountsTypeOrmAdapter implements AccountsPort {
  getAccountById(id: string) {
    // implement me
  }

  createAccount(account: CreateAccountInput) {
    // implement me
  }

  editAccount(account: EditAccountInput) {
    // implement me
  }

  deleteAccount(id: string) {
    // implement me
  }
}
