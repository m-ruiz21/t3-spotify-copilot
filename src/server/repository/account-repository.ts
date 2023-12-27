import { Account } from '@prisma/client';
import { db } from '@/server/clients/db';
import { ConditionalSingleton } from '../utils/conditional-singleton';

class AccountRepository {
    private prisma = db;

    async findById(id: string): Promise<Account | null> {
        return this.prisma.account.findUnique({
            where: { id },
        });
    }

    async findByUserId(userId: string): Promise<Account | null> {
        return this.prisma.account.findFirst({
            where: { userId },
        });
    }

    async update(id: string, account: Partial<Account>): Promise<Account> {
        return this.prisma.account.update({
            where: { id },
            data: account,
        });
    }
}

export default ConditionalSingleton(AccountRepository);