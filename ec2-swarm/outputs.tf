output "instances" {
  value = local.instance_ids
}

output "instance_targets" {
  value = local.instance_targets
}

output "lb_dns_name" {
  value = module.alb.lb_dns_name
}