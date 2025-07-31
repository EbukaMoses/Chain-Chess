# 🚀 Chess Tournament Platform - Quick Start

## ⚠️ Important: PowerShell Execution Policy Issue

If you're getting this error:
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

**Solution 1: Fix PowerShell Execution Policy**
```powershell
# Run PowerShell as Administrator and execute:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Solution 2: Use Command Prompt Instead**
```cmd
# Open Command Prompt (cmd.exe) instead of PowerShell
# Then run the commands below
```

## 🎯 Quick Setup (Choose Your Method)

### Method 1: Automated Script (Recommended)
```bash
# Double-click start.bat or run in Command Prompt:
start.bat
```

### Method 2: Manual Setup
```bash
# Step 1: Smart Contracts
cd contract
npm install
npm run compile

# Step 2: Frontend
cd ../client
npm install
npm run dev
```

### Method 3: Using Command Prompt
```cmd
# Open Command Prompt (not PowerShell)
# Navigate to your project folder
cd D:\DEV\SOLIDITY\PROJECTS\Chess

# Run the setup
start.bat
```

## ✅ What You'll Get

After successful setup:
- **Frontend**: http://localhost:3000
- **Smart Contracts**: Compiled and ready
- **Mock USDC**: Deployed for testing
- **Tournament System**: Fully functional

## 🎮 How to Use

1. **Open your browser** and go to `http://localhost:3000`
2. **Create a tournament** by clicking "Create Tournament"
3. **Register players** for tournaments
4. **Manage matches** and track results
5. **Distribute prizes** automatically

## 🔧 If You Still Have Issues

### Check Your Environment
```bash
node --version    # Should be 16 or higher
npm --version     # Should be 8 or higher
```

### Alternative: Use Yarn
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

### Alternative: Use Git Bash
```bash
# If you have Git installed, use Git Bash terminal
# It doesn't have PowerShell execution policy restrictions
```

## 📞 Need Help?

1. Check the `TROUBLESHOOTING.md` file
2. Make sure you're using Command Prompt or fixed PowerShell
3. Verify Node.js is properly installed
4. Try the manual setup steps above

## 🎉 Success!

Once everything is running, you'll have a fully functional:
- ✅ Blockchain-based chess tournament platform
- ✅ Smart contract system with stablecoin prizes
- ✅ Modern React frontend
- ✅ Complete tournament management system
- ✅ Automated prize distribution

**Happy coding! ♔** 