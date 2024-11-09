---
tags:
  - kubernetes
  - devops
data created: 2024-10-27
---
# Задание
----
Что такое labels и как их использовать

# Пометки 
---
Lables это просто пометки какого либо характера которые прописываются в metadata для того чтобы можно было сделать поиск, или для работы srevices

## Поиск
Например у когото деплоймонта есть метка app:web
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-server
  namespace: web2
  labels:
    app: web
    environment: production
```
и у второго тоже 
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-server
  namespace: web
  labels:
    app: web
    environment: production
```
и у нас еще куча рызных дейплойментов и мы хотим найти какие именно web
```bash
kubectl get deployment -l app=web
```
после чего выведутся все деплои у которых есть метка app:web
точно так же работает для подов и тд.

## Для selector
[[Kubernetes Selector]]

# Выводы
---

