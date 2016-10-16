# Server Setup (Ubuntu 14.04 LTS)

##Install Node.js
Node.js v4.6.0 LTS is the currently supported.

Below shows how to install Node.js via NodeSource:
```
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
```

##Install IDKit 2.72
```
curl https://raw.githubusercontent.com/DFTinc/onyx-node-rest/master/install-idkit.sh | sh
```

##Install iengine.lic
Once you recieve your `iengine.lic` from DFT, deploy it with the following command:
```
sudo /usr/local/bin/linux_license_manager -d ~/path/to/iengine.lic 2
```

##Checkout the server code
```
mkdir -p ~/www
cd ~/www

git clone https://github.com/DFTinc/onyx-node-rest.git

cd onyx-node-rest
npm install

# This is currently necessary until onyx-node is upgraded to 4.1.6 on NPM.
cd node_modules
wget -O onyx-node.zip https://github.com/DFTinc/onyx-node-rest/releases/download/4.1.6/onyx-node.zip
unzip onyx-node.zip
rm onyx-node.zip
```

##Start the server
```
npm start
```

Once the server is running, please visit http://0.0.0.0:3000/explorer for
a detailed look at the REST API endpoints served.

## Install Strongloop (optional)
This server is written utilizing the [Loopback.io](https://loopback.io/) framework.

Install with the following:
```
npm install -g strongloop
```

Now you add additional remote methods with the following call:
```
cd ~/www/onyx-node-rest
slc loopback:remote-method
```

Follow along with the prompts to create a new endpoint.
