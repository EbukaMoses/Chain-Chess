# Chess Tournament Platform - Troubleshooting Guide

## Common Issues and Solutions

### 1. Node.js Version Issues

**Problem**: "npm is not recognized" or version compatibility errors

**Solution**:
```bash
# Check Node.js version (should be 16 or higher)
node --version

# If Node.js is not installed, download from:
# https://nodejs.org/en/download/
```

### 2. PowerShell Execution Policy

**Problem**: "File cannot be loaded because running scripts is disabled"

**Solution**:
```powershell
# Run PowerShell as Administrator and execute:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try running the script again
.\start.ps1
```

### 3. Port 3000 Already in Use

**Problem**: "Port 3000 is already in use"

**Solution**:
```bash
# Option 1: Kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Use a different port
cd client
npm run dev -- -p 3001
```

### 4. Hardhat Compilation Issues

**Problem**: "Compilation failed" or "Cannot find module"

**Solution**:
```bash
cd contract

# Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# Clean Hardhat cache
npx hardhat clean

# Recompile
npm run compile
```

### 5. Frontend Build Issues

**Problem**: "Module not found" or TypeScript errors

**Solution**:
```bash
cd client

# Clean and reinstall
rm -rf node_modules package-lock.json .next
npm install

# Clear Next.js cache
npm run dev -- --clear
```

### 6. Network Connection Issues

**Problem**: "Failed to fetch" or connection timeouts

**Solution**:
```bash
# Check if you're behind a corporate firewall
# Try using a different network or VPN

# For npm registry issues:
npm config set registry https://registry.npmjs.org/
```

### 7. Memory Issues

**Problem**: "JavaScript heap out of memory"

**Solution**:
```bash
# Increase Node.js memory limit
set NODE_OPTIONS=--max-old-space-size=4096

# Then run your commands
npm install
npm run dev
```

### 8. Git Issues

**Problem**: "Git is not recognized"

**Solution**:
```bash
# Download and install Git from:
# https://git-scm.com/download/win

# Restart your terminal after installation
```

## Manual Setup Steps

If the automated scripts don't work, follow these manual steps:

### Step 1: Smart Contracts
```bash
cd contract
npm install
npm run compile
npm test
```

### Step 2: Frontend
```bash
cd client
npm install
npm run dev
```

### Step 3: Verify Installation
- Open http://localhost:3000 in your browser
- You should see the Chess Tournament Platform homepage

## Environment Requirements

- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **Git**: Latest version
- **Windows**: Windows 10 or higher
- **RAM**: At least 4GB available
- **Disk Space**: At least 2GB free space

## Getting Help

If you're still experiencing issues:

1. **Check the console output** for specific error messages
2. **Verify your Node.js version**: `node --version`
3. **Check npm version**: `npm --version`
4. **Ensure you're in the correct directory** when running commands
5. **Try running commands individually** instead of using the script

## Alternative Setup Methods

### Using Yarn (if npm fails)
```bash
# Install Yarn globally
npm install -g yarn

# Then use yarn instead of npm
cd contract
yarn install
yarn compile

cd ../client
yarn install
yarn dev
```

### Using Docker (Advanced)
```bash
# If you have Docker installed, you can use:
docker-compose up
```

## Performance Tips

1. **Close unnecessary applications** to free up memory
2. **Use an SSD** for faster file operations
3. **Disable antivirus scanning** for the project directory
4. **Use a wired internet connection** for faster downloads

## Contact Support

If none of these solutions work, please:
1. Copy the exact error message
2. Note your system specifications
3. Describe the steps you followed
4. Create an issue in the project repository 