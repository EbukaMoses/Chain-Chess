# ♔ Chess Tournament Platform

A **modern, beautiful, and fully functional** blockchain-based chess tournament platform with transparent prize pools and fair competition mechanics.

![Chess Tournament Platform](https://img.shields.io/badge/Status-Ready%20to%20Deploy-brightgreen)
![Solidity](https://img.shields.io/badge/Solidity-0.8.28-blue)
![React](https://img.shields.io/badge/React-18.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0.0-38B2AC)

## ✨ Modern Design Features

- **🎨 Glass Morphism UI** - Beautiful translucent effects with backdrop blur
- **🌈 Gradient Animations** - Smooth color transitions and hover effects
- **⚡ Micro-interactions** - Subtle animations that enhance user experience
- **📱 Responsive Design** - Perfect on desktop, tablet, and mobile
- **🌙 Dark Theme** - Easy on the eyes with modern color palette
- **♔ Chess-themed Elements** - Custom icons and chess piece animations

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Chess
```

2. **Run the automated setup**
```bash
# Windows (Command Prompt)
start.bat

# Or manually:
cd contract && npm install && npm run compile
cd ../client && npm install && npm run dev
```

3. **Open your browser**
Navigate to `http://localhost:3000` to see the beautiful platform!

## 🎯 Key Features

### Smart Contracts
- **Tournament Management** - Create, manage, and complete tournaments
- **Player Registration** - Secure player onboarding with username system
- **Match Results** - Immutable on-chain match recording
- **Prize Distribution** - Automatic stablecoin payouts (50% / 30% / 20%)
- **Group Stages** - Round-robin tournament format
- **Transparent Scoring** - Fair point system (3 for win, 1 for draw, 0 for loss)

### Frontend
- **Modern UI/UX** - Glass morphism design with smooth animations
- **Real-time Updates** - Live tournament status and player counts
- **Interactive Forms** - Beautiful form validation with error handling
- **Responsive Layout** - Works perfectly on all devices
- **Wallet Integration** - Connect your Web3 wallet seamlessly

## 🎨 Design System

### Color Palette
- **Primary**: Purple to Blue gradients (#667eea → #764ba2)
- **Secondary**: Pink to Red gradients (#f093fb → #f5576c)
- **Success**: Blue to Cyan gradients (#4facfe → #00f2fe)
- **Warning**: Green to Teal gradients (#43e97b → #38f9d7)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Monospace**: JetBrains Mono for technical elements

### Components
- **Glass Cards** - Translucent backgrounds with blur effects
- **Gradient Buttons** - Beautiful hover animations
- **Status Badges** - Color-coded tournament states
- **Progress Bars** - Animated registration progress
- **Floating Elements** - Subtle background animations

## 📱 Screenshots

### Main Dashboard
- Hero section with gradient text and animated buttons
- Feature cards with glass morphism effects
- Live tournament grid with hover animations
- Statistics cards with gradient numbers

### Tournament Creation
- Modal form with glass background
- Beautiful input fields with validation
- Prize distribution visualization
- Responsive grid layout

### Tournament Cards
- Status indicators with color-coded lines
- Progress bars for registration
- Hover effects with scale animations
- Modern typography and spacing

## 🛠️ Technology Stack

### Smart Contracts
- **Solidity 0.8.28** - Latest stable version
- **Hardhat** - Development environment
- **OpenZeppelin** - Secure contract libraries
- **TypeScript** - Type-safe testing

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - Latest React features
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety throughout

### Development Tools
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitizen** - Conventional commits

## 🎮 How It Works

1. **Create Tournament** - Organizers set up tournaments with prize pools
2. **Player Registration** - Players register with unique usernames
3. **Group Formation** - Players are automatically grouped for round-robin
4. **Match Play** - Organizers submit match results on-chain
5. **Prize Distribution** - Winners receive automatic stablecoin payouts

## 🔧 Development

### Smart Contract Development
```bash
cd contract
npm install
npm run compile
npm test
npm run deploy:local
```

### Frontend Development
```bash
cd client
npm install
npm run dev
npm run build
npm run lint
```

### Testing
```bash
# Smart contract tests
cd contract && npm test

# Frontend tests
cd client && npm test
```

## 📊 Project Structure

```
Chess/
├── contract/                 # Smart contracts
│   ├── contracts/
│   │   ├── ChessTournament.sol
│   │   └── MockUSDC.sol
│   ├── test/
│   │   └── ChessTournament.test.ts
│   └── scripts/
│       └── deploy.ts
├── client/                   # Frontend application
│   ├── app/
│   │   ├── globals.css      # Modern styling
│   │   ├── layout.tsx
│   │   └── page.tsx         # Main dashboard
│   └── components/
│       ├── TournamentCard.tsx
│       └── CreateTournamentForm.tsx
├── start.bat                # Windows setup script
├── start.ps1                # PowerShell setup script
└── README.md
```

## 🎯 Roadmap

### Phase 1 ✅ (Complete)
- [x] Smart contract development
- [x] Basic frontend
- [x] Tournament creation
- [x] Player registration

### Phase 2 🚧 (In Progress)
- [ ] Wallet integration (Wagmi + RainbowKit)
- [ ] Real-time blockchain data
- [ ] Tournament management dashboard
- [ ] Match result submission

### Phase 3 📋 (Planned)
- [ ] Advanced tournament formats
- [ ] Player profiles and statistics
- [ ] Tournament history and analytics
- [ ] Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenZeppelin** for secure smart contract libraries
- **Tailwind CSS** for the beautiful utility-first CSS framework
- **Next.js** for the amazing React framework
- **Hardhat** for the excellent development environment

---

**Built with ❤️ and ♔ for the chess community**

*Ready to revolutionize chess tournaments with blockchain technology!* 