#!/bin/bash


cd /home/ubuntu/Messenger-Bot
git stash
git pull origin master
npm i --unsafe-perm
DEBUG=messenger-bot:* node bin/www