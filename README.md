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
