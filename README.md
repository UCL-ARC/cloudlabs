# Why Cloudlab?

*** Please make sure you read the general [Introduction](./Introduction.md) ***

UCL provides access to AWS (Amazon Web Services) and Azure (Microsoft) via the  
[Public Cloud](https://www.ucl.ac.uk/isd/support-staff/cloud/public-cloud) services.

With this repository we want to provide help, concrete examples and advise on to create applications
in AWS (and possibly later, Azure). 

## Requirements
You will need
- an account for AWS, see [Introduction](./Introduction.md)
- the Terraform tool, see also [Introduction](./Introduction.md)
- A basic familiarity with AWS components and cloud applications and Terraform. Tutorials for both can be found at
   - Terraform https://www.terraform.io 
   - AWS https://docs.aws.amazon.com  

## Infrastructure as Code
Although every cloud provider comes with a set of tools to build your applications, there are advantages to adopt an 'infrastructure as code' approach:
- Reuse: it is easy to share the infrastructure you used on one project for a similar one in future - with only minor alterations
- Ease of management: more complex apps have a large number of components. Managing them all from a console can be time consuming - and costly. infrastructure as code simplifies the management and maintenance process
- Support: ISD and ARC provide help and examples e.g. this repository. These are provided using infrastructure as code which you can adopt to your needs. 

At UCL [Terraform](https://www.terraform.io) is the preferred tool for infrastructure as code. And this is what you will find in this repository.

# Examples, Design Patterns
In this repository we want to give  "realistic" examples on the kind of cloud based applications you might want to build.

The examples should give you a good starting point for your own application.

- [Serverless app](./serverless-app/)
- [Docker swarm on EC2](./ec2-swarm/)


# What this repository is NOT
- The examples and use cases given here should work as is. However, you will still need some work to adapt it to your project. 
- Automatic deployment and testing of components not directly related to AWS (e.g. uploading your web app to an S3 bucket, setting environment variables etc) is NOT shown here. CI/CD (Continuous Integration/Con. Deployment) are subjects in their own right and beyond the scope of this repository.   
