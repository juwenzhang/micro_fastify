## English Document

* docker-compose up -d
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

