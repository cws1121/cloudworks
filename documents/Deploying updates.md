# 1 Introduction


This guide explains how to deploy updates for Cloudworks webapp.


# 2 Deploying Updates


## 2.1 Deploy and build


if your wish to deploy updates and build frontend scripts you can run this command.


```
cd /home/web/www/cloudworks/ui/
npm install
node --max_old_space_size=8192 node_modules/@angular/cli/bin/ng build  --prod --aot
```



```
cd /home/web/www/cloudworks/django_backend/
git fetch origin
git reset --hard origin/master
python_env/bin/pip install -r requirements/prod-requirements.txt -r requirements/requirements.txt
python_env/bin/python manage.py collectstatic --no-input
python_env/bin/python manage.py migrate --no-input
sudo supervisorctl restart all
```


## 2.2 Deploy backend updates only


This section explains how to deploy updates on the backend only (without re-building angular scripts). It takes significantly less time than the process explained in the previous section.


```
cd /home/web/www/cloudworks/django_backend/
git fetch origin
git reset --hard origin/master
python_env/bin/pip install -r requirements/prod-requirements.txt -r requirements/requirements.txt
python_env/bin/python manage.py collectstatic --no-input
python_env/bin/python manage.py migrate --no-input
sudo supervisorctl restart all
```

