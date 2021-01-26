#!/bin/bash

set -e

ansible-playbook ansible/deploy.yml -e host=pre-production.pd -e env=alpha
