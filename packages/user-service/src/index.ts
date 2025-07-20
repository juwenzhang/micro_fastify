import fastify from 'fastify';
import { config } from './config.ts';
import { initMysql } from './db.ts';
import { initRedis } from './redis.ts';
import { registerService, /*registerService2*/ } from './consul.ts';
import { userRoutes } from './routes/user.route.ts';

const start = async () => {
  const app = fastify({ logger: true });

  // 初始化组件
  await initMysql(app);
  await initRedis(app);
  await registerService();
  // await registerService2('user-service1', 'localhost', 3002);

  // 注册路由
  app.register(userRoutes, { prefix: '/api' });

  // 启动服务
  try {
    await (app as any).listen({ 
        host: config?.service?.host || '0.0.0.0', 
        port: config?.service?.port || 3000 
    });
    console.log(`[${config?.service?.name}] Running on ${config?.service?.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();