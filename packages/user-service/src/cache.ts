import { config } from './config.ts'


const getMysqlConfig = () => {
    return config.mysql
}

const getRedisConfig = () => {
    return config.redis
}

const getConsulConfig = () => {
    return config.consul
}

const getServiceConfig = () => {
    return config.service
}

export {
    getMysqlConfig,
    getRedisConfig,
    getConsulConfig,
    getServiceConfig,
}