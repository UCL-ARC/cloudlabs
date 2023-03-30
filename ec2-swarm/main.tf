# Get the latest Red Hat 8 AMI.
# ***This is the PAYG AMI.***
data "aws_ami" "rhel8" {
  most_recent = true

  filter {
    name   = "name"
    values = ["RHEL-8.*-x86_64-*-Hourly2-GP2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["309956199498"] # Red Hat
}

# Create one or more ec2 instances across the private
# subnets.
resource "aws_instance" "swarm" {

  # Number of machines to create.
  count = var.machine_count

  subnet_id     = element(var.private_subnet_ids, count.index)
  ami           = data.aws_ami.rhel8.id
  instance_type = var.instance_type

  # Attach SSM IAM profile.
  iam_instance_profile = aws_iam_instance_profile.ssm_instance.name

  vpc_security_group_ids = [aws_security_group.app.id]

  tags = {
    Name = "${var.app_prefix}${format("%02d", count.index + 1)}"
  }

  # Configure instance(s) with the contents of ./templates/user.sh.
  user_data = templatefile("${path.root}/templates/user-data.sh.tmpl",
  { container = var.container, container_tag = var.container_tag })
}

# Application load balancer
module "alb" {
  source  = "terraform-aws-modules/alb/aws"
  version = "~> 6.0"

  name = "alb"

  load_balancer_type = "application"

  vpc_id          = var.vpc_id
  subnets         = var.public_subnet_ids
  security_groups = [aws_security_group.alb.id]

  #access_logs = {
  #  bucket = "alb-logs"
  #}

  target_groups = [
    {
      name_prefix      = "pref-"
      backend_protocol = "HTTP"
      backend_port     = 80
      target_type      = "instance"
      targets          = local.instance_targets
    }
  ]

  #https_listeners = [
  #  {
  #    port               = 443
  #    protocol           = "HTTPS"
  #    certificate_arn    =
  #    target_group_index = 0
  #  }
  #]

  http_tcp_listeners = [
    {
      port               = 80
      protocol           = "HTTP"
      target_group_index = 0
    }
  ]

  tags = {
    Terraform = "true"
  }
}

locals {
  # List of all instances.
  instance_ids = aws_instance.swarm.*.id

  # Form ALB target entry for each instance: 
  instance_targets = {
    for i, v in local.instance_ids : "target${i}" => {
      target_id = v
      port      = 80
    }
  }
}
