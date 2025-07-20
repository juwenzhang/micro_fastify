export interface User {
    id: number,
    username: string,
    email: string,
    createTime: string | null,
    updateTime: string | null,
    deleteTime: string | null,
    password: string,
}

export interface UserServiceConfig {
    name: string,
    host: string,
    port: number | string,
}

export interface MysqlConfig {
    host: string,
    port: number,
    user: string,
    password: string,
    database: string,
}

export interface RedisConfig {
    host: string,
    port: number,
    password: string,
}

export interface ConsulConfig {
    host: string,
    port: number,
    password: string,
}

export interface Config {
    service: Partial<UserServiceConfig>,
    mysql: Partial<MysqlConfig>,
    redis: Partial<RedisConfig>,
    consul: Partial<ConsulConfig>,
}
