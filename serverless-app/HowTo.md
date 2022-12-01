# How to run this example
This assumes you followed the initial set up steps in the [Introduction](../Introduction.md)
(None of the below will work if you haven't)

# Before you start - Get the Code from this repo
- Clone this repository, or download it as a ZIP file.
- Open a command line terminal and go to the cloned/downloaded ```cloudlabs``` directory
- go into the folder ```serverless-app```

# Step 1 - Set Environment Variable for Terraform
The name for the DynamoDB database and the media/image S3 bucket are used by the JavaScript lambda functions and need to be set *** before *** you build the infrastructure.

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

# Step 4 - Build the React Web App
- in your terminal go to the folder ```frontend``` (child folder of ```serverless-app```)
- in there type in the following command: ```npm run build```

This will create a ```build``` directory in your ```frontend``` folder.

# Step 5 - Upload the React Web App to AWS

