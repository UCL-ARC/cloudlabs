# How to get started with Amazon Web Services

This page and folder provides some additional material on how to set up cloud applications at UCL using the (https://www.ucl.ac.uk/isd/support-staff/cloud/public-cloud) services.

# First: Get an account with AWS

UCL can create an account for you at AWS. See the link above for more details.
On top, you can create a ticket for creating an account with Remedyforce.

What you need is: 
- cost centre against which the costs for running AWS services can be charged. 
- purpose for the cloud service
- who should have access and who should manage the service in AWS

NOTE: IT department will NOT create the infrastructure for you. Rather, they will create an AWS account for you, which you can then use to build the infrastructure acc to your requirements.

## How much does it cost? 

AWS provides a [cost estimator](https://calculator.aws/#/). Unfortunately, this can be quite involved and difficult to execute, particularly if you are new to development in AWS. 
This folder has a [document](./AWS%20Cost%20Estimation.docx) that provides estimates for a basic application.

NOTE: Generally, all cloud services cost their products based on usage. For research applications, that is typically lower than for commercial applications. It is also time limited. On top of that, bear in mind that UCL can also provide a discount for the costs.

## What is Terraform? 

[terraform](https://www.terraform.io) is a framework that allows you to script and describe your infrastructure in code. There are other frameworks as well, notably [ansible](https://www.ansible.com).

UCL is supporting Terraform and this repository provides examples using terraform scripts only.
Go to the Terraform web-site to get up to speed with it and how to install it.

## What else do I need?

### AWS CLI

Frameworks like Terraform interact with AWS (or Azure and others) directly from the command line or script. Re AWS they will rely on the AWS command line interface (CLI), which you can download for free. See [https://aws.amazon.com/cli/] for more details. 

### Authorising AWS-CLI and Terraform

At this point you will need to go to the AWS Console and use the IAM (Identity and Access Management tool). Here you will need to create 
- a user with a specified role
- for each user create an **access key**. 

AWS will create the **access key** which consists of two parts: the access and the secret key.
NOTE: It is useful to download access/secret key pair as CSV file to your computer. Once you created the pair, AWS console will **NOT** enable you to see the two keys again - it only shows the access key. The **only** way, in case you lost the secret key, is to disable the active and create a new access/secret key pair.






