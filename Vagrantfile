# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "boxcutter/ubuntu1404"
  config.vm.box_version = "2.0.17"

  config.vm.network "forwarded_port", guest: 3000, host: 3000, auto_correct: true
  config.vm.synced_folder ".", "#{`pwd`.chomp}"

  config.vm.provider "virtualbox" do |vb|
    # Customize the amount of memory on the VM:
    vb.memory = "2048"
  end

  config.vm.provision "shell", privileged: false, inline: <<-SHELL
    # Install Node.js
    curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
    sudo apt-get install -y nodejs=4.6.0-1nodesource1~trusty1

    # Install IDKit
    curl https://raw.githubusercontent.com/DFTinc/onyx-node-rest/master/install-idkit.sh | sh

    sudo apt-get install -y git unzip

    # Checkout server
    mkdir -p ~/www
    cd ~/www

    git clone https://github.com/DFTinc/onyx-node-rest.git

    cd onyx-node-rest
    npm install

    # This is currently necessary until onyx-node is upgraded to 4.1.6 on NPM.
    cd node_modules
    wget -qO- https://github.com/DFTinc/onyx-node-rest/releases/download/4.1.6/onyx-node.zip > onyx-node.zip
    unzip onyx-node.zip
    rm onyx-node.zip
  SHELL
end
