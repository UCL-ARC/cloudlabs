# How to run this example - 4 Steps
This assumes you followed the initial set up steps in the [Introduction](../Introduction.md)
(None of the below will work if you haven't)

## Before you start - Get the Code from this repo
- Clone this repository, or download it as a ZIP file.
- Open a command line terminal and go to the cloned/downloaded ```cloudlabs``` directory
- go into the folder ```serverless-app```

# Step 1 - Set Environment Variable for Terraform
The name for the example DynamoDB database and the example media/image S3 bucket are used by the JavaScript lambda functions and need to be set *** before *** you build the infrastructure.

## Setting the Environment Variables on a Mac using ZSH or BASH shells

- copy the file ```.env.sample``` to a file called ```.env```
- open the newly created ```.env``` file and set the values for
   - ```TF_VAR_s3_media_bucket_name```
   - ```TF_VAR_dynamodb_name```
- save and close the ```.env``` file
- in a terminal run ```source setenv.sh```

You can check whether the environment variables have been set by opening a terminal and type in :```set```

# Step 2 - Run Terraform
In your command line terminal
- go to the folder ```terraform``` (inside ```serverless-app```)
- FOR FIRST TIME USE ONLY: type in ```terraform init```
- type in ```terraform plan```
   - you will be prompted to type in 'Yes'
- type in ```terraform apply```
   - you will be prompted to type in 'Yes'

At the end of the last step you should see a message saying
```Apply complete! Resources: 47 added, 0 changed, 0 destroyed.```

Your components are now live in AWS! You can check by going to your AWS console at https://ucl-cloud.awsapps.com/start#/ 

# Step 3 - Save output Variables to File
Some of the values created with Terraform are needed for the React Web app.
- in the ```terraform``` folder type in the following command: ```terraform output -json > ./reactvariables.json``` 
   - This will save 3 variables to a JSON file called ```reactvariables.json```. The name of each variable starts with ```REACT_APP_```. We will need this to build the React web app
- open the ```.env``` file in the ```serverless-app``` folder (one level up) and copy the values of the 3 REACT_APP_ named variables from the JSON file to the ```.env``` file. Save and exit
- run ```source setenv.sh``` again


# Step 4 - Build Upload the React Web App to AWS
The final step is to build and upload the app to the newly created S3 bucket.
(See also the [README](./frontend/README.md) file)

The React example web app is in the folder ```frontend```.

- open the ```package.json``` file
   - in the section starting with ```scripts``` there is a line for ```deploy```. Insert the name of your S3 bucket for the Web app. This MUST match the name set for the ```TF_VAR_s3_web_bucket_name``` variable in your ```.env``` file.  
- From the command line type in ```npm run build``` . This will build the React app from the sources and store the product in a ```build``` folder
- From the command line run ```npm run deploy``` to deploy the app to the AWS S3 bucket  


# FINALLY
How do I access the web-site?

```http://<YOUR-WEB-BUCKET-NAME>.s3-website.eu-west-2.amazonaws.com```

NOTE: HTTPS services are not available. For that we would need to use another AWS component called CloudFront.
(there will be a later example for that)



