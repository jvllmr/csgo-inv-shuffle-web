from fabric import task
import os


@task
def setupdev(c):
    c.sudo("pacman -S npm", replace_env=False)
    with c.cd("./react"):
        c.run("echo Installing reactjs dependencies...", replace_env=False)
        c.run("npm i .", replace_env=False)
        c.run("npm audit fix", replace_env=False)


@task
def run(c):
    pass


@task
def build(c):
    pass


@task
def compile_react(c):
    compile_bootstrap(c)
    with c.cd("./react"):
        c.run("npm run build")


@task
def react(c):
    with c.cd("./react"):
        c.run("npm start", replace_env=False)


@task
def test(c):
    pass
