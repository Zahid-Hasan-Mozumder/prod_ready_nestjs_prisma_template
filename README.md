# NestJS Prisma Template

<div align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" alt="AWS" />
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx" />
</div>

## 📋 Description

A production-ready NestJS template with Prisma ORM, PostgreSQL, and Docker setup. This template provides a solid foundation for building scalable Node.js applications with modern tooling and best practices.

## 🏗️ Architecture

- **Framework**: NestJS (Node.js framework)
- **Database**: PostgreSQL with Prisma ORM
- **Language**: TypeScript
- **Containerization**: Docker & Docker Compose
- **Configuration**: Environment-based with Joi validation
- **Infrastructure**: AWS EC2, Elastic IP, Route 53, Nginx

## 📁 Project Structure

```
src/
├── api/                    # API modules
│   ├── post/              # Post module
│   └── user/              # User module
├── external/              # External services
│   ├── config/           # Configuration module
│   └── prisma/           # Database module
├── app.module.ts         # Main application module
└── main.ts              # Application entry point

prisma/
├── schema.prisma        # Database schema
└── migrations/          # Database migrations

docker/                  # Docker configurations
├── Dockerfile          # Development container
├── Dockerfile.prod     # Production container
├── docker-compose.dev.yml
└── docker-compose.prod.yml
```

## 🚀 Features

- ✅ **Modular Architecture**: Well-organized code structure with separate modules
- ✅ **Database Integration**: Prisma ORM with PostgreSQL
- ✅ **Docker Support**: Both development and production Docker setups
- ✅ **Environment Configuration**: Centralized configuration management
- ✅ **Validation**: Joi schema validation for environment variables
- ✅ **TypeScript**: Full TypeScript support with strict type checking
- ✅ **Testing**: Jest setup for unit and e2e tests
- ✅ **Linting**: ESLint and Prettier for code quality
- ✅ **Hot Reload**: Development server with automatic restart

## ☁️ AWS Infrastructure Setup

### Prerequisites for AWS Deployment

- AWS Account with appropriate permissions
- Domain name (for Route 53 setup)
- SSH key pair for EC2 access

### 1. EC2 Instance Setup

1. **Launch EC2 Instance**
   ```bash
   # Choose Ubuntu 22.04 LTS (free tier eligible)
   # Instance type: t2.micro or t3.micro for development
   # Security Group settings:
   # - SSH (22) - restrict to your IP
   # - HTTP (80) - allow from anywhere
   # - HTTPS (443) - allow from anywhere
   # - Custom TCP (5000) - for direct app access during setup
   ```

2. **Connect to your instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-public-ip
   ```

3. **Update and install required packages**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y docker.io docker-compose-plugin nginx certbot python3-certbot-nginx curl
   ```

4. **Configure Docker**
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -aG docker $USER
   ```

5. **Install Node.js and npm (optional, for local development)**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

### 2. Elastic IP Setup

1. **Allocate Elastic IP**
   ```
   AWS Console → EC2 → Elastic IPs → Allocate Elastic IP address
   ```

2. **Associate with EC2 Instance**
   ```
   Select the allocated EIP → Actions → Associate Elastic IP address
   Choose your EC2 instance from the dropdown
   ```

3. **Update Security Groups** (if needed)
   ```
   EC2 → Security Groups → Edit inbound rules
   Update SSH rule to restrict to your IP only
   ```

### 3. Route 53 Domain Setup

1. **Create Hosted Zone**
   ```
   Route 53 → Hosted zones → Create hosted zone
   Enter your domain name (e.g., example.com)
   ```

2. **Update Domain Nameservers**
   ```
   Go to your domain registrar
   Update nameservers to the 4 NS records provided by Route 53
   ```

3. **Create DNS Records**
   ```
   # A record for root domain
   Name: example.com
   Type: A
   Value: [Your Elastic IP]

   # CNAME for www (optional)
   Name: www.example.com
   Type: CNAME
   Value: example.com
   ```

4. **Wait for DNS Propagation**
   ```bash
   # Test DNS resolution
   nslookup example.com
   ```

### 4. Nginx Setup

1. **Configure Nginx as Reverse Proxy**
   ```bash
   sudo nano /etc/nginx/sites-available/nestjs-app
   ```

   Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

2. **Enable Site and Restart Nginx**
   ```bash
   sudo ln -s /etc/nginx/sites-available/nestjs-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

