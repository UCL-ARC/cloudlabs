# Get the latest Red Hat 8 AMI.
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

  count = var.machine_count

  subnet_id     = element(var.private_subnet_ids, count.index)
  ami           = data.aws_ami.rhel8.id
  instance_type = var.instance_type

  # Attach SSM IAM profile.
  iam_instance_profile = aws_iam_instance_profile.ssm_instance.name

  #vpc_security_group_ids = var.security_group_ids

  tags = {
    Name = "${var.instance_prefix}${format("%02d", count.index + 1)}"
  }

  # Configure instance(s) with the contents of ./templates/user.sh.
  user_data = templatefile("${path.root}/templates/user-data.sh.tmpl", { container = var.container, container_tag = var.container_tag })
}

module "alb" {
  source  = "terraform-aws-modules/alb/aws"
  version = "~> 6.0"

  name = "alb"

  load_balancer_type = "application"

  vpc_id             = var.vpc_id
  subnets            = var.private_subnet_ids
  security_groups    = ["sg-0ab4f3e692872d7fc"]

  #access_logs = {
  #  bucket = "alb-logs"
  #}

  target_groups = [
    {
      name_prefix      = "pref-"
      backend_protocol = "HTTP"
      backend_port     = 80
      target_type      = "instance"
      targets = {
        my_target = {
          target_id = aws_instance.swarm[0].id
          port = 80
        }
      }
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
