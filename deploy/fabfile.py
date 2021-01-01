from fabric.context_managers import cd, settings, shell_env
from fabric.decorators import task
from fabric.operations import sudo, run
from fabric.state import env


@task
def production():
    env.hosts = ['18.237.137.70']
    env.sudo_user = 'root'
    env.web_user = 'web'


@task
def onetime_setup_root():
    env.user = 'root'
    run('apt-get update')
    run('apt-get install npm nodejs-legacy')
    run('pip install --upgrade pip')
    run('pip install supervisor==3.3.3')
    run('echo_supervisord_conf > /etc/supervisord.conf')
    run(r"printf '[include]\nfiles = /home/web/www/cloudworks/deploy/*.conf\n' >> /etc/supervisord.conf")
    run("grep '^web.*NOPASSWD: /usr/local/bin/supervisorctl' /etc/sudoers.d/sudo_commands "
        "|| echo 'web     ALL = (ALL) NOPASSWD: /usr/local/bin/supervisorctl*' >> /etc/sudoers.d/sudo_commands")
    run("supervisord -c /etc/supervisord.conf"
        "|| echo 'restarting supervisorctl' && kill $(ps x | grep [/]usr/local/bin/supervisord | cut -f1 -d' ')"
        "&& supervisord -c /etc/supervisord.conf")


@task
def deploy():
    with settings(sudo_user=env.web_user):
        with shell_env(HOME='/home/{}/'.format(env.web_user)):
            code_branch = getattr(env, 'code_branch', 'master')
            with cd('/home/web/www/cloudworks/django_backend'):
                sudo('git fetch origin')
                sudo('git reset --hard origin/{}'.format(code_branch))
                sudo('python_env/bin/pip install -r requirements/prod-requirements.txt -r requirements/requirements.txt ')
                # sudo('python_env/bin/python manage.py collectstatic --no-input')
                sudo('python_env/bin/python manage.py migrate --no-input')
                # sudo('sudo ./bin/gunicorn_start')
                sudo('sudo supervisorctl restart all')

@task
def deploy_and_build():
    with settings(sudo_user=env.web_user):
        with shell_env(HOME='/home/{}/'.format(env.web_user)):
            code_branch = getattr(env, 'code_branch', 'master')
            with cd('/home/web/www/cloudworks/django_backend'):
                sudo('git fetch origin')
                sudo('git reset --hard origin/{}'.format(code_branch))
                sudo('python_env/bin/pip install -r requirements/prod-requirements.txt -r requirements/requirements.txt ')
                sudo('python_env/bin/python manage.py collectstatic --no-input')
                sudo('python_env/bin/python manage.py migrate --no-input')

            with cd('/home/web/www/cloudworks/ui'):
                sudo('npm install')
                sudo('node --max_old_space_size=8192 node_modules/@angular/cli/bin/ng build  --prod')
                sudo('sudo supervisorctl restart all')
