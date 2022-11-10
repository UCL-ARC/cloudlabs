import { CognitoUserPool } from "amazon-cognito-identity-js";

// this information is safe to be included on the frotend
// example usage here: https://www.npmjs.com/package/amazon-cognito-identity-js
const poolData = {
    UserPoolId: process.env.REACT_APP_COGNITO_USERPOOL_ID,
    ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
};

export default new CognitoUserPool(poolData);
