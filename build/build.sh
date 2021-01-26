#!/bin/bash -xe

# exit when any command failed
set -e
set -o pipefail

# declare
PHASE=$1
REGION="ap-northeast-2"
REPOSITORY_NAME="343270126633.dkr.ecr.ap-northeast-2.amazonaws.com/ljit/pd"

DOCKERFILE_DIR_PATH="$WORKSPACE/build"
GIT_TAG=`git describe --tags $(git rev-list --tags --max-count=1)`
GIT_HASH=`git rev-parse HEAD`
IMAGE_TAG="$PHASE-$GIT_TAG-$GIT_HASH"
IMAGE=$REPOSITORY_NAME:$IMAGE_TAG

if [ -z "$PHASE" ]; then
	echo "PHASE argument is required!"
	exit 1
fi

# cmd
AWS="aws --region $REGION"

# aws ecr authentication
$($AWS ecr get-login --no-include-email)

# build docker base image
docker build \
	--build-arg PHASE=$PHASE \
	-t $IMAGE \
	-f $DOCKERFILE_DIR_PATH/Dockerfile .

# push docker image
docker push $IMAGE

exit 0