3. **SSL Certificate Setup (Let's Encrypt)**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

### 5. AWS Credentials Setup

1. **Create IAM User for Application**
   ```
   IAM → Users → Create user
   User name: nestjs-app-user
   Attach policies: AmazonEC2ReadOnlyAccess, AmazonRDSReadOnlyAccess (if using RDS)
   ```

2. **Generate Access Keys**
   ```
   IAM → Users → [user] → Security credentials → Create access key
   Download .csv file with Access Key ID and Secret Access Key
   ```

3. **Configure AWS CLI on EC2**
   ```bash
   sudo apt install awscli
   aws configure
   # Enter Access Key ID, Secret Access Key, default region, default output format
   ```

4. **Environment Variables for Application**
   ```bash
   sudo nano .env.production
   ```

   Add the following variables:
   ```env
   NODE_ENV=production
   PORT=4000
   DATABASE_URL=postgresql://username:password@db:5432/nestjs_prisma_prod

   # AWS Configuration (if needed)
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   AWS_DEFAULT_REGION=us-east-1
   ```

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id    String  @id @default(uuid())
  email String  @unique
  name  String?
  posts Post[]

  @@index([id])
  @@index([email])
  @@map("users")
}
```

### Post Model
```prisma
model Post {
  id        String  @id @default(uuid())
  title     String
  content   String?
  published Boolean @default(false)
  authorId  String

  author User @relation(fields: [authorId], references: [id])

  @@index([id])
  @@index([authorId])
  @@map("posts")
}
```

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **Docker & Docker Compose**: Latest stable versions ([Install Docker](https://docs.docker.com/get-docker/))
- **Git**: For cloning the repository
- **PostgreSQL**: v15 or higher (if running without Docker)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nestjs_prisma_template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Application Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DATABASE_URL="postgresql://admin:admin@localhost:5435/nestjs_prisma_dev"

   # Optional: AWS Configuration (if using AWS services)
   # AWS_ACCESS_KEY_ID=your-access-key-id
   # AWS_SECRET_ACCESS_KEY=your-secret-access-key
   # AWS_DEFAULT_REGION=us-east-1
   ```

4. **Database Migration (First Time Setup)**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push database schema (creates tables)
   npx prisma db push
   ```

### Running the Application Locally

#### Option A: Docker Setup (Recommended)

```bash
# Development environment with hot reload
docker-compose -f docker-compose.dev.yml up --build

# Production simulation
docker-compose -f docker-compose.prod.yml up --build
```

#### Option B: Local Development (Without Docker)

1. **Start PostgreSQL locally**
   ```bash
   # Using Docker for database only
   docker run --name postgres-dev -e POSTGRES_DB=nestjs_prisma_dev \
     -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin \
     -p 5435:5432 -d postgres:15-alpine
   ```

2. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

3. **Start the application**
   ```bash
   # Development mode with hot reload
   npm run start:dev

   # Or debug mode
   npm run start:debug
   ```

### Access the Application

- **Local Development**: http://localhost:5000 (Docker) or http://localhost:3000 (local)
- **API Documentation**: The application exposes REST endpoints at `/user` and `/post`
- **Database**: PostgreSQL accessible at `localhost:5435`

### Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Application port | `3000` | No |
| `NODE_ENV` | Environment mode | `development` | No |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `AWS_ACCESS_KEY_ID` | AWS access key | - | Optional |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | - | Optional |
| `AWS_DEFAULT_REGION` | AWS region | `us-east-1` | Optional |

## 📜 Available Scripts

```bash
# Development
npm run start:dev          # Start development server with hot reload
npm run start:debug        # Start with debugging enabled
npm run build              # Build the application

# Production
npm run start:prod         # Start production server

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:e2e           # Run end-to-end tests
npm run test:cov           # Run tests with coverage

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Application port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | Required |

### Docker Ports

- **Application**: `5000` (host) → `4000` (container)
- **Database**: `5435` (host) → `5432` (container)

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 🚢 Deployment

### Local Production Testing

1. **Build and run production containers locally**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

2. **Environment variables for local production**
   ```env
   NODE_ENV=production
   PORT=4000
   DATABASE_URL="postgresql://admin:admin@db:5432/nestjs_prisma_prod"
   ```

