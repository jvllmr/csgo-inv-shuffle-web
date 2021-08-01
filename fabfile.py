from fabric import task
import os


@task
def setupdev(c):
    c.sudo('apt install npm -y', replace_env=False)
    with c.cd('./react'):
        c.run('echo Installing reactjs dependencies...', replace_env=False)
        c.run('npm i .', replace_env=False)
        c.run('npm audit fix', replace_env=False)
    with c.cd('./bootstrap'):
        c.run('echo Installing bootstrap dependencies...', replace_env=False)
        c.run('npm i .', replace_env=False)
        c.run('npm audit fix', replace_env=False)


@task
def run(c):
    pass

@task
def build(c):
    pass

@task
def compile_bootstrap(c):
    with c.cd('./react/public/bootstrap'):
        for file in os.listdir('./react/public/bootstrap/'):
            c.run(f'rm {file}')

    with c.cd('./bootstrap'):
        c.run('npm run css', replace_env=False)
    

@task
def compile_react(c):
    compile_bootstrap(c)
    with c.cd('./react'):
        c.run('npm run build')

@task
def react(c):
    with c.cd('./react'):
        c.run('npm start')

@task 
def test(c):
    pass




