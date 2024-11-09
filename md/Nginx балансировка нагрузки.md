---
tags:
  - nginx
  - "#upstream"
  - "#loadbalancer"
Time: 2024-07-13
complete: false
---
# Задание
----
Как балансировать нагрузку между разными инстансами приложений.

# Пометки 
---
Для этого есть поддиректория upstream в которой можно прописать куда обращаться при какой нагрузке.
#### Дефолтная балансировка

```nginx
stream{
	upstream mysql_read { 
		server read1.example.com:3306; 
		server read2.example.com:3306; 
		server 10.10.12.34:3306; 
	} 
	server { 
		listen 3306; 
		proxy_pass mysql_read; 
	}
}
```
Тут работает так что NGINX слушает порт 3306 и после передает запросы на сервера которые прописаны в группе **mysql_read** равномерно с одинаковым приоритетом (по алгоритму round-robin) 

#### Least connected load balancing
Есть балансировка нагрузки при проверке нагрузки 
```nginx
upstream myapp1 {
        least_conn;
        server srv1.example.com;
        server srv2.example.com;
        server srv3.example.com;
    }
```
В данном случае происходит проверка какая нагрузка на сервис и если на первый в списке слишком большая нагрузка то перенаправляется на второй сервер.

#### ip-hash
Главное отличие это то что сессия привязывается к ip то есть при других вариантах есть шанс что запросы от одного пользователя могу перинаправиться на другой сервис при ip-hash запросы привязываются от ip к определенному сервису 
```nginx
upstream myapp1 {
    ip_hash;
    server srv1.example.com;
    server srv2.example.com;
    server srv3.example.com;
}
```


#### Взвешенная балансировка 
В данном случае на сервисы будут выставленны е веса и в зависимости от веса будут перенаправляться запросы.
```nginx
upstream myapp1 {
        server srv1.example.com weight=3;
        server srv2.example.com;
        server srv3.example.com;
    }
```
данный вариант можно использовать и с ip-hash и с least_conn. 


# Выводы
---

