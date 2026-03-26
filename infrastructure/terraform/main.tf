terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ── Network Layout ───────────────────────────────────────────

resource "aws_vpc" "agrilink_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = { Name = "agrilink-vpc" }
}

resource "aws_internet_gateway" "agrilink_gw" {
  vpc_id = aws_vpc.agrilink_vpc.id
  tags   = { Name = "agrilink-igw" }
}

# ── EKS Cluster (for 15+ Containers) ─────────────────────────

resource "aws_eks_cluster" "agrilink_cluster" {
  name     = "agrilink-production-v2"
  role_arn = aws_iam_role.eks_role.arn

  vpc_config {
    subnet_ids = aws_subnet.public[*].id
  }

  depends_on = [aws_iam_role_policy_attachment.eks_policy]
}

# ── RDS PostgreSQL (Shared Pool) ──────────────────────────────

resource "aws_db_instance" "agrilink_postgres" {
  allocated_storage      = 20
  db_name                = "agrilink_prod"
  engine                 = "postgres"
  engine_version         = "16"
  instance_class         = "db.t3.micro"
  username               = "agrilink"
  password               = var.db_password
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  skip_final_snapshot    = true
}

# ── IAM Roles (Security) ──────────────────────────────────────

resource "aws_iam_role" "eks_role" {
  name = "agrilink-eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = { Service = "eks.amazonaws.com" }
      },
    ]
  })
}
