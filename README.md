# csgo-inv-shuffle-web

If you are using Arch with the chaotic AUR you can use the setup_dev.sh script.

Else you can do the following:

Install Python 3.10, Python 3.10 venv, Redis, nodejs 14 and yarn.

Create a virtual environment named `.venv` in the root directory with Python 3.10.

Use the virtual env.

Install poetry via `pip install poetry`.

Configure poetry with:

```
poetry config virtualenvs.create true
poetry config virtualenvs.in-project true
```

Install the dependences: `poetry install`

Install pre-commit hooks: `pre-commit install`

Install JavaScript dependencies with `yarn` in the react subfolder.
