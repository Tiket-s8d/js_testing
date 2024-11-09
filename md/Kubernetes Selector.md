---
tags:
  - devops
  - kubernetes
data created: 2024-10-27
---
# Задание
----
Что такое selector и как их использовать 
# Пометки 
---
Это уже то что будет смотреть на то какую абстракцию по лейблу нужно связать с этой абстракцией 
пример сервис будет работать со всеми подами у которых есть лейбл app:web 
```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-server-service
  namespace: web
spec:
  selector:
    app: web
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```
вот селектор
```yaml
selector:
    app: web
```


так же для деплоймента 
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-server
  namespace: web
  labels:
    app: web
    environment: production
spec:
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: httpd
        image: httpd:2.4.48-alpine3.14
        ports:
        - containerPort: 80
```
вот селектор
```yaml
selector:
    matchLabels:
      app: web
```
# Выводы
---

