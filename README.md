## Курсовой проект по дисциплине "Базы данных"
Создать базу данных и приложение для нее с целью генерации файлов планов по проведению кафедрой конференций, олимпиад, CTF соревнований, WorldSkills чемпионатов и пр. для генерации отчета о планируемой работе кафедры.
### Настройка Apache
```xml
<VirtualHost *:80>
    ServerName domain.ru
    ServerAlias www.domain.ru
    ErrorLog /home/domain.ru/logs/error_log
    CustomLog /home/domain.ru/logs/access_log combined
 
    ProxyRequests Off
    ProxyPreserveHost On
 
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```
Apache *httpd-vhosts.conf*