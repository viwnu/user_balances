import { Controller, Post, Param, Body, Get, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(':id/debit')
  async debitBalance(@Param('id') userId: number, @Body('amount') amount: number, @Body('action') action: string) {
    return this.userService.debitUserBalance(userId, amount, action);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('custom-key')
  @CacheTTL(5 * 60 * 1000)
  @Get(':id/balance')
  async getBalance(@Param('id') userId: number) {
    return this.userService.getUserBalance(userId);
  }
}
