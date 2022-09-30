This directory contains the AWS lambda functions that form part of the backend services for the cloudlabs serverless web app project.

Lambda functions are run when users hit the appropriate api endpoints stored in AWS API Gateway (see section on running lambda functions below). Users hit these endpoints from the frontend, see `/frontend` for the react app architecture.

# Manual deployment of lambda functions to AWS

For now, these lambda functions are uploaded to AWS manually but this will eventually be automated with Terraform.

-   First, zip all the files belonging to each individual lambda function into separate archives.
-   For example, select all of the files in `/lambda-functions/createMediaItem` and zip them using a zipping utility. Make sure to include the node_modules folder in the zip archive if one exists (not all of them will need a node_modules folder).
-   Go to the lambda section in your AWS accound.
-   Create a new function, and choose the option to upload a .zip archive.

# Instructions on deploying lambda functions using Terraform will be added soon

Instructions go here...

# Running lambda functions

To run the lambda functions, you will need to set up an AWS API Gateway service and connect individual routes to your lambda functions. Make sure to attatch authorization to the route where required.
