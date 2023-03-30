#!/bin/zsh

terraform output | tr -d ' ' > terraform.env
cp terraform.env ../frontend/.env
rm terraform.env

