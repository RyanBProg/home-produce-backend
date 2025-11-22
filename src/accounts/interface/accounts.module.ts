import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from '../application/accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsEntity } from '../infrastructure/accounts.typeorm.entity';
import { AccountsTypeOrmAdapter } from '../infrastructure/accounts.typeorm.adapter';
import { ACCOUNTS_PORT } from './tokens';

@Module({
  controllers: [AccountsController],
  providers: [
    AccountsService,
    { provide: ACCOUNTS_PORT, useClass: AccountsTypeOrmAdapter },
  ],
  imports: [TypeOrmModule.forFeature([AccountsEntity])],
  exports: [AccountsService],
})
export class AccountsModule {}
