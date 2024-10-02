import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TransactionEntity, UserEntity } from 'src/db/entities';
import { RedisCacheService } from '@app/common/redis-cashe';

@Injectable()
export class UserService {
  private readonly cacheKeyPrefix = 'user_balance_';

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async debitUserBalance(userId: number, amount: number, action: string) {
    const cacheKey = `${this.cacheKeyPrefix}${userId}`;

    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(UserEntity, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!user) throw new NotFoundException('User not found');
      if (user.balance < amount) throw new BadRequestException('Insufficient balance');

      user.balance -= amount;
      await manager.save(UserEntity, user);

      const transaction = manager.create(TransactionEntity, {
        user: user,
        action,
        amount: -amount,
      });
      await manager.save(TransactionEntity, transaction);

      await this.redisCacheService.set(cacheKey, user.balance);

      return user.balance;
    });
  }

  async getUserBalance(userId: number): Promise<number> {
    const cacheKey = `${this.cacheKeyPrefix}${userId}`;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const balance = user.balance;
    await this.redisCacheService.set(cacheKey, balance);
    return balance;
  }
}
