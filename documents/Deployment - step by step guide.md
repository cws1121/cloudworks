# 1 Introduction

This first part of the guide explains how to initialize a Cloudworks webapp. All the steps included in the *section 2* should be performed only once (during the project setup) and it will not be required to perform them for ongoing maintenance and deployments.

The second part of the guide (*section 3*) contains all commands that should be executed for deploying updates (in the maintenance phase).

A clean Ubuntu 20.04 distribution is assumed with nothing installed on it, except for packages that usually come as preinstalled (python, git..)

Python 3.8.10 is a preinstalled version that comes with Amazon's Ubuntu distribution - Ubuntu Server 20.04 LTS (HVM).

Building an angular app takes a lot of resources and that’s why the server needs to have min 4GB of memory (including swap). Alternatively the app can be built on a separate machine and then just copy-pasted to cw_core/static folder, however this approach will not be discussed here.

Here is a quick tutorial on [how to allocate swap on ubuntu 20.04](https://linuxize.com/post/how-to-add-swap-space-on-ubuntu-20-04/).

Certain commands might require the user's password (executing commands with sudo, switching users...), also some commands will require confirmation. The user should confirm and enter their password whenever prompted. These small steps are not included in the tutorial.


# 2 Deploying Cloudworks webapp


## 2.1 Adding a new user


```
sudo adduser web
```


Password and password confirmation needs to be provided when prompted. The system will ask for other information such as Full Name, Room number, Work phone, Home phone, Other. This phase can be skipped by hitting enter.


```
sudo usermod -aG sudo web
```


This command adds *web* user to the *Sudoers* group.


## 2.2 Installing required packages


```
sudo apt update
sudo apt-get update
```


Updates the package lists.


```
sudo apt install git
```


Git is likely already installed in the Ubuntu 20.04 server. This can be confirmed with the following command: *git --version*


```
sudo apt install nginx
```


Installs *nginx* webserver.


```
sudo apt-get install python3-pip python3-dev build-essential
sudo apt install virtualenv virtualenvwrapper
sudo apt install postgresql postgresql-contrib
sudo apt install libpq-dev
```


Installs package manager - pip and other python and postgres dev libraries.


## 2.3 Installing node 12.18.3 via nvm


```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```


*Close and reopen your terminal to start using nvm or run the following to use it now:*


```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```


Once the script is in your PATH, verify that nvm was properly installed by typing:


```
nvm --version
```


This command should return the version if the installation was successful.


```
nvm install 12.18.3
nvm use 12.18.3
```


Install node 12.18.3 and set it as a default.


## 2.4 Create a postgres user and a database


```
sudo -i -u postgres
createuser --interactive
```


Enter name of role to add: *webapp_user*

Shall the new role be a superuser? (y/n) *y*


```
createdb cloudworks
psql 
```


Opens interactive terminal to work with the PostgreSQL database. We need to create a password for the *webapp_user* by executing:


```
	ALTER USER webapp_user WITH PASSWORD 'new_password';
```


(where *new_password* should be replaced with some strong password)


```
\q
```


Exit the terminal.


## 2.5 Clone the repository and create a python environment


```
su web
```


Switch to the *web* user.


```
sudo mkdir /home/web/www
cd /home/web/www/
sudo git clone https://github.com/cws1121/cloudworks.git
sudo chown -R web /home/web/www/cloudworks/
```


Clone the repository and change it’s ownership.


```
sudo nano ~/.bashrc 
```


This line needs to be added to the end of the file: \
	*source '/usr/share/virtualenvwrapper/virtualenvwrapper.sh'*


```
source ~/.bashrc
```


Reload *bashrc* settings.


```
virtualenv /home/web/www/cloudworks/django_backend/python_env
```


Create a virtual environment.


```
cd /home/web/www/cloudworks/django_backend/
python_env/bin/pip install -r requirements/requirements.txt
```


Install basic requirements.


```
python_env/bin/pip install -r requirements/deploy-requirements.txt
```


Install deploy requirements.


```
python_env/bin/pip install -r requirements/prod-requirements.txt
```


Install production requirements.


## 2.6 Preparing cloudwork app to be built and served


```
cp local_settings_example.py local_settings.py
sudo nano local_settings.py
```


Update the *local_settings.py* file by adding the following:


```
SECRET_KEY = 'unique_strong_key'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'cloudworks',
        'USER': 'webapp_user',
        'PASSWORD': 'webapp_user_pass',
        'HOST': 'localhost',
        'PORT': '',
    }
}

DEBUG = False
```


Where *unique_strong_key* should be replaced with some long string, *webapp_user_pass* should be replaced with the password that was assigned to the *webapp_user* (section 2.4 of this tutorial).


```
python_env/bin/python manage.py collectstatic
python_env/bin/python manage.py migrate
```


Run the migrations and collect static files into one place so that they can be served easily.


```
sudo nano /home/web/www/cloudworks/django_backend/cw_core/settings.py
```


Server’s IP address needs to be appended to the list of allowed hosts.


```
sudo nano /home/web/www/cloudworks/ui/src/environments/environment.prod.ts
```


Update the angular environment like this:


```
export const environment = {
  production: true,
  base_url: 'http://server_ip_address'
};
```


Where *server_ip_address* should be replaced with the actual IP address of the server.


## 2.7 Build front-end scripts


```
cd /home/web/www/cloudworks/ui/
npm install
node --max_old_space_size=8192 node_modules/@angular/cli/bin/ng build  --prod --aot
```


This can take up to 5 minutes to complete.


## 2.8 Update nginx config file


```
sudo rm /etc/nginx/sites-enabled/default
sudo touch /etc/nginx/sites-available/cloudworks
sudo nano /etc/nginx/sites-available/cloudworks
```


Create and update *cloudworks* config file by adding this:


```
upstream cloudworks_server {
	server unix:/home/web/www/cloudworks/run/gunicorn.sock fail_timeout=0;
}

map $http_host $served_host {
    default $http_host;
    127.0.0.1 your_domain_name_or_ip;
}

server {
	listen 80;
	proxy_ignore_client_abort on;
	client_max_body_size 4G;
	index index.html index.htm index.nginx-debian.html;

	access_log /home/web/www/cloudworks/logs/nginx-access.log;
	error_log /home/web/www/cloudworks/logs/nginx-error.log info;

	server_name your_domain_name_or_ip;

	location /media/ {
		alias /home/web/www/cloudworks/django_backend/cw_core/media/;
	}

	location / {
		proxy_pass http://cloudworks_server;
		proxy_set_header Host $served_host;
	}
}
```


Where *your_domain_name_or_ip* should be replaced with the IP address of the server.


```
sudo ln -s /etc/nginx/sites-available/cloudworks /etc/nginx/sites-enabled/
sudo mkdir /home/web/www/cloudworks/logs
sudo nginx -t
```


The command tests the nginx config file and it should warn the user if something is not ok.


```
sudo systemctl restart nginx
```


Restart the webserver.


## 2.9 Installation and setup of the Supervisor package


```
pip install --upgrade pip
pip install supervisor==4.2.2
```


Installs supervisor package.


```
sudo -i
```


Switches to the root user.


```
apt install supervisor
```


Install Supervisor.


```
echo_supervisord_conf > /etc/supervisord.conf
printf '[include]\nfiles = /home/web/www/cloudworks/deploy/*.conf\n' >> /etc/supervisord.conf
grep '^web.*NOPASSWD: /usr/local/bin/supervisorctl' /etc/sudoers.d/sudo_commands  || echo 'web ALL = (ALL) NOPASSWD: /usr/local/bin/supervisorctl*' >> /etc/sudoers.d/sudo_commands
```


Create config file and allow *web* user to execute commands without password.


```
supervisord -c /etc/supervisord.conf || echo 'restarting supervisorctl' && kill $(ps x | grep [/]usr/local/bin/supervisord | cut -f1 -d' ') && supervisord -c /etc/supervisord.conf
```


Completes the supervisord setup.


## 2.10 Init Gunicorn 


```
su web
sudo touch /home/web/www/cloudworks/logs/gunicorn.log
sudo chmod 777 -R /home/web/www/cloudworks/logs/
sudo mkdir /home/web/www/cloudworks/run
sudo touch /home/web/www/cloudworks/run/gunicorn.sock
```


Create a new *logs* directory and *gunicorn.sock* file.


```
sudo supervisorctl restart all
```


Restart the app.


## 2.11 Seeding the DB


```
cd /home/web/www/cloudworks/django_backend/
python_env/bin/python manage.py bootstrap_workspace --generate_token
```


This command creates a workspace, *generate_token* flag is optional.The user will be asked to provide a name for the workspace (this step can be skipped by hitting enter).


```
python_env/bin/python manage.py bootstrap_user --is_superuser
```


Generates a new user. The system will ask for the user's *email address*, *password* and *workspace ID* (previous command returns workspace ID as output). *Email* and *password* are mandatory fields while *workspace ID* is optional (can be skipped by hitting enter).


## 2.12 Sign in to the admin console

*Email* and *password* of the user, generated in the previous step, can be used to sign in to the admin console. 

The URL of the admin console is: \
[http://your_domain_name_or_ip/admin/](http://your_domain_name_or_ip/admin/)


# 3 Deploying Updates


## 3.1 Deploy and build


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


## 3.2 Deploy backend updates only


This section explains how to deploy updates on the backend only (without re-building angular scripts). It takes significantly less time than the process explained in section 3.1.


```
cd /home/web/www/cloudworks/django_backend/
git fetch origin
git reset --hard origin/master
python_env/bin/pip install -r requirements/prod-requirements.txt -r requirements/requirements.txt
python_env/bin/python manage.py collectstatic --no-input
python_env/bin/python manage.py migrate --no-input
sudo supervisorctl restart all
```
