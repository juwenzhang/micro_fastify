import dotenv from 'dotenv';
import { type Config } from './types/index.ts';

dotenv.config();

export const config: Partial<Config> = {
    service: {
        name: process.env.SERVICE_NAME || 'user-service',
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3001,
    },
    mysql: {
        host: process.env.MYSQL_HOST || 'mysql',
        port: Number(process.env.MYSQL_PORT) || 3306,
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '451674jh',
        database: process.env.MYSQL_DATABASE || 'user_service',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        // password: process.env.REDIS_PASSWORD || '123456',
    },
    consul: {
        host: process.env.CONSUL_HOST || 'localhost',
        port: Number(process.env.CONSUL_PORT) || 8500,
        password: process.env.CONSUL_PASSWORD || '123456',
    },
}
