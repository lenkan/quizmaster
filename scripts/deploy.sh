#!/bin/bash

if [ -z "$1" ]; then
        echo "Usage $0 [user@]hostname";
        exit 1;
fi;

HOST=$1
DEPLOYMENT_NAME=deployment_$(date --utc +%s)
DEPLOYMENT_DIR=/opt/quizmaster/$DEPLOYMENT_NAME


tar -czf - www tools src migrations package.json package-lock.json | ssh $HOST "mkdir -p $DEPLOYMENT_DIR; tar -xzf - --directory $DEPLOYMENT_DIR"
ssh $HOST "cd $DEPLOYMENT_DIR && npm ci --production"
ssh $HOST "rm /opt/quizmaster/current && ln -s $DEPLOYMENT_DIR /opt/quizmaster/current"
ssh -t $HOST "sudo systemctl restart quizmaster"