### AWS Production Deployment

#### Prerequisites
- EC2 instance with Docker and Nginx configured (see AWS Infrastructure Setup)
- Domain configured with Route 53
- SSL certificate from Let's Encrypt

#### Step 1: Prepare Application for Deployment

1. **Clone repository on EC2 instance**
   ```bash
   git clone <repository-url>
   cd nestjs_prisma_template
   ```

2. **Configure production environment**
   ```bash
   sudo nano .env.production
   ```

   Add production environment variables:
   ```env
   NODE_ENV=production
   PORT=4000
   DATABASE_URL="postgresql://prod_user:secure_password@db:5432/nestjs_prisma_prod"

   # Optional: AWS Configuration
   AWS_ACCESS_KEY_ID=your-production-access-key
   AWS_SECRET_ACCESS_KEY=your-production-secret-key
   AWS_DEFAULT_REGION=us-east-1
   ```

3. **Update Docker Compose for production**
   ```bash
   sudo nano docker-compose.prod.yml
   ```

   Modify the database service to use stronger credentials:
   ```yaml
   db:
     image: postgres:15-alpine
     environment:
       - POSTGRES_DB=nestjs_prisma_prod
       - POSTGRES_USER=prod_user
       - POSTGRES_PASSWORD=secure_password
   ```

#### Step 2: Deploy Application

1. **Build and run production containers**
   ```bash
   sudo docker-compose -f docker-compose.prod.yml up --build -d
   ```

2. **Verify application is running**
   ```bash
   sudo docker-compose -f docker-compose.prod.yml ps
   curl http://localhost:5000
   ```

3. **Check application logs**
   ```bash
   sudo docker-compose -f docker-compose.prod.yml logs -f app
   ```

#### Step 3: Configure Nginx (Reverse Proxy)

1. **Update Nginx configuration**
   ```bash
   sudo nano /etc/nginx/sites-available/nestjs-app
   ```

   Ensure the configuration points to the correct port:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

2. **Test and reload Nginx**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

#### Step 4: SSL Certificate Setup

1. **Obtain SSL certificate**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

2. **Verify SSL configuration**
   ```bash
   curl -I https://your-domain.com
   ```

#### Step 5: Security Hardening

1. **Update EC2 Security Groups**
   ```
   - Remove port 5000 from inbound rules (only keep 80, 443, 22)
   - Restrict SSH access to your IP only
   ```

2. **Configure firewall on EC2**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw --force enable
   ```

3. **Secure database credentials**
   - Use AWS Secrets Manager or Parameter Store for sensitive data
   - Rotate database passwords regularly

#### Monitoring and Maintenance

1. **Monitor application logs**
   ```bash
   sudo docker-compose -f docker-compose.prod.yml logs -f
   ```

2. **Check system resources**
   ```bash
   htop
   df -h
   sudo docker system df
   ```

3. **Update application**
   ```bash
   # Pull latest changes
   git pull origin main

   # Rebuild and restart
   sudo docker-compose -f docker-compose.prod.yml up --build -d
   ```

### Manual Production Deployment (Alternative)

If you prefer not to use Docker on EC2:

1. **Install Node.js and PostgreSQL on EC2**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib
   ```

2. **Install dependencies**
   ```bash
   npm ci --only=production
   ```

3. **Build the application**
   ```bash
   npm run build
   ```

4. **Configure environment**
   ```bash
   sudo nano .env
   # Add production environment variables
   ```

5. **Generate Prisma client and run migrations**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

6. **Start the application with PM2**
   ```bash
   sudo npm install -g pm2
   pm2 start dist/src/main.js --name nestjs-app
   pm2 startup
   pm2 save
   ```

### Troubleshooting Deployment

#### Common Issues

1. **Port already in use**
   ```bash
   sudo netstat -tulpn | grep :5000
   sudo docker-compose -f docker-compose.prod.yml down
   ```

2. **Database connection issues**
   ```bash
   sudo docker-compose -f docker-compose.prod.yml logs db
   # Check DATABASE_URL in .env file
   ```

3. **SSL certificate renewal**
   ```bash
   sudo certbot renew
   sudo systemctl reload nginx
   ```

