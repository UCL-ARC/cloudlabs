resource "aws_security_group" "alb" {
  vpc_id      = var.vpc_id
  name_prefix = "${var.app_prefix}-alb"
  description = "Allow access to/from ALB"
}

resource "aws_security_group" "app" {
  vpc_id      = var.vpc_id
  name_prefix = "${var.app_prefix}-app"
  description = "Allow access to/from application server(s)"
}

resource "aws_security_group_rule" "http_ingress" {
  type              = "ingress"
  description       = "HTTP from internet"
  from_port         = 80
  to_port           = 80
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb.id
}

resource "aws_security_group_rule" "alb_egress" {
  type                     = "egress"
  description              = "HTTP to private"
  from_port                = 80
  to_port                  = 80
  protocol                 = "tcp"
  security_group_id        = aws_security_group.alb.id
  source_security_group_id = aws_security_group.app.id
}

resource "aws_security_group_rule" "app_ingress" {
  type                     = "ingress"
  description              = "HTTP from ALB"
  from_port                = 80
  to_port                  = 80
  protocol                 = "tcp"
  security_group_id        = aws_security_group.app.id
  source_security_group_id = aws_security_group.alb.id
}

resource "aws_security_group_rule" "priv_to_internet_egress" {
  type              = "egress"
  description       = "Return to Internet"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.app.id
}