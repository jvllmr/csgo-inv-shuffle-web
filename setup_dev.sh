sudo pacman -S uwsgi python python-pip fabric yarn nodejs python-venv redis
python -m venv .venv
. .venv/bin/activate
pip install poetry
poetry config virtualenvs.create true
poetry config virtualenvs.in-project true
poetry install
cd react
npm i .
npm audit fix
cd ..
deactivate
#curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
#echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
#sudo apt-get update && sudo apt-get install yarn