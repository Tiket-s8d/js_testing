---
tags:
  - ansible
  - config_systems
data created: 2024-09-15
author: 
link:
---
# Задание
----
Разобраться с тем что есть в ini фале ansible, как использовать

# Пометки 
---
## Базовый ini файл
Для ansible нужен ini файл в котором приписанные устройства и группы на которых ansible должен что то сделать 
```
[webservers]
testserver ansible_port=2222 
[webservers:vars]
ansible_host=192.168.0.100
ansible_user=adminn
ansible_privet_key_file=/path/to/key.pem
```

## Какие есть параметры у ansible inventory файла

| Имя переменных               | Значения поумолчанию | Описание                                         |
| ---------------------------- | -------------------- | ------------------------------------------------ |
| ansible_host                 | имя хоста            | Hostname или IP для ssh подключения              |
| ansible_port                 | 22                   | Порт ssh                                         |
| ansible_user                 | root                 | Пользователь sudo                                |
| ansible_password             | (None)               | Пароль от sudo                                   |
| ansible_connection           | smart                | Способ выбора с помошью чего подключаться        |
| ansible_ssh_private_key_file | (None)               | Путь до ssh ключа по которому можно подключаться |
| ansible_shell_type           | sh                   | Какой shell использовать для команд              |
| ansible_python_interpreter   | /usr/bin/python      | Путь до интерпритатора python                    |
| ansible_*_interpreter        | (none)               | Как выше только для других языков                |
ansible_connection - метод по которому ansible выбирает как ему коннектиться, поумолчанию smart тоесть ansible проверит есть ли ssh клиент на устройстве если есть то будет использовать его, если нету то будет использовать python библиотеку Paramiko

ansible_shell_type - С каким терминало будет работать ansible, по умолчанию это sh но так же поддерживает csh, fish и windows powershell.

# Группы и подгруппы
В ansible ini файле обязательно использовать группы которые разграничивают суть данных хостов ктото для backend кто то для frontend, кто то для БД и т.д.
Но так же есть дочерние группы 
```
[django:children]
web
task
```
В данном примере мы говорим про то что у группы djanog есть зависимости от web и task, с помощью дочерниих группы можно передавать переменных 
```
[webservers]
web1.example.com
web2.example.com
[webservers:vars]
ansible_user=admin
ansible_port=22 
[production:children]
webservers
```
Но самое главное это то что можно этими группами управлять тоесть сделать группы webservers и databse после чего собрать их в production и testing группы и управлять уже группами production И testing

```
[webservers] 
web1.example.com 
web2.example.com 

[databases] 
db1.example.com 
db2.example.com 

[testing:children] 
webservers 
databases

[production:children] 
webservers 
databases
```


## Генерация имен хостов
Для того чтобы задавать именя хостов можно делать как на linux 
```
[web]
web[01:20].test.com

[web1]
web1[a-t].test.com
```

## Кастомные переменных в ini
В ini файле можно задать кастомные переменные и потом их вызывать в playbook
```
[web]
test.com ansible_user=adminn ansible_password=123 ansible_port=2215 http_port=80 
```
В данном примере мы создали кастомную переменную http_port которую например можно потом вызвать в playbook
```yaml
- hosts: webservers
  tasks:
    - name: Установить Nginx
      apt:
        name: nginx
        state: present
    - name: Настроить конфигурацию Nginx
      template:
        src: /templates/nginx.conf.j2
        dest: /etc/nginx/nginx.conf
      vars:
        http_port: "{{ http_port }}"
    - name: Запустить Nginx
      service:
        name: nginx
        state: started
```

## Разбиение переменных на разные файлы 
Пока ansible ini файл маленький можно и просто все переменные писать вместе с хостами в одном ini файл, но потом это станет просто не читабельно, поэтому стоить разбить это на файла, есть два варианта
### 1 плохо читабельный
Создать обычный yaml файл в котором расписать все так:
```
---
db_primary_host: frankfurt.example.com
db_primary_port: 5432
db_replica_host: london.example.com
db_name: widget_production
db_user: widgetuser
db_password: 'pFmMxcyD;Fc6)6'
rabbitmq_host: johannesburg.example.com
rabbitmq_port: 5672
```
и потом вызывать как 
```
{{ db_primary_host }}
```
Как по мне данный вариант плохо читабелен 

### 2 хороший вариант 
Так же создать yaml файл но в нем уже все разбить на YAML dictionaries
```yaml
---
db:
	user: widgetuser
	password: 'pFmMxcyD;Fc6)6'
	name: widget_production
	primary:
		host: frankfurt.example.com
		port: 5432
	replica:
		host: london.example.com
		port: 5432
rabbitmq:
	host: johannesburg.example.com
	port: 5672
```
и вызывать их как 
```
{{ db.primary.host }}
```
Что как по мне более понятно и логично
# Выводы
---

