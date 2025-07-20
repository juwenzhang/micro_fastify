### 系统启动流程
1. 启动入口 ：通过 src/index.ts 中的 start() 函数启动应用。
2. 组件初始化顺序 ：
   - 先初始化 MySQL（ initMysql ）：创建数据库（若不存在）、连接数据库、初始化表结构。
   - 再初始化 Redis（ initRedis ）：连接 Redis 服务、注册分布式锁功能。
   - 最后注册服务到 Consul（ registerService ）：将服务信息注册到 Consul，并配置健康检查。
3. 启动服务 ：注册路由后，启动 Fastify 服务器，监听指定端口。
### Consul、Redis、MySQL 执行流程 MySQL 流程
- 从配置中获取 MySQL 连接信息。
- 创建临时连接，执行 CREATE DATABASE IF NOT EXISTS 语句确保数据库存在。
- 注册 Fastify 的 MySQL 插件，建立正式连接。
- 执行 SQL 初始化表结构（从 constants.ts 中获取 create_table 语句）。 Redis 流程
- 从配置中获取 Redis 连接信息。
- 注册 Fastify 的 Redis 插件，建立连接。
- 为应用添加分布式锁功能（ redisLock 装饰器），包含获取锁、释放锁等方法。 Consul 流程
- 初始化 Consul 客户端，使用配置中的地址和端口。
- 调用 registerService 注册服务，包含服务名称、地址、端口等信息。
- 配置健康检查：每 10 秒访问一次 /health 端点，超时时间 5 秒，60 秒后移除不健康服务。
### 客户端请求流程
1. 客户端向 Fastify 服务器发送请求。
2. 服务器根据路由配置（如 userRoutes ）将请求转发到相应的处理函数。
3. 处理函数可能会：
   - 访问 MySQL 数据库获取或存储数据。
   - 使用 Redis 缓存数据或实现分布式锁。
   - 若需调用其他服务，通过 discoverService 从 Consul 获取目标服务地址，再发起请求。
### Consul 健康诊断的必要性
1. 确保服务可用性 ：通过定期检查 /health 端点，Consul 能及时发现不可用的服务实例。
2. 自动故障转移 ：当服务实例不健康时，Consul 会将其从服务列表中移除，避免请求被路由到故障实例。
3. 提高系统可靠性 ：健康诊断是服务治理的重要部分，确保整个微服务系统的稳定运行。
4. 动态服务发现 ：只有健康的服务实例才会被其他服务发现和调用，保证了服务调用的成功率。