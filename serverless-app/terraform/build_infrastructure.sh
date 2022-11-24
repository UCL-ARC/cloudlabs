#!/bin/zsh

echo 'set necessary environment variables'
source ${../PWD}/setenv.sh

echo 'destroying existing infrastructure'
terraform destroy
rm output.json

echo 'terraform plan'
terraform plan 

echo 'terraform apply'
terraform apply 
terraform output -json > output.json 