4. **Application not responding**
   ```bash
   sudo docker-compose -f docker-compose.prod.yml restart app
   # Check application logs for errors
   ```

#### Health Checks

- Application health: `curl http://localhost:5000`
- Nginx status: `sudo systemctl status nginx`
- Docker containers: `sudo docker ps`

## 🔒 Security Best Practices

### Environment Security

1. **Never commit secrets to version control**
   ```bash
   # Add to .gitignore
   .env
   .env.production
   .env.local
   ```

2. **Use strong, unique passwords**
   ```bash
   # Generate secure password
   openssl rand -base64 32
   ```

3. **Environment variable validation**
   - All sensitive configuration uses Joi validation
   - Required variables are checked at startup

### AWS Security

1. **IAM Permissions**
   - Use least privilege principle
   - Rotate access keys regularly
   - Use IAM roles instead of access keys when possible

2. **Security Groups**
   - Minimal required ports only
   - Restrict SSH to specific IPs
   - Use VPC security groups

3. **SSL/TLS**
   - Always use HTTPS in production
   - Redirect HTTP to HTTPS
   - Renew certificates automatically with Let's Encrypt

### Application Security

1. **Database Security**
   - Use parameterized queries (handled by Prisma)
   - Strong database passwords
   - Regular backups

2. **API Security**
   - Input validation on all endpoints
   - Rate limiting (consider implementing)
   - CORS configuration for production

3. **Container Security**
   - Keep Docker images updated
   - Run containers as non-root user
   - Scan images for vulnerabilities

### Monitoring & Logging

1. **Application Logs**
   ```bash
   # View application logs
   sudo docker-compose -f docker-compose.prod.yml logs -f app

   # View Nginx logs
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   ```

2. **System Monitoring**
   ```bash
   # Install monitoring tools
   sudo apt install htop iotop

   # Check system resources
   htop
   df -h
   sudo docker system df
   ```

3. **Health Monitoring**
   ```bash
   # Simple health check script
   #!/bin/bash
   if curl -f http://localhost:5000 > /dev/null 2>&1; then
       echo "Application is healthy"
   else
       echo "Application is down"
       # Send alert (integrate with monitoring service)
   fi
   ```

## 🔍 API Endpoints

### Users
- `GET /user` - Get all users
- `POST /user` - Create a new user

### Posts
- `GET /post` - Get all posts
- `POST /post` - Create a new post

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Domain name registered and configured
- [ ] AWS account created with billing enabled
- [ ] SSH key pair generated for EC2 access
- [ ] Application tested locally with Docker
- [ ] Environment variables configured for production
- [ ] Database schema finalized

### AWS Infrastructure Setup
- [ ] EC2 instance launched (Ubuntu 22.04 LTS)
- [ ] Elastic IP allocated and associated
- [ ] Security groups configured (ports 22, 80, 443)
- [ ] Route 53 hosted zone created
- [ ] DNS records configured (A record for domain)
- [ ] DNS propagation verified

### Server Configuration
- [ ] SSH connection established
- [ ] Server updated and packages installed
- [ ] Docker and Docker Compose installed
- [ ] Nginx installed and configured
- [ ] SSL certificate obtained (Let's Encrypt)
- [ ] Firewall configured (ufw)

### Application Deployment
- [ ] Repository cloned on server
- [ ] Production environment configured
- [ ] Docker containers built and running
- [ ] Application accessible via Nginx
- [ ] SSL/HTTPS working correctly
- [ ] Database migrations completed

### Security & Monitoring
- [ ] Security groups restricted to necessary ports
- [ ] SSH access restricted to specific IPs
- [ ] Strong database passwords configured
- [ ] SSL certificate auto-renewal configured
- [ ] Basic monitoring tools installed
- [ ] Application logs accessible

### Post-Deployment Testing
- [ ] HTTP to HTTPS redirect working
- [ ] Application endpoints responding
- [ ] Database connections working
- [ ] Basic functionality tested
- [ ] Performance monitoring active

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the UNLICENSED License.

## 📞 Support

For questions and support, please open an issue on GitHub.

## 🔄 Migration Notes

This template is designed to be a starting point. The API services are currently stubbed and need to be implemented with actual business logic. Update the controllers and services in `src/api/` to implement your specific requirements.