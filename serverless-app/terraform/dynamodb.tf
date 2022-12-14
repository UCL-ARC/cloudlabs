### DYNAMODB 
### This defines the single table in DynamoDB. Note: only the hash_key and the range_key (if used)
### must be declared in this resource. All additional attributes will be automatically declared when
### writing to/reading from the table. 
### If a global/local index is used, this must be declared as well (and the associated attributes with it)


resource "aws_dynamodb_table" "user-places-table" {
  name           = var.dynamodb_name
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "UserId"
  range_key      = "MediaFileName"

  attribute {
    name = "UserId"
    type = "S"
  }
  attribute {
    name = "MediaFileName"
    type = "S"
  }
}
