import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "eu-west-2_0GiEcPl15",
    ClientId: "51hoi56serlaalhsosl8r4em5n",
};

export default new CognitoUserPool(poolData);
