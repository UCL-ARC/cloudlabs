/**
IAM:= Identity and Access Management

aws_iam_role, aws_iam_role_policy, aws_iam_role_policy_attachment, aws_iam_policy, aws_iam_policy_attachment
the terminology of that can be quite confusing. 
also, AWS creates some of this per default when creating resources in the management console. 
But in terraform this needs to be specific. 

IAM roles need to be created for an account and associated with AWS components. AWS follows a
strict Nothing-Is-Allowed-Unless-You-Say-So. 
In terraform we need to be explicit about each component/resource, what permissions it needs, 
which are the users that can access this resource

Chances are you definitely need a aws_iam_role resource, e.g. for CloudWatch logging or Lambda functions
Each role has a policy associated with it, that specifies what this role can (or cannot) do

But there are 2 different routes to accomplish that
Route 1: 
aws_iam_role and aws_iam_role_policy
This ties the policy to the role directly. And only to that role. You cannot assign a policy to several roles that way

Route 2:
aws_iam_role, aws_iam_policy and aws_iam_role_policy_attachment
a more indirect way. First define your policy in aws_iam_policy. 
The next step is to attach this policy to a role using aws_iam_role_policy_attachment
That way the same policy can be attached to different roles with
aws_iam_role_policy_attachment providing the link between role and policy. 

Talking of policies:
there is the assume_role_policy and then the actual policy. So what's the difference?
assume_role_policy -> this is like defining permissions for a user or group of users. It's a required field in a aws_iam_role resource
E.g. for lambda functions roles are defined to specify what a lambda function can do (recalling that by default no permissions are given)

The policy document 

*/

# Define the general policy/permissions for lambda functions
# This is restricted to DynamoDB only for now

#resource "aws_iam_policy" "lambda_dynamodb_policy" {
#  name = "lambda_policy_for_cloudwatch_dynamodb"
#  policy = file("dynamodb_watch_policy.json")
#}

#resource "aws_iam_policy" "lambda_presigned_s3_policy" {
#  name = "lambda_policy_for_s3_presignedurl"
#  policy = file("s3_presignedurl_policy.json")
#}

# Define the role lambda functions will assume when executing
resource "aws_iam_role" "lambda_exec_role" {
  name = "serverless_lambda"
  assume_role_policy = file("assume_role_policy.json")
}

# Tie role and policy together
resource "aws_iam_role_policy_attachment" "lambda_multiple_attachment" {
    for_each = toset([
        "arn:aws:iam::aws:policy/AmazonS3FullAccess",
        "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
    ])
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = each.value
#  policy_arn = "${aws_iam_policy.lambda_dynamodb_policy.arn}"
}


#resource "aws_iam_role" "lambda_presigned_role" {
#  name = "presigned_lambda_s3"
#  assume_role_policy = file("assume_role_policy.json")
#}

#resource "aws_iam_role_policy_attachment" "lambda_s3_presigned_attachment" {
#  role = aws_iam_role.lambda_presigned_role.name
#  policy_arn = "${aws_iam_policy.lambda_presigned_s3_policy.arn}"
#}

