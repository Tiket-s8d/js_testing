---
tags:
  - "#kubernetes"
  - "#devops"
  - workload
  - абстракции
data created: 0204-10-11
---
# Задание
----
Что такое Replicaset, для чего и как его использовать

# Пометки 
---
ReplicaSet это абстракция над подами которая запускает нужное количество подов и поддерживает их.

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
	name: my-rep
spec:
	replicas:3 
	selector:
		matchLables:
			apps: my-app
	template:
	metadata:
		labels:
			apps: my-app
	spec:
		containers:
		- name: my-container
		  image: nginx:1.21
		  ports:
		  - containerPort: 80
		  - containerPort: 443
```

## Ресурсы подов
Так же можно установить то сколько CPU и RAM нужно для пода
```yaml
spec:
	containers:
	- name: my-container
	  image: nginx:1.21
	  ports:
	  - containerPort: 80
	  - containerPort: 443
	  resources:
		  requests:
			  cpu: "2"
			  memory: "4Gi"
```
Мы добавили то что для нашего пода нужные будут фиксированные ресурсы в виде CPU и RAM, и посути мы запрашиваем у kubernetes чтобы он выбрал ноду которая может предоставить 2 CPU и 4 гига RAM

# Выводы
---
ReplicaSet классная абстракция которую можно использовать для запуска простых подов которые редко обновляются и просто нужно их как то запустить
