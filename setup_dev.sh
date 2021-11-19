sudo pacman -S uwsgi python python-pip fabric npm nodejs python-venv
python -m venv .venv
. .venv/bin/activate
poetry config virtualenvs.create true
poetry config virtualenvs.in-project true
poetry install
fab setup_dev
deactivate
