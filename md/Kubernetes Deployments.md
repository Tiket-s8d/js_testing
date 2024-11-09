---
tags:
  - "#kubernetes"
  - devops
  - workload
  - абстракции
data created: 2024-10-11
---
# Задание
----
Что такое Deployments?
Для чего его используют?


# Пометки 
---
Deployments - это еще одна абстракция которая работает поверх replicaset, для того чтобы так же управлять репликами подов, обновлять состояние подов и так же хранить данные о их прошлом состоянии.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  replicas: 3  
  selector:
    matchLabels:
      app: my-app
  template:  
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-container
        image: nginx:1.21 
        ports:
        - containerPort: 80

```
В данном примере мы говорим что мы хотим создать Deployment который будет называться 
my-deployment, который будет запускать 3 пода у которых лейбл my-app (тоесть мы определяем какие поды относятся к данному deployment), потом мы создаем шаблон по которому будут создаваться поды, все поды в данном deployment будут с лейблом my-app а дальше просто описание пода.

## Команды

```
kubectl set image deployment/my-deployment my-container=nginx:1.22
```
С помощью данной команды мы говорим что мы хотим в деплоймонте my-deployment обновить образ контейнера у подов my-container на версию nginx:1.22


```
kubectl rollout undo deployment/my-deployment
```
Откатываем последнее обновление деполймонта my-deployment 

```
kubectl rollout status deployment/my-deployment
```
Можно отслеживать то как обновляется статус дполоймента 

### Обновления 
Deployment может обновлять поды которые у него в подчинении двумя способами:
Rolling Update тоесть постепенно выключать поды и заменять их на новые что приводит к тому что для пользователя приложение как работало так и работает без перебоев.
Recreate полностью вырубает все поды и запускает новые.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  replicas: 3
  strategy:
    type: RollingUpdate  
    rollingUpdate:
      maxUnavailable: 1  
      maxSurge: 1        
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-container
        image: nginx:1.21
        ports:
        - containerPort: 80

```
Точно такой же пример по созданию деплоймонта но тут уже добавляем то как он будет обновляться 
```yaml
  strategy:
    type: RollingUpdate  
    rollingUpdate:
      maxUnavailable: 1  
      maxSurge: 1
```
- **`type`** — Определяет тип стратегии. Может быть:
    - **`RollingUpdate`** (по умолчанию): обновление подов происходит плавно, старые поды заменяются на новые по очереди.
    - **`Recreate`**: все старые поды удаляются перед созданием новых.
- **`rollingUpdate`** — Параметры для стратегии **RollingUpdate**:
    - **`maxUnavailable`** — максимальное количество подов, которые могут быть недоступны (удалены) во время обновления. Может быть целым числом или процентом от общего числа реплик. Например, если у вас есть 3 пода, и `maxUnavailable` = 1, то Kubernetes удалит один под и сразу же начнет запуск нового.
    - **`maxSurge`** — максимальное количество дополнительных подов, которые могут быть запущены поверх нужного числа реплик во время обновления. Тоже может быть числом или процентом. Например, если `maxSurge` = 1, Kubernetes может создать один новый под, пока старый еще работает, а затем удалить старый под.

Для Recreate 
```yaml
strategy:
	type: Recreate
```

## Связь deployment и абстракций ниже
Для это нужно использовать [[Kubernetes Labels]] у абстракций ниже и использовать в самом deployment [[Kubernetes Selector]].

# Выводы
---
Deployment отличная абстракция которая дополняет replicaSet тем что может автоматических производить обновление подов, как по мне в большенстве случаев лучше использовать Deployment так как это тот же replicaset только лучше но да скорее всего потребляет он ресурсов чутка большое из за доп функционала 
