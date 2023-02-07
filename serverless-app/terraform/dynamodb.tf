### DYNAMODB 
### This defines the single table in DynamoDB. Note: only the hash_key and the range_key (if used)
### must be declared in this resource. All additional attributes will be automatically declared when
### writing to/reading from the table. 
### If a global/local index is used, this must be declared as well (and the associated attributes with it)


resource "aws_dynamodb_table" "user-media-table" {
  name = var.dynamodb_name
  read_capacity = 10
  billing_mode = "PROVISIONED"
  write_capacity = 10
  hash_key = "username"
  range_key = "imagefile"

  attribute {
    name = "username"
    type = "S"
  }

  attribute {
    name = "imagefile"
    type = "S"
  }
}
