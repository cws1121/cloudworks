# CLOUDWORKS


Web dashboard for [RDToolkit](https://github.com/dimagi/rd-toolkit/tree/master/app/src/main/java/org/rdtoolkit/) app.
Written in Python using the Django web framework.


# Setup instructions


## Clone the repo

```
git clone https://github.com/nemanja1040/cloudworks
```

## Setup virtualenv, requirements, front-end files

```
mkvirtualenv cw
cd cloudworks/django_backend
pip install -r requirements/requirements.txt
./manage.py collectstatic
./manage.py migrate
```

## Setup localsettings

```
cp local_settings_example.py local_settings.py
```

Override any values you need.

## install node modules & build ui scripts

```
cd cloudworks/ui
npm install
sudo node node_modules/@angular/cli/bin/ng build 
```

## Run

```
cd cloudworks/django_backend
./manage.py runserver
```


# Front End


## Angular

The project uses Angular 10.
Documentation for Angular 10 [lives here](https://angular.io/docs).


# Production Environment

This section contains instruction on how to deploy and run Cloudworks in Gunicorn as a generic WSGI application.
The instructions are tested on Ubuntu 18.04 and Ubuntu 21.04. Most likely these same instructions can be applied to older Ubuntu versions as well.
Before running these command you need to update fabric env variables accordingly. The variables are located here `deploy/fabfile.py`.

## One-time setup

To install Gunicorn and a few other important packages you need to run `pip install -r requirements/prod-requirements.txt`.
Finish the setup by running the following command:

```
cd deploy/
fab -u web production onetime_setup_root
```

## Deploying

Anyone with access to the server should be able to deploy.

To deploy you need to `pip install -r requirements/deploy-requirements.txt` and then run the following:

```
cd deploy/
fab -u web production deploy
```

or if your wish to deploy your code and build frontend scripts you can run this command:

```
cd deploy/
fab -u web production deploy_and_build
```

NOTE: These commands are being executed with `-u web` flag which means that the person trying to execute these commands should have access to `web` user on the server.
