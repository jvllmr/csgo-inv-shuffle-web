sudo pacman -S uwsgi python python-pip fabric yarn nodejs python-venv redis
python -m venv .venv
. .venv/bin/activate
pip install poetry
poetry config virtualenvs.create true
poetry config virtualenvs.in-project true
poetry install
pre-commit install
cd react
yarn
cd ..
deactivate
