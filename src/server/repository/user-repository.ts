import { PrismaClient, User } from '@prisma/client';
import { db } from '@/server/clients/db';
import { ConditionalSingleton } from '@/server/utils/conditional-singleton';

class UserRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = db;
    }

    async create(user: Partial<User>): Promise<User> {
        return this.prisma.user.create({
            data: user,
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async update(id: string, user: Partial<User>): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: user,
        });
    }

    async delete(id: string): Promise<User> {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}

export default ConditionalSingleton(UserRepository);