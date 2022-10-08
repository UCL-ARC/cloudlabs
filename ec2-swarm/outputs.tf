# List of all EC2s
output "instances" {
  value = local.instance_ids
}

# The URI for the LB.
output "lb_dns_name" {
  value = module.alb.lb_dns_name
}