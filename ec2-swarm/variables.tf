variable "app_prefix" {
  type        = string
  default     = "swarm"
  description = "Prefix for soultion and EC2 names."
}

variable "container" {
  type        = string
  default     = "kennethreitz/httpbin"
  description = "Container image to deploy."
}

variable "container_tag" {
  type        = string
  default     = "latest"
  description = "Tag of container to deploy."
}

variable "instance_type" {
  type        = string
  default     = "t2.micro"
  description = "Instance type to use."
}

variable "machine_count" {
  type        = number
  default     = 1
  description = "Number of EC2 instances to build."
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "List of private subnet IDs."
}

variable "public_subnet_ids" {
  type        = list(string)
  description = "List of public subnet IDs."
}

variable "vpc_id" {
  type        = string
  description = "ID of VPC to use."
}
