# AWS Serverless Web Example Application

## NOTE May 2023
There has been a change to the account settings. Creating S3 buckets as described in the terraform scripts is no longer
permitted. The scripts will be updated to match the security requirements.

## Introduction

This example demonstrates how to build a web app in AWS using Terraform.
The web app is built on the React framework 

## Requirements
- You need to have completed ALL of the steps listed in the [Introduction](../Introduction.md)
- In addition you will need to have [React](https://reactjs.org) and [NodeJS](https://nodejs.org/en/) installed

# Web App Use Case

A common use case for web applications in research is to provide a service that will:
- allow users to create and manipulate data and content
- have the content stored centrally and securely
- provide access to the content via a web-browser

For this reason, we created an example app with the following features:
- users to sign-up/log-in to the web app
- create, read, update and delete images via the web app and store them in a database on AWS
- view their images in the web app

## What to do with this example

We want to show a more realistic example of a web service/application with an API, static website, user management and backend storage.
Feel free to use and copy the code.
However, you should realise that this is not production ready code
- you will need to adapt the code to your requirements
- you will probably want to add some additional features not included in this example (e.g. CloudFront to ensure a HTTPS connection, logging facilities etc)


## How to use this example
- Follow the steps in [Introduction](../Introduction.md)
- The follow the steps in [HowTo](./HowTo.md). 

### Limitations

- are lambda functions the best choice for my application? It is worthwhile reading through the documentation [https://aws.amazon.com/lambda/] . E.g. lambda functions need time to "ramp" up. In short, it may take some time before the function actually executes. In part, this can be mitigated with configuring lambda functions (caches, etc). Or by choosing a different architecture (e.g. EC2 instances)
- Cognito is generally a useful service to handle authorisation and authentication. At UCL many services, however, run a mixed environment, whereby some users are UCL staff members and others are not. Some are researchers (UCL/non-UCL) who might need access to different functions than other users. The configuration of Cognito will therefore be different to the simple example given here. You may also end up using 2 separate authorisation/authentication systems -> one for staff and one for non-UCL members.
- this app is very basic in the following sense:
   - there is no backup facility included. This would be necessary for an application holding user data. 
   - the app is running from a single availability zone. 
   - you might want to consider extra security, e.g. in form of Virtual Private Cloud (VPC) to protect e.g. the database and the S3 buckets
   - logging is not provided (Cloudwatch)
   - in web app development it is common to separate between a "staging" (i.e. in development) and a "production" environment. Only one is given here.

## AWS Infrastructure

The overall AWS infrastructure is shown in the diagram below.

![Serverless App Architecture](./ServerlessApp.svg)

The AWS components used in this example are as follows:
| Component Name | Function |
| --------------- | ----------------- |
| AWS Cognito | for user sign-in and account creation |
| AWS Lambda | "serverless" functions. We have in total 6 lambda functions | 
| AWS API Gateway | defining API functions to interact between web-app client and web service |
| AWS S3 Bucket | S3 (Simple Storage Solution) bucket for the web app. Public access |
| AWS S3 Bucket | S3 (Simple Storage Solution) bucket for the media files. Private access only |
| AWS S3 Bucket | S3 (Simple Storage Solution) bucket for the lambda functions. Private access only |
| AWS Dynamodb Database | the database (NoSQL) holding users' data |

### Why this architecture?
The architecture follows the principles of an architecture for micro-services, whereby API functions/endpoints are provided as a layer between client applications and responses/actions on the server side. 

API functions require backend/server-based functionality to interact with other services - in this case a database (DynamoDB).
There are different ways to accomplis this, e.g. providing an EC2 service to host the functions.
Lambda functions (often called "serverless") are an easy and cost-effective alternative. 

User sign-up and sign-in are standard features of web apps these days. However, implementing them from scratch can be time-consuming, particularly if 
common security and safety features (e.g. OAuth 2 paths) are to be included. Cognito is a service provided by AWS that takes most of that pain away. 


## Example Files and Folders

| Folder Name | Content |
| --------------- | ----------------- |
| aws/lambda-functions | the source code for 5 lambda functions (create, delete, get all, get by ID, update) |
| frontend | the source code for the React web-site |
| terraform | the scripts for building the AWS infrastructure |

## Files To Build the Infrastructure with Terraform

The ```Terraform``` folder contains a number of terraform and support files 

| Script Name | What does it do |
| --------------- | ----------------- |
| main.tf | "entry" terraform script that defines the cloud provider |
| lambdas.tf | resources relating to the 6 lambda functions needed |
| s3_lambdabucket.tf | defines the private S3 bucket for the lambda functions |
| s3_media_bucket.tf | defines the private S3 bucket used to store media files for users |
| s3_webapp_bucket.tf | defines the public S3 bucket for the web application |
| dynamodb.tf | defines the Dynamo database used by the application |
| cognito.tf | defines the AWS Cognito user pool and user pool client used for authenticating/signing up users |
| api_gateway.tf | defines the API Gateway component and its permissions to use the corresponding lambda functions | 
| variables.tf | common names/variables used by the other scripts |
| outputs.tf | captures the IDs of the Cognito user pool and user pool client. In addition it captures 3 variables that we will use in the React app |
| assume_role_policy.json | AWS role policy for the use of lambda functions |
| dynamodb_watch_policy.json | Policy for the use of the DynamoDB database and logging functions |
| terraform.tfvars.example | Example file to set REQUIRED terraform environment variables. | 
| create_env.sh | a shell script to create the ENV for the React web app AFTER the infrastructure was created |


