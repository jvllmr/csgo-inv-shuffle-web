sudo pacman -S uwsgi python python-pip fabric npm nodejs python-poetry
poetry config virtualenvs.create true
poetry config virtualenvs.in-project true
poetry install
fab setup_dev