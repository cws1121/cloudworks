# cloudworks

Web dashbord for [RDToolkit](https://github.com/dimagi/rd-toolkit/tree/master/app/src/main/java/org/rdtoolkit/) app.
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
./manage.py runserver
```


# Front End

The front end files are managed with [django-bower](https://github.com/nvbn/django-bower).
See the project's docs for more information on how to configure and change front-end files.


## Angular

The project uses Angular 10.
Documentation for Angular 10 [lives here](https://angular.io/docs).


# Production Environment

## Deploying

Anyone with access to the should be able to deploy.

To deploy you need to `pip install -r requirements/deploy-requirements.txt` and then run the following:

```
cd deploy/
fab -u web production deploy
```
