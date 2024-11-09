---
tags:
  - devops
  - workload
  - kubernetes
  - абстракции
data created: 2024-10-19
---
# Задание
----
Что такое CronJob и для чего его использовать

# Пометки 
---
CronJob это абстракция по верх job которое создает расписанию джобу 

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: hello
spec:
  schedule: "*/1 * * * *"
  concurrencyPolicy: Allow
  jobTemplate:
    spec:
      backoffLimit: 2
      activeDeadlineSeconds: 100
      template:
        spec:
          containers:
          - name: hello
            image: busybox
            args:
            - /bin/sh
            - -c
            - date; echo Hello from the Kubernetes cluster
          restartPolicy: Never
```
Здесь у нас есть параметры 
`schedule` в котором прописывается расписание как у cron [[Cron порядок записи]]
`concurrencyPolicy` — этот параметр отвечает за одновременное выполнение заданий. Бывает трёх видов: `Allow`, `Forbid`, `Replace`.
* `Allow` позволяет подам запускаться. Если за минуту Job не отработал, все равно будет создан ещё один. Одновременно могут выполняться несколько Job’ов.
* `Replace` заменяет запущенную нагрузку: старый Job убивается, запускается новый. На самом деле это не самый лучший вариант, когда прерываем то, что уже выполнялось, и начинаем ту же самую задачу выполнять заново. В каких-то случаях это возможно, в каких-то неприемлемо.
* `Forbid` запрещает запуск новых Job’ов, пока не отработает предыдущий. С этой политикой можно быть уверенным, что всегда запускается только один экземпляр задачи. Поэтому Forbid используют наиболее часто.


# Выводы
---

