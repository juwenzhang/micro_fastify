import Consul from "consul";
import { getConsulConfig, getServiceConfig } from "./cache.ts";

export const consul = new Consul({
    host: getConsulConfig()?.host,
    port: getConsulConfig()?.port,
})

// 注册服务实现
export const registerService = async () => {
    await (consul.agent.service as any).register({
        name: getServiceConfig()?.name || 'user-service',
        address: getServiceConfig()?.host || 'localhost',
        port: Number(getServiceConfig()?.port) || 3000,
        check: {
            http: `http://${getServiceConfig()?.host || 'localhost'}:${getServiceConfig()?.port || 3000}/health`,
            interval: '10s',
            timeout: '5s',
            deregisterCriticalServiceAfter: '60s',
        },
    })
}

// export const registerService2 = async (name: string, host: string, port: number) => {
//     await (consul.agent.service as any).register({
//         name,
//         address: host,
//         port,
//         check: {
//             http: `http://${host}:${port}/health`,
//             interval: '10s',
//             timeout: '5s',
//             deregisterCriticalServiceAfter: '60s',
//         },
//     })
// }

// 发现服务
export const discoverService = async (serviceName: string): Promise<string> => {
    const services = await consul.catalog.service.nodes(serviceName)
    if (services.length === 0) {
        throw new Error(`No instances of ${serviceName} found`)
    }
    const randomIndex = Math.floor(Math.random() * services.length)
    const randomService = services[randomIndex]
    return `http://${services[0].ServiceAddress}:${services[0].ServicePort}`;
}