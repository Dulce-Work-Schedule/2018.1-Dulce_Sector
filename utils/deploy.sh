#!/bin/bash

echo Deploying ...

cd $TRAVIS_BUILD_DIR/Environments/Production
sudo docker-compose -f build.yml build
sudo docker login --username=$DOCKERHUB_USER --password=$DOCKERHUB_PASSWORD
sudo docker push dulce/sector-client:prod
sudo docker push dulce/sector-server:prod
sudo docker run cdrx/rancher-gitlab-deploy upgrade --rancher-url $RANCHER_URL --rancher-key $RANCHER_ACCESS_KEY --rancher-secret $RANCHER_SECRET_KEY --environment Production --stack Sector --service sectorclient --finish-upgrade
sudo docker run cdrx/rancher-gitlab-deploy upgrade --rancher-url $RANCHER_URL --rancher-key $RANCHER_ACCESS_KEY --rancher-secret $RANCHER_SECRET_KEY --environment Production --stack Sector --service sectorserver --finish-upgrade 
