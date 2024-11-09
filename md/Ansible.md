---
tags:
  - ansible
  - config_systems
data created: 2024-09-14
---

# Заметки
---
Ansible - поддерживает push вы самостоятельно приписывает конфиг и сами должны его вызвать в отличии от [[Puppet]] и [[Cheef]] у которых есть агенты и они сам обновляют состояние после изменения конфига. 

У python есть библиотека ansible_runner которой можно автоматически вызывать playbooks


Ansible может просто вызывать и выводить одну команду 
```bash
ansible testserver -a "ls /home/adminn"
```
флаг -a говорит про то что нужно вызвать данную команду
флаг -b говорит про то что нужно вызвать данную команду с правами root (sudo)
так же можно вызвать любой модуль так же 
```bash
ansible testserver -a -m package -a name=nginx
```
То есть мы говорим использовать модуль package с параметром name=nginx для того чтобы поставить nginx

С помощью ansible-inventory можно вывести граф того какие хосты к какой группе принадлежат
```bash
ansible-inventory --graph
```



```bash
ansible all -m command -a "uname -a"
```

Здесь:

- `all` — группа хостов, на которых выполняется команда.
- `-m command` — модуль, который вы используете (в данном случае модуль `command`).
- `-a "uname -a"` — аргументы, передаваемые модулю (в данном случае команда `uname -a`).

### **Управление пакетами**

Модуль `package` позволяет устанавливать, обновлять или удалять пакеты на удалённых серверах:

```bash
ansible all -m package -a "name=htop state=present"
```

Этот пример установит `htop` на всех серверах. Можно также использовать более специализированные модули для управления пакетами, такие как `apt` (для Debian/Ubuntu) или `yum` (для CentOS/RHEL).

###  **Копирование файлов**

Модуль `copy` позволяет копировать файлы на удалённые машины:

```bash
ansible all -m copy -a "src=/local/path/to/file dest=/remote/path/to/file"
```

###  **Изменение прав доступа и владельцев файлов**

Модуль `file` может использоваться для изменения разрешений, владельцев или создания/удаления файлов и директорий:

```bash
ansible all -m file -a "path=/remote/path/to/file mode=0755 owner=root group=root"
```

###  **Перезапуск и управление сервисами**

Модуль `service` позволяет управлять состоянием сервисов:

```bash
ansible all -m service -a "name=nginx state=restarted"
```

###  **Запуск команд с правами root (sudo)**

Вы можете выполнять команды с повышенными привилегиями, добавив флаг `--become`:

```bash
ansible all -m command -a "apt update" --become
```

###  **Запрос фактов о системе**

Вы можете собирать информацию о системе с помощью модуля `setup`, который возвращает факты об удалённых хостах:

```bash
ansible all -m setup
```

###  **Создание и управление пользователями**

С помощью модуля `user` можно создавать и удалять пользователей, управлять их группами:

```bash
ansible all -m user -a "name=john state=present"
```

### **Запуск модулей на отдельных хостах или группах хостов**

Вместо всех хостов, указанных в `inventory`, вы можете запустить команду на конкретном сервере или группе:

```bash
ansible webservers -m command -a "uptime"
```

Здесь `webservers` — это группа хостов, определённая в инвентори-файле.

### **Выполнение команд с параметрами**

Вы можете передавать аргументы в команды, используя модули Ansible:

```bash
ansible all -m shell -a "echo Hello, Ansible!"
```

Модуль `shell` даёт больше гибкости по сравнению с модулем `command`, так как он может выполнять более сложные команды оболочки.

### **Запуск произвольных сценариев**

Ansible позволяет выполнять пользовательские сценарии (например, скрипты на Bash или Python):

```bash
ansible all -m script -a "/path/to/local/script.sh"
```

### **Проверка доступности хостов**

Вы можете проверить доступность хостов с помощью модуля `ping`:

```bash 
ansible all -m ping
```