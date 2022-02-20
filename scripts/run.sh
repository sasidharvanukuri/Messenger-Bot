#!/bin/bash


cd /home/ubuntu/Messenger-Bot
git stash
git pull origin master
npm i --unsafe-perm
npm start