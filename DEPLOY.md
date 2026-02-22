# Deployment Guide for TyrePlus Dealer App on EC2

This guide details the steps to deploy the `tyreplus-dealer-app` to an AWS EC2 instance.

## Prerequisites

- **EC2 Instance**: Amazon Linux 2023 or Ubuntu 22.04 LTS recommended.
- **Java 21**: The application requires JDK 21.
- **PostgreSQL**: A running PostgreSQL database (RDS or separate instance).
- **Redis**: *Temporarily disabled* (NOT required for current deployment).

## 1. Prepare the EC2 Instance

Connect to your EC2 instance via SSH:

```bash
ssh -i /path/to/key.pem ec2-user@your-ec2-ip
```

### Install Java 21

On Amazon Linux 2023:
```bash
sudo dnf install java-21-amazon-corretto -y
```

On Ubuntu:
```bash
sudo apt update
sudo apt install openjdk-21-jdk -y
```

Verify the installation:
```bash
java -version
```

## 2. Build the Application

You can build the JAR file locally and upload it, or build it on the server (requires Maven).

### Option A: Build Locally and Upload (Recommended)

1. **Build locally**:
   In your local project root:
   ```bash
   mvn clean package -DskipTests
   ```
   This creates `target/tyreplus-dealer-app-1.0.0-SNAPSHOT.jar`.

2. **Upload to EC2**:
   ```bash
   scp -i /path/to/key.pem target/tyreplus-dealer-app-1.0.0-SNAPSHOT.jar ec2-user@your-ec2-ip:~/app.jar
   ```

### Option B: Build on Server

1. **Install Maven**:
   ```bash
   sudo dnf install maven -y   # Amazon Linux
   # OR
   sudo apt install maven -y   # Ubuntu
   ```

2. **Clone and Build**:
   ```bash
   git clone <your-repo-url>
   cd tyreplus-dealer-app
   mvn clean package -DskipTests
   cp target/tyreplus-dealer-app-1.0.0-SNAPSHOT.jar ~/app.jar
   ```

## 3. Configuration

Set up environment variables. You should **never** hardcode secrets in the properties file.

Create a `.env` file or export variables in your shell profile (or systemd service).

**Required Environment Variables:**
- `DB_HOST`: Database hostname
- `DB_NAME`: Database name (e.g., `tyreplus_dealer_db`)
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: A long, secure random string for JWT signing
<!-- - `REDIS_HOST`: Redis hostname (Temporarily Disabled) -->
- `RAZORPAY_KEY_ID`: Production Razorpay Key ID
- `RAZORPAY_KEY_SECRET`: Production Razorpay Secret

## 4. Run the Application

To test if it works:

```bash
export DB_HOST=your-db-host
export DB_USER=your-db-user
export DB_PASSWORD=your-db-pass
# ... export other variables

java -jar app.jar --spring.profiles.active=prod
```

## 5. Setup Systemd Service (Production)

Create a systemd service to keep the app running in the background and restart on failure.

1. **Create service file**:
   ```bash
   sudo nano /etc/systemd/system/tyreplus-dealer.service
   ```

2. **Add content** (Replace placeholders):

   ```ini
   [Unit]
   Description=TyrePlus Dealer API
   After=network.target

   [Service]
   User=ec2-user
   WorkingDirectory=/home/ec2-user
   ExecStart=/usr/bin/java -jar /home/ec2-user/app.jar --spring.profiles.active=prod
   SuccessExitStatus=143
   Restart=always
   RestartSec=10
   
   # Environment Variables
   Environment="DB_HOST=your-rds-endpoint.amazonaws.com"
   Environment="DB_USER=postgres"
   Environment="DB_PASSWORD=secure_password"
   Environment="DB_NAME=tyreplus_dealer_db"
   Environment="JWT_SECRET=very_long_secure_secret_key_minimum_256_bits"
   # Environment="REDIS_HOST=your-redis-endpoint"
   Environment="RAZORPAY_KEY_ID=your_prod_key"
   Environment="RAZORPAY_KEY_SECRET=your_prod_secret"

   [Install]
   WantedBy=multi-user.target
   ```

3. **Start and enable the service**:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable tyreplus-dealer
   sudo systemctl start tyreplus-dealer
   ```

4. **Check status**:
   ```bash
   sudo systemctl status tyreplus-dealer
   ```

5. **View logs**:
   ```bash
   journalctl -u tyreplus-dealer -f
   ```

## 6. Security Group (Firewall)

Ensure your EC2 Security Group allows inbound traffic on port **8080** (or whichever port you configured) from your load balancer or client IP.
