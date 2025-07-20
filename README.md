### English Document
* docker-compose up -d
* docker-compose build --no-cache
```yaml
version: '3'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: 451674jh
      MYSQL_DATABASE: microservice_db
    ports:
      - "3306:3306"
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
  consul:
    image: consul:1.15
    ports:
      - "8500:8500"
```

### Consul 注册服务
* access link: `http://localhost:8500/v1/agent/services`
```text
{
    "user-service": {
        "ID": "user-service",
        "Service": "user-service",
        "Tags": [],
        "Meta": {},
        "Port": 3001,
        "Address": "localhost",
        "Weights": {
            "Passing": 1,
            "Warning": 1
        },
        "EnableTagOverride": false,
        "Datacenter": "dc1"
    },
    "user-service1": {
        "ID": "user-service1",
        "Service": "user-service1",
        "Tags": [],
        "Meta": {},
        "Port": 3002,
        "Address": "localhost",
        "Weights": {
            "Passing": 1,
            "Warning": 1
        },
        "EnableTagOverride": false,
        "Datacenter": "dc1"
    }
    ...more micro service detail info 
}
```