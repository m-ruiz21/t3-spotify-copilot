import { PrismaClient, User } from '@prisma/client';
import { db } from '@/server/clients/db';
import { ConditionalSingleton } from '@/server/utils/conditional-singleton';
import { Result, Err, Ok } from '@/common/models/result';
import { ErrorWithCode } from '@/common/models/error-with-code';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';

type UserRepositoryResult = Result<User, ErrorWithCode>;
class UserRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = db;
    }

    async create(user: Partial<User>): Promise<UserRepositoryResult> {
        try{
            const new_user = await this.prisma.user.create({
                data: user,
            });

            return Ok(new_user);
        } catch (error: any) {
            return Err({
                status: 500,
                message: error.message || 'Some error occurred while creating the User.'
            });
        }
    }

    async findById(id: string): Promise<UserRepositoryResult> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id },
            });

            if (!user) {
                return Err({
                    status: 404,
                    message: `User not found with id ${id}`
                });
            }
            
            return Ok(user)
        } catch (error: any) {
            return Err({
                status: 500,
                message: error.message || 'Some error occurred while retrieving user.'
            });
        }
    }

    async update(id: string, user: Partial<User>): Promise<UserRepositoryResult> {
        try {
            const updated_user = await this.prisma.user.update({
                where: { id },
                data: user,
            });

            if (!updated_user) {
                return Err({
                    status: 404,
                    message: `User not found with id ${id}`
                });
            }

            return Ok(updated_user);
        } catch (error: any) {
            return Err({
                status: 500,
                message: error.message || 'Some error occurred while updating user.'
            });
        }

    }

    async delete(id: string): Promise<UserRepositoryResult> {
        try {
            const user = await this.prisma.user.delete({
                where: { id },
            });

            if (!user) {
                return Err({
                    status: 404,
                    message: `User not found with id ${id}`
                });
            }
            return Ok(user);
        } catch (error: any) {
            return Err({
                status: 500,
                message: error.message || 'Some error occurred while deleting user.'
            });
        }
    }
}

export default ConditionalSingleton(UserRepository);