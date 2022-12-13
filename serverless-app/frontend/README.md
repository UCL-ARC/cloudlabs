This project contains the React JavaScript frontend code for the brain atlas application.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

---

## Requirements

You need to have Node.js installed on your local development machine, this is required to handle npm packages.

https://nodejs.org/en/download/

Once the react project has been cloned from GitHub run the following from the react project directory: '/frontend'.

```shell script
npm install
```

This will install all of the project dependencies specified in package.json.

---

## Running the project in development mode

In the react project directory '/frontend', you can run:

```shell script
npm start
```

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

---

## Building the project for production
Use the following command in your shell script or terminal. 

```
npm run build
```

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

## Deploying the project to the S3 bucket
Do this ***AFTER*** you created the AWS infrastructure with Terraform
Use the following command line 
```
npm run deploy
```
This will upload the code from the build directory to the AWS S3 bucket ```s3-serverless-app-example.com``` 
---

---

### Environment variables
React has the ability to use system and environment variables. These need to be defined with names starting
```
REACT_APP_
```
When the React app is built, the ENV variables will be set to their respective values. 

The environment variables used in the React App are being set in the 
```
.env
```
file in the root directory of the ```serverless-app```


