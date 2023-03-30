# How to run this example - Quick Summary
- **Step 0** [Introduction](../Introduction.md) (None of the below will work if you haven't)
- **Step 1** Download code and set environment variables for Terraform using the ```terraform.tfvars``` file
- **Step 2** Run Terraform 
- **Step 3** Run the ```create_env.sh``` 
- **Step 4** Build and deploy the React app
- **Step 5** Destroy the infrastructure when you're done

The steps (except step 0) are explained in more detail below

The example web app will have the following URL
```http://<YOUR-WEB-BUCKET-NAME>.s3-website.eu-west-2.amazonaws.com```


# Step 1 - Get the Code and set Environment variable
- Clone this repository, or download it as a ZIP file. 
- Open a command line terminal and go to the cloned/downloaded (and unzipped) ```cloudlabs``` directory.
- go into the folder ```/serverless-app/terraform``` and copy the file ```terraform.tfvars.example``` to ```terraform.tfvars```
- open ```terraform.tfvars``` and replace the name placeholders in <> brackets with the names of your choice. 


# Step 2 - Run Terraform
Make sure you are in the folder ```/serverless-app/terraform``` 
Open a command line terminal.
If you run Terraform for the **FIRST** time do the following:

```
terraform init
```

Do the following two commands (in that order)
```
terraform plan
terraform apply
```

When doing ```terraform apply``` (or ```terraform plan```) you will be prompted to type in ```yes``` to proceed.

At the end of the last step you should see a message saying
```Apply complete! Resources: 47 added, 0 changed, 0 destroyed.```

Your components are now live in AWS! You can check by going to your AWS console at https://ucl-cloud.awsapps.com/start#/ 

# Step 3 - Save output Variables to File
The infrastructure built with Terraform produces some output variables we need to build the React app with.
There is a SHELL script (for Mac/Unix platforms) that does that.

Make sure you are in the folder ```/serverless-app/terraform``` 

In a command line terminal run
```
source create_env.sh
```

This will produce a ```.env``` file in the ```/serverless-app/frontend``` folder.


# Step 4 - Build Upload the React Web App to AWS
The final step is to build and upload the app to the newly created S3 bucket.
(See also the [README](./frontend/README.md) file)

The React example web app is in the folder ```/serverless-app/frontend```.

- open the ```package.json``` file
   - in the section starting with ```scripts``` there is a line for ```deploy```. Insert the name of your S3 bucket for the Web app. This MUST match the name set for the ```s3_web_bucket_name``` variable in your ```.tfvars``` file from the ```/serverless-app/terraform``` folder.  

- From the command line type in ```npm run build``` . This will build the React app from the sources and store the product in a ```build``` folder
- From the command line run ```npm run deploy``` to deploy the app to the AWS S3 bucket  


# Step 5 - Destroy the infrastructure
It is good practice to remove the AWS infrastructure when you are finished using them. 
This is to avoid unnecessary costs on your AWS account.
Remember, it is easy to recreate your infrastructure with ```terraform apply```.

- in a command line terminal go to the ```/serverless-app/terraform``` folder
- type in ```terraform destroy``` - you will be prompted to type in ```yes``` in the process.

You should get the following message at the end of the destroy.
```Destroy complete! Resources: 47 destroyed.```


