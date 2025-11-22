import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/createAccount.dto';
import { AccountsService } from '../application/accounts.service';
import { EditAccountDto } from './dto/editAccount.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get(':id')
  getAccountById(@Param('id') id: string) {
    return this.accountsService.getAccountById(id);
  }

  @Post()
  createAccount(@Body() account: CreateAccountDto) {
    return this.accountsService.createAccount(account);
  }

  @Put(':id')
  editAccount(@Param('id') id: string, @Body() account: EditAccountDto) {
    return this.accountsService.editAccount({ ...account, id });
  }

  @Delete(':id')
  deleteAccount(@Param('id') id: string) {
    return this.accountsService.deleteAccount(id);
  }
}
