---
tags:
  - "#ansible"
  - "#multy_settings"
data created: 2024-08-15
---
# Задание
----


# Пометки 
---
Для ansible playbook можно использовать несколько плейбуков через одну команду 
для это нужно создать файл yml в котором прописать
```yaml
---
- import_playbook: A-systemd-networkd.yml
- import_playbook: B-fail2ban-ssh.yml
- import_playbook: C-enable-watchdog.yml
```
и вызвать его как обычный плейбук


# Выводы
---

