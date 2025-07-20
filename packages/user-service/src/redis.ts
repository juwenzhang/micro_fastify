import { type FastifyInstance } from "fastify";
import fastifyRedis from '@fastify/redis';
import { getRedisConfig } from './cache.ts'

export const initRedis = async (app: FastifyInstance) => {
    await app.register(fastifyRedis, {
        host: getRedisConfig()?.host,
        port: getRedisConfig()?.port,
        // password: getRedisConfig()?.password,
    })

    // 添加分布式锁
    app.decorate('redisLock', {
        async acquire(key: string, ttl: number = 5000): Promise<() => Promise<void>> {
            const lockKey = `lock:${key}`;
            const acquired = await app.redis.set(lockKey, '1', 'PX', ttl)
            if (!acquired) {
                throw new Error(`Lock ${key} already exists`)
            }
            return async () => {
                await app.redis.del(lockKey)
            }
        },
        async release(key: string): Promise<void> {
            const lockKey = `lock:${key}`;
            await app.redis.del(lockKey)
        },
        async get(key: string): Promise<string | null> {
            return app.redis.get(key)
        },
        async set(key: string, value: string, ttl: number = 5000): Promise<void> {
            await app.redis.set(key, value, 'PX', ttl)
        },
        async del(key: string): Promise<void> {
            await app.redis.del(key)
        },
    })
}