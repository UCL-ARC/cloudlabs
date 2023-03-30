# Security group for the load balancer.
resource "aws_security_group" "alb" {
  vpc_id      = var.vpc_id
  name_prefix = "${var.app_prefix}-alb"
  description = "Allow access to/from ALB"
}

# Security group for the app servers (EC2s)
resource "aws_security_group" "app" {
  vpc_id      = var.vpc_id
  name_prefix = "${var.app_prefix}-app"
  description = "Allow access to/from application server(s)"
}

# Allow internet traffic to LB.
resource "aws_security_group_rule" "http_ingress" {
  type              = "ingress"
  description       = "HTTP from internet"
  from_port         = 80
  to_port           = 80
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb.id
}

# Allow traffic from LB to EC2s in private subnets.
resource "aws_security_group_rule" "alb_egress" {
  type                     = "egress"
  description              = "HTTP to private"
  from_port                = 80
  to_port                  = 80
  protocol                 = "tcp"
  security_group_id        = aws_security_group.alb.id
  source_security_group_id = aws_security_group.app.id
}

# Allow EC2s to accept traffic from LB.
resource "aws_security_group_rule" "app_ingress" {
  type                     = "ingress"
  description              = "HTTP from ALB"
  from_port                = 80
  to_port                  = 80
  protocol                 = "tcp"
  security_group_id        = aws_security_group.app.id
  source_security_group_id = aws_security_group.alb.id
}

# Allow EC2s to send responses to the internet.
resource "aws_security_group_rule" "priv_to_internet_egress" {
  type              = "egress"
  description       = "Return to Internet"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.app.id
}