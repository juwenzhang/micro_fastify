import { type FastifyInstance } from 'fastify'
import fastifyMysql from '@fastify/mysql';
import { createConnection } from 'mysql2/promise';
import { getMysqlConfig } from './cache.ts'
import execSqlState from './constants.ts'

export const initMysql = async (app: FastifyInstance) => {
    const mysqlConfig = getMysqlConfig();
    if (!mysqlConfig) {
        throw new Error('MySQL配置获取失败');
    }
    // console.log(mysqlConfig)
    try {
        const tempConnection = await createConnection({
            host: mysqlConfig.host,
            port: mysqlConfig.port,
            user: mysqlConfig.user,
            password: mysqlConfig.password,
        })
        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${mysqlConfig.database}`)
        await tempConnection.end()
    } catch (error) {
        throw new Error(`创建数据库失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
    await app.register(fastifyMysql, {
        promise: true,
        ...mysqlConfig,
        database: mysqlConfig?.database || 'user_service',
    })

    // 初始化数据库
    await (app as any).mysql.query(execSqlState.create_table)
}
