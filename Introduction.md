# Introduction 
Before you can build applications on AWS at UCL there is a bit of preparation involved.
I have listed that in a step by step guide below.

# Step One: Get A AWS Account
UCL has an agreement with Amazon, including discounts on AWS services. 
In order to benefit from that, you will need to request a UCL AWS account from ISD. (see link above).

You will need to provide
- what it is you are trying to build
- the cost centre against which the cloud costs can be charged
- who (i.e. which UCL staff members) will need to access the account
- for how long will you need the account

https://www.ucl.ac.uk/isd/support-staff/cloud/public-cloud has more help and guidance of getting a UCL/AWS account (or Azure for that matter).

## What are the costs?
AWS has a [cost calculator](https://calculator.aws/#/) but this can be a bit daunting. The price for cloud services rely on a number of factors like the amount of expected network traffic, required computing resources (and what type), amount of storage and many more. 
I have done an example calculation [here](./getting-started-aws/AWS_Cost_Estimation.docx).

# Step Two: Access your AWS account and set up Users and Credentials

## AWS Access
If your UCL-AWS account is set up, you can access it via
 https://ucl-cloud.awsapps.com/start#/ 

Single sign-on should work from a UCL computer. If not, you can use your UCL email address/password to log in.

## Create a User/Credentials
There is a good introduction on this page https://spacelift.io/blog/terraform-aws-provider 

Summary:
- Go to your AWS account and select 'IAM' service (stands for 'Identity and Access Management')
- In Access Management select 'Users' and then hit the 'Add users' button on the right
- choose a User name. In the 'Select Credential Type' section select 'Access key - Programmatic access'
- set permissions: make sure that at least someone has 'AdministratorAccess' 
- the rest can be default

*** Note ***: You will be given an access key and secret key. It is RECOMMENDED to download the key pair as CSV file on your computer. You will need both keys later. AWS will NOT allow you to look at both keys again once you leave this setup page!

(If you lost your keys or forgot to save them you will need to create a new pair and deactivate the current ones)

# Step Three: AWS Command Line Interface
It's recommended to use the AWS command line interface (CLI) with Terraform.
For downloading AWS CLI and installation instructions go to
 https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html 


# Step Four: Configure AWS CLI on your Computer
Open a text/command terminal and type in the following command
```aws configure```
You will need to provide the AWS credentials, i.e. access key and secret key (see above).
Other parameters include
- region. Recommended ```eu-west-2``` (i.e. London)
- default output format: Recommended ```json```


# Step Five: Get Terraform
You can get it from https://developer.hashicorp.com/terraform/downloads?product_intent=terraform 
Download and usage is for free. But if in doubt: UCL has an enterprise licence with Terraform.

You will need to update your PATH variable on UNIX (Linux, Mac OSX etc) and the equivalent on Windows so you can type
```terraform```
from the command line.

*** Note *** Terraform comes as a single binary or executable. It is to be run from the command line. 






