---
tags:
  - ansible
  - comands
  - "#config_systems"
data created: 2024-09-14
---
# Задание
----
+- Записать важные команды Ansible playbooks

# Пометки 
---
### Создание директории 
```yaml
- name: Create dir
  file:
	path: path/to/dir
	mode: 0700
	owner: root
	group: root
	state: driectory
```
Тоже самое что 
```bash
mkdir path/to/dir
chown root:root path/to/dir
chmod 700 path/to/dir
```
### Создание пользователя
```yaml
- name: Create user
  user:
	name: adminn
	group: adminn
```
Создали пользователя adminn который будет в группе adminn

## Просто playbook
```yaml
- name: Config web server
  hosts: webservers - Говорим взять группу webservers из файла ini
  become: True - Говорим использовать sudo
  tasks:
	- name: Install nginx
	  package:
	    name=nginx
	    update_cache=yes
	- name: Copy nginx config
	  copy:
	    src: /path/to/file
	    dest: /path/to/save/file
	- name: Enable config
	  file:
		dest=/etc/nginx/sites-enabled/default
		src=/etc/nginx/sites-available/default
		state=link		
```



# Выводы
---

