import { CognitoUserPool } from "amazon-cognito-identity-js";

// this information is safe to be included on the frotend
// example usage here: https://www.npmjs.com/package/amazon-cognito-identity-js
const poolData = {
    UserPoolId: "eu-west-2_0GiEcPl15",
    ClientId: "51hoi56serlaalhsosl8r4em5n",
};

export default new CognitoUserPool(poolData);
