from fabric import task


@task
def go(c):
    c.run('echo hallo', replace_env=False)

@task
def 


