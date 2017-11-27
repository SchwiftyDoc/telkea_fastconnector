# Fastconnector v1.0
FastConnector - Redis to Elasticsearch

This program is developped in NodeJS for the purpose to store informations
created by an Fastnetmon process to an Elasticsearch Server.

Author: Corentin Dekimpe
Company: Telkea

## Installation In CentOS7

Clone the Git on the /opt directory with the command:

_cd /opt_
_git clone https://github.com/SchwiftyDoc/telkea_fastconnector.git_

Create a service file in _/etc/systemd/system/fastconnector.service_ with the following content:

```
[Unit]
Description=FastConnector - Redis to Elasticsearch

[Service]
ExecStart=/usr/bin/node /opt/fastconnector/app.js
Restart=always
User=root
Group=root
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=/opt/fastconnector/

[Install]
WantedBy=multi-user.target
```

Then you have access to the program like any other service with the following commands:

_systemctl enable fastconnector_
_systemctl (re)start fastconnector_
_systemctl status fastconnector_
_systemctl stop fastconnector_
_journalctl -xeu fastconnector_


## Configuration file options :

### Iftop

All the configuration about the iftop process

* interface: Interface that Iftop will listen to.
* networks: Array of networks written with the common writing _x.x.x.x/y_.
* onlynetworks: Boolean if put on true only the data from the networks defined will be send to Elasticsearch.
* duration: _2, 10 or 40_ is the time iftop process will run before stopping and write the file.

### Data

All the configuration about the Data saved by Iftop process

* path: Set data path where to store the files created from iftop. Default is : /tmp/ifconnector.
* keep: Boolean set on true if you want to keep the data once sent, otherwise set on false.
* ext: File extension.

### Elasticsearch

All the configuraiton about the Elasticsearch server

* host: Hostname or Ip Address of the server.
* port: Port to communicate with the server. Default for Elasticsearch : 9200.
* index: Index of the Elasticsearch database to keep.
* type: Name of the Type to store in Elasticsearch.