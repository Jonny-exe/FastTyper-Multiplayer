echo "## Install base"
yarn install

echo "## Install back"
cd back
yarn install

echo "## Install front"
cd ../front
yarn install
