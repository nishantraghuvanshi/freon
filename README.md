# Freon 🔥

**Freon** is a decentralized social networking platform built on the Internet Computer (IC) blockchain, featuring an innovative cycles-based economy that rewards user engagement and content creation. Experience the future of social media where users truly own their data and earn value from their contributions.

## 📖 Project Overview

Freon combines the familiar experience of modern social networks with the revolutionary capabilities of blockchain technology. Built specifically for the Internet Computer, it leverages IC's unique features like reverse gas model, canister smart contracts, and native cycles economy to create a sustainable, user-owned social platform.

### 🎯 Vision
To create a decentralized social platform that empowers users through true ownership, fair value distribution, and censorship-resistant communication while maintaining the user experience expectations of modern social media.

## 🛠️ Tech Stack

### Backend
- **Motoko** - IC's native programming language for smart contracts
- **Internet Computer Protocol** - Decentralized cloud platform
- **Canister Architecture** - Scalable smart contract containers
- **Stable Memory** - Persistent data storage across upgrades

### Frontend
- **React** - Modern UI framework
- **JavaScript/ES6+** - Core programming language  
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **CSS3** - Styling and responsive design

### Development Tools
- **DFX** - IC SDK for local development and deployment
- **NPM/Node.js** - Package management and tooling
- **Internet Identity** - IC's native authentication system
- **Candid** - Interface description language for IC services

## ✨ Current Features (Implemented)

### 🔐 Authentication & Identity
- **Internet Identity Integration** - Secure, passwordless authentication
- **User Profiles** - Customizable profiles with avatars and bios
- **Principal-based Identity** - Cryptographic user identification

### 📱 Social Networking Core
- **Post Creation** - Text and image posts with 280 character limit
- **Global & Personal Feeds** - Dual feed system for content discovery
- **Like System** - Engagement through post likes
- **Following System** - Build personalized networks
- **Real-time Updates** - Automatic feed refresh every 30 seconds

### 💰 Cycles Economy (IC-Native)
- **Automatic Rewards** - Earn cycles for creating content and receiving engagement
  - 10 cycles for creating posts
  - 5 cycles for receiving likes
  - Starting balance of 1000 cycles for new users


### 🎨 User Experience
- **Responsive Design** - Optimized for desktop and mobile
- **Clean Interface** - Minimalist, distraction-free design
- **Fast Performance** - Optimized loading and smooth interactions
- **Progressive Loading** - Skeleton screens and smooth transitions

## 🚀 Core Future Implementations

### 📊 Advanced Social Features(Work In Progress)
- **Comments & Replies** - Threaded discussions on posts
- **Share/Repost System** - Content amplification mechanisms
- **Direct Messaging** - Private conversations between users
- **Group Communities** - Topic-based community creation
- **Content Moderation** - Community-driven governance tools

### 🏆 Enhanced Cycles Economy(Work In Progress)
- **Premium Features** - Spend cycles for enhanced functionality
  - Post boosting for increased visibility
  - Extended character limits
  - Priority support
  - Advanced analytics
- **Creator Monetization** - Revenue sharing for content creators
- **Staking Mechanisms** - Earn passive income through participation
- **Governance Tokens** - Platform decision-making participation

### 🔧 Platform & Infrastructure
- **Advanced Search** - Full-text search across posts and users
- **Content Discovery** - Algorithm-driven recommendations
- **Analytics Dashboard** - Detailed insights for users and creators
- **Mobile Application** - Native iOS and Android apps
- **API Ecosystem** - Third-party developer integration

## 🌐 Future Internet Computer & Blockchain Features

### 🔒 Advanced IC Integration
- **Internet Identity Extensions** - Multi-device authentication and recovery
- **Cross-Canister Communication** - Integration with other IC services
- **SNS Integration** - Service Nervous System for decentralized governance
- **Threshold ECDSA** - Native Bitcoin and Ethereum integration
- **HTTPS Outcalls** - Direct integration with external APIs and services

### 💎 Blockchain Innovations
- **NFT Integration** - Profile pictures and collectible content
- **Multi-Chain Bridge** - Connect with Ethereum, Bitcoin, and other networks
- **DeFi Integration** - Lending, borrowing, and yield farming with cycles
- **DAO Governance** - Fully decentralized platform governance
- **Verifiable Credentials** - Trust and reputation systems

### 🌍 Decentralization & Scalability
- **Subnet Scaling** - Horizontal scaling across IC subnets
- **Content Delivery** - Distributed content storage and delivery
- **Edge Computing** - Regional content caching and processing
- **Interoperability** - Cross-platform and cross-chain communication

## 🏃‍♂️ Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **NPM** (v7 or higher)
- **DFX** (Internet Computer SDK)

### Installation

1. **Install DFX (Internet Computer SDK)**
   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```

2. **Clone the Repository**
   ```bash
   git clone https://github.com/nishantraghuvanshi/freon.git
   cd freon
   ```

3. **Install Dependencies**
   ```bash
   npm install
   cd src/freon_frontend
   npm install
   cd ../..
   ```

### 🚀 Running Locally

1. **Start the Internet Computer Local Network**
   ```bash
   dfx start --background
   ```

2. **Deploy Canisters**
   ```bash
   dfx deploy
   ```

3. **Access the Application**
   Open your browser and navigate to the URL provided by DFX (typically):
   ```
   http://localhost:4943/?canisterId=<frontend_canister_id>
   ```

### 🔧 Development Commands

- **Build Backend** - `dfx build freon_backend`
- **Build Frontend** - `dfx build freon_frontend`
- **Generate Type Declarations** - `dfx generate`
- **Reset Local State** - `dfx start --clean`
- **View Candid Interface** - Visit the backend canister URL in browser

### 📱 Frontend Development

For rapid frontend development with hot reload:

```bash
cd src/freon_frontend
npm run dev
```

This starts a development server with hot module replacement for faster iteration.

## 🏗️ Project Structure

```
freon/
├── src/
│   ├── freon_backend/           # Motoko backend canister
│   │   └── main.mo             # Core business logic
│   ├── freon_frontend/         # React frontend application
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── pages/          # Application pages
│   │   │   ├── context/        # React context providers
│   │   │   └── styles/         # Styling and themes
│   │   └── public/             # Static assets
│   └── declarations/           # Generated type declarations
├── dfx.json                    # IC project configuration
├── package.json               # Node.js dependencies
└── README.md                  # Project documentation
```

## 🤝 Contributing

We welcome contributions from the community! Please read our contributing guidelines and submit pull requests for any improvements.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo** - [Coming Soon]
- **Documentation** - [Internet Computer Docs](https://internetcomputer.org/docs)
- **Motoko Language** - [Motoko Documentation](https://internetcomputer.org/docs/current/motoko/main/motoko)
- **Internet Identity** - [Authentication Guide](https://internetcomputer.org/docs/current/tokenomics/identity-auth/what-is-ic-identity)

## 📞 Support

For questions, issues, or contributions, please:
- Open an issue on GitHub
- Join the Internet Computer developer community
- Follow the project for updates

---

**Built with ❤️ on the Internet Computer**

*Empowering users through decentralized social networking and economic sovereignty.*
