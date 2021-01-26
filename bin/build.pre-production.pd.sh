#!/bin/bash

set -e

docker build . -t build.pre-production.pd-image
docker run --name build.pre-production.pd build.pre-production.pd-image
docker cp build.pre-production.pd:/home/pai-dan-system/pai-dan-system.zip .

docker rm build.pre-production.pd
docker rmi build.pre-production.pd-image
