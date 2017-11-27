# Fastconnector v1.0
FastConnector - Redis to Elasticsearch

This program is developped in NodeJS for the purpose to store informations
created by an Fastnetmon process to an Elasticsearch Server.

Author: Corentin Dekimpe<br/>
Company: Telkea

## Installation on CentOS 7

Clone the Git repository in the /opt directory with the command:

```
cd /opt_
git clone https://github.com/SchwiftyDoc/telkea_fastconnector.git
cd telkea_fastconnector
cd npm install
```

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

```
systemctl enable fastconnector
systemctl (re)start fastconnector
systemctl status fastconnector
systemctl stop fastconnector
journalctl -xeu fastconnector
```

## Configuration file options :

### Fastnetmon

All the configuraiton about the Fastnetmon process

* networks: Array of networks being watch by fastnetmon. Data should be available on the server at _/etc/network_list_

### Redis

All the configuration about the Redis Server

* host: Hostname or Ip Address of the Redis Server.
* port: Port to communicate with the Redis Server. Default: 6379

### Elasticsearch

All the configuration about the connections to the Elasticsearch Server.

* host: Hostname or Ip Address to the Elasticsearch Server.
* port: Port to communicate with the Elasticsearch Server. Default: 9200.
* index: Choose the Index where to save your data.
* type: Type of the data saved.