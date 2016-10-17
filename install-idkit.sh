#!/bin/bash

echo "Installing dependencies of idkit-2.72"
sudo apt-get update && sudo DEBIAN_FRONTEND=noninteractive apt-get install -q -y libusb-0.1-4 libtbb2 libopencv-dev wget

echo "Installing idkit-2.72"
wget -qO- https://github.com/DFTinc/onyx-node-rest/releases/download/2.72/idkit_2.72ubuntu1_amd64.deb > /tmp/idkit_2.72ubuntu1_amd64.deb

sudo dpkg -i /tmp/idkit_2.72ubuntu1_amd64.deb

rm /tmp/idkit_2.72ubuntu1_amd64.deb

echo "Please send the following Hardware ID to team@diamondfortress.com:"
/usr/local/bin/linux_license_manager -I

