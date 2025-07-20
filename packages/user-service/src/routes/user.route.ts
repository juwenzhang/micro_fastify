import { type FastifyInstance } from 'fastify'
import { type User } from "../types/index.ts"
// import { v4 as uuid4 } from "uuid";
import execSqlState from "../constants.ts";
import { PasswordUtils } from "../utils/password-bcrypt.ts";

export const userRoutes = async (app: FastifyInstance) => {
    // 系统健康检查服务
    const getSystemHealth = () => {
        const memoryUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        const uptime = process.uptime();

        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: {
                name: 'user-service',
                version: '1.0.0',
                uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
            },
            resources: {
                memory: {
                    rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
                    heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                    heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
                },
                cpu: {
                    user: `${cpuUsage.user / 1000}ms`,
                    system: `${cpuUsage.system / 1000}ms`
                }
            },
            dependencies: {
                'shared-types': 'available',
                database: 'not_configured',
                cache: 'not_configured'
            }
        };
    };

    // 基础存活检查
    app.get('/health/liveness', async (req, res) => {
        res.send({
            status: 'ok',
            timestamp: new Date().toISOString()
        });
    });

    // 详细就绪检查
    app.get('/health/readiness', async (req, res) => {
        try {
            const healthStatus = getSystemHealth();
            // 如果有任何关键依赖不健康，返回503
            const isHealthy = Object
                .values(healthStatus.dependencies)
                .every(dep => dep === 'available' || dep === 'not_configured');
            res.status(isHealthy ? 200 : 503).send(healthStatus);
        } catch (error) {
            res.status(500).send({
                status: 'error',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    // 兼容旧版健康检查端点
    app.get('/health', async (req, res) => {
        res.redirect('/api/health/readiness');
    })

    // 用户注册接口
    app.post<{
        Body: {
            username: {
                type: 'string',
                description: '用户名',
            },
            email: {
                type: 'string',
                description: '用户邮箱',
            },
            password: {
                type: 'string',
                description: '用户密码',
            },
        }
    }>('/user/register', async (request, reply) => {
        const { username, email, password } = request.body;
        const lockKey = `user:email:${email}`;
        const releaseLock = await (app.redis as any).redisLock.acquire(lockKey);
        try {
            // 缓存资源判断
            const cacheKey = `user:email:${email}`;
            const cacheUser = await (app.redis as any).get(cacheKey);
            if (cacheUser) {
                return reply.code(400).send({ 
                    message: 'Email already registered' 
                });
            }

            // 检查数据库
            const [rows] = await ((app as any).mysql as any).query(`
                ${execSqlState.query_user_by_email}
            `, [email]);
            if ((rows as User[]).length > 0) {
                return reply.code(400).send({ 
                    message: 'Email already registered' 
                });
            }

            // 注册用户
            const [result] = await ((app as any).mysql as any).query(`
                ${execSqlState.insert_user}
            `, [username, email, await PasswordUtils.hashPassword(password.toString())]);

            const userId = (result as any).insertId;

            // 更新缓存
            const user:User = {
                id: userId,
                username: username.toString(),
                email: email.toString(),
                password: await PasswordUtils.hashPassword(password.toString()),
                createTime: new Date().toISOString(),
                updateTime: new Date().toISOString(),
                deleteTime: null,
            }
            await app.redis.set(`user:id:${userId}`, JSON.stringify(user), 'EX', 600);
            await app.redis.set(cacheKey, '1', 'EX', 600); // 邮箱已注册标记
            await releaseLock();
            return reply.code(200).send({ 
                message: 'Registration successful' 
            });
        } catch (error) {
            return reply.code(500).send({ 
                message: `Registration failed, ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        } finally {
            await releaseLock();
        }
    }),

    app.get<{ Params: { id: string } }>('/users/:id', async (request, reply) => {
        const { id } = request.params;
        const cacheKey = `user:id:${id}`;

        // 查缓存
        const cachedUser = await app.redis.get(cacheKey);
        if (cachedUser) {
            return { code: 200, data: JSON.parse(cachedUser) };
        }

        // 查DB
        const [rows] = await ((app as any).mysql as any).query(
            `${execSqlState.query_user_by_id}`,
            [id]
        );
        const user = (rows as User[])[0];
        if (!user) {
            return reply.code(404).send({ message: 'User not found' });
        }

        // 更新缓存
        await app.redis.set(cacheKey, JSON.stringify(user), 'EX', 600);
        return { code: 200, data: user };
    });
}