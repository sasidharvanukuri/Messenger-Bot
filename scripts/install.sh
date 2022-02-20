#!/bin/bash

apt-get -y install nodejs

rm -rf /etc/systemd/system/messenger_bot.service

cat >> /etc/systemd/system/messenger_bot.service <<EOT
[Unit]
Description=Messenger Bot
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
ExecStart=/home/ubuntu/Messenger-Bot/scripts/run.sh
RemainAfterExit=no
Restart=on-failure
RestartSec=5s
User=root
Group=www-data
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=messenger_bot_server


[Install]
WantedBy=multi-user.target
EOT

systemctl daemon-reload
systemctl reload nginx
systemctl enable messenger_bot.service
systemctl start messenger_bot.service