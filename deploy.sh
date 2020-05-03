#! /bin/sh
cd quizmaster 
git pull origin master 
docker-compose build quizmaster 
docker-compose up -d --force-recreate quizmaster
