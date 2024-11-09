---
tags:
  - devops
  - kubernetes
  - абстракции
data created: 2024-10-27
---
# Задание
----
Что такое services

# Пометки 
---
Это такая абстракция которая является точкой входа в группу подов, ее можно использовать как для передачи запросов из интернета на поды так и для общения между подами в кластере. Так же services предоставляет либо статический IP для того чтобы принимать запросы либо можно внутри кластера обращаться к подам по DNS имени.


## Базовый функционал Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app.kubernetes.io/name: proxy
  ports:
  - name: name-of-service-port
    protocol: TCP
    port: 80
    targetPort: 80
```
В данном примере мы говорим что для мы берем все поды [[Kubernetes Selector]] у которых есть лейбл proxy [[Kubernetes Labels]]  и говорим что точка входа у них это сервис под именем `nginx-service` будет принимать все запросы на порт 80 `port`и перенаправлять на порты контейнера 80 `targetPort` и все это работает по `TCP` указали это `protocol` 
ну и так же можно прописывать сколько угодно портов 
```yaml
ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
    - name: https
      protocol: TCP
      port: 443
      targetPort: 9377
```

## ClusterIP
Общение между сервисами происходит только внутри кластера если не использовать [[Kubernetes Ingress]] 
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-clusterip-service
spec:
  type: ClusterIP
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080
```
То есть сервис принимает запросы на 80 порт и перенаправляет на порт 8080 подам

## NodePort
Предоставляет порт во внешнюю сеть через который уже может идти общение между сервисом и внешней сетью
Он выделяет фиксированный порт на каждом узле кластера, через который можно получить доступ к сервису.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nodeport-service
spec:
  type: NodePort
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080
      nodePort: 30000
```
То есть запросы приходят на  ip кластера на порт 30000 `nodePort` после чего перенаправляется на порт сервиса 80 который уже перенаправляет запрос на порт 8080 подов
## LoadBalancer
Создает внешний балансировщик нагрузки и предоставляет публичный IP-адрес для доступа извне. 
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-loadbalancer-service
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080
```

# Выводы
---

