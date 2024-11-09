---
tags:
  - "#kubernetes"
  - "#devops"
  - workload
  - абстракции
data created: 2024-10-13
---
# Задание
----
Что такое StatefulSets, для чего он используется 

# Пометки 
---
StatefulSet это абстракция на подобии deployment но различие в том как они работают со storage, то есть Deployment при перезапуске или обновлении пода у которого есть PV удалит PV вместе с подом, StatefulSet же даже при перезапуске пода сохранит PV за данным подом,
Тоесть при перезапуске поды если kuber решит поднять его на другой ноде то PV будет тоже перенесен на эту ноду и подключен к данному поду.
У StatefulSet для каждого пода задается статическое ДНС имя, тоесть у deployment для пода имя будет сгенерировано как test-app-sfgdfh;thkjkrtlhj а у statefylset будет test-app-0 и т.д.

и получается так что можно обратиться к поду по его ДНС имени, а не на сервис 
тоесть 
```
kafka-0.kafka.default.svc.cluster.local это $(statfeulset name)-$(original).$(service name).$(namespace).svc.cluster.local
```
и теперь можно обращаться по dns имени 
```bash
dig +short kafka-0.kafka.default.svc.cluster.local
```


ChatGPT пишет: В Kubernetes, **StatefulSet** — это тип контроллера, который управляет развертыванием и масштабированием наборов **подов**, при этом гарантируя уникальность и сохранность их сетевых идентификаторов и данных. StatefulSet предоставляет гарантии, которые важны для **состоящих приложений** (stateful applications), таких как базы данных, системы кэширования и другие приложения, требующие сохранения состояния между перезапускай.


## Как запускаются поды
Полмолчанию поды буду запускаться медленно последовательно, тоесть пока не запуститься под 0 неначнет запускаться под 1, но можно сделать так чтобы они запускались параллельно
```yaml
---
apiVeersion: app/v1
kund: StatefulSet
metadata:
	name: kafka
spec:
	selector:
		matchLabels:
			app: Kafka
	podManagementPolicy: Parallel
	serviceName: kafak
	replcas: 10
	template:
		metadata:
			labels:
				app: kafka
		spec:
			containers:
				- name: kafka
				  image: nginx:1.25.1
				  volumeMounts:
					  - name: data
					    mountPath: /data
	volumeClaimTemplates:
		- metadata:
			  name: data
		  spec:
			  accessModes:
				- "ReadWriteOnce"
			  resoureces:
				  requests:
					  storage: 10Gi
```

```yaml
	podManagementPolicy: Parallel
```
как раз таки отвечает за то чтобы параллельно запускать поды  
# Выводы
---



https://www.youtube.com/watch?v=30KAInyvY_o