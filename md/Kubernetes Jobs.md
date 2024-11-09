---
tags:
  - devops
  - workload
  - kubernetes
  - "#🟡"
  - абстракции
data created: 2024-10-19
---
# Задание
----
Что такое job? и как их исопользовать

# Пометки 
---
Jobs - это под которые запускается по какомуто тригеру выполняется прописанные в нем команды после чего если все прошло корректно то удаляется.
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  template:
    spec:
      containers:
      - name: pi
        image: perl
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```
Job с сайта kubernetes , здесь запускаеьться под считает число пи до 2000 знака после чего прекращает работать и занимать место в kubernetes.

## restart policy 
Job должен содержать RestartPolicy, которое может быть Never или OnFailure.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: job-with-restartpolicy-onfailure
spec:
  backoffLimit: 3
  template:
    spec:
      containers:
      - name: job-with-failure
        image: busybox
        command: ["/bin/sh", "-c"]
        args: ["echo 'Running Job'; sleep 5; exit 1"]
      restartPolicy: OnFailure
```
В данном примере под всегда заканчивает свою работу с ошибкой, из за чего kubelet перезапустит данный под, если после 3 перезапусков пода все так же ошибка то job прекратит свою работу и job будет со статусом Failed но при этом подов не останется.
```yaml
  backoffLimit: 3
```
Отвечает за то сколько раз перезапустить под
```yaml
      restartPolicy: OnFailure
```
что делать если под выдает ошибку
если же поставить вместо `OnFailure` `Never` то поды не будут удаляться, они будут создаваться новые пока либо под не сработает без ошибки либо не будет достигнут `backoffLimit`, после чего все поды будут удалены а Job будет со статусом Failed

## Многоразовый запуск
Так же можно сделать так чтобы Job выполнилась n раз если
```yaml
---
apiVersion: batch/v1
kind: Job
metadata:
	name: testing-job
spec:
	backoffLimit: 3
	completions: 3
	template:
		spec:
			containers:
			- name: pi
			  image: perl
	          command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
		    restartPolicy: Never
```
В данном примере мы установили `completions` на 3 это значит что наша job последовательно запустить под который мы описали 3 раза, каждый под после того как корректно отработает предыдущий под.

## Параллельный запуск подов
Также можно сказать чтобы kubelet запускал поды у нашей Job параллельно,
```yaml
---
apiVersion: batch/v1
kind: Job
metdata:
	name: testing-parallelism
spec:
	backoffLimit: 3
	parallelism: 2
	template:
	    spec:
	      containers:
	      - name: pi
	        image: perl
	        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
	      restartPolicy: OnFailure
```
То есть мы говорим запускай по 2 пода одновременно благодаря `parallelism`

### Так же можно комбинировать `paralellism` и `completions`

## Ограничение по времени работы job
Можно прописать сколько времени должно занять для того чтобы job завершил совю работу и тут именно речь идет но про то сколько pod отработает времение а сколько вообще должна отработать джоба 
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: job-with-failure
spec:
  backoffLimit: 4
  activeDeadlineSeconds: 50
  template:
    spec:
      containers:
      - name: job-with-failure
        image: busybox
        command: ["/bin/sh", "-c"]
        args: ["echo 'Running Job'; sleep 5; exit 1"]
      restartPolicy: Never
```
Тоесть в данном примере мы установили параметр `activeDeadlineSeconds` на 50 и это значит что если Job не успеет завершить свою работу после 50 секунд то сама Job будет висеть в состоянии `Failed`



# Выводы

---
⏲19.10.2024 На данный момент думаю это то что нужно сначала переварить так как у job есть еще куча параметров 
