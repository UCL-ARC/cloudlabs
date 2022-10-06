variable "container" {
  type    = string
  default = "kennethreitz/httpbin"
}

variable "container_tag" {
  type    = string
  default = "latest"
}

variable "machine_count" {
  type    = number
  default = 1
}

variable "instance_prefix" {
  type    = string
  default = "swarm"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "vpc_id" {}

#security_group_ids
