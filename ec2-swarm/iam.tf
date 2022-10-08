# Configure role for EC2.
data "aws_iam_policy_document" "instance_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

# Configure IAM role.
resource "aws_iam_role" "ssm_role" {
  name               = "CloudLabsSSMRole"
  assume_role_policy = data.aws_iam_policy_document.instance_assume_role_policy.json
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
    "arn:aws:iam::aws:policy/AmazonSSMPatchAssociation"
  ]
}

# Configure IAM instance profile.
resource "aws_iam_instance_profile" "ssm_instance" {
  name = "CloudLabsSSMRoleForInstances"
  role = aws_iam_role.ssm_role.name
}