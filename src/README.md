# FinaryApp - Finance Diary

A beautiful and modern financial tracking application built with React, TypeScript, and Tailwind CSS.

## Features

- 📊 **Transaction Management**: Track income and expenses with detailed categories
- 📈 **Visual Analytics**: Pie and bar charts for spending analysis
- 🌓 **Dark/Light Theme**: Beautiful day and night themes
- 🌐 **Multi-language**: Support for Indonesian and English
- 👤 **Multi-Account**: Manage multiple financial accounts
- 🔐 **Secure Login**: Account-based authentication system
- 📱 **Responsive Design**: Works perfectly on mobile and desktop
- ✨ **Beautiful UI**: Glassmorphism design with smooth animations

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **Lucide React** - Icon library
- **LocalStorage** - Data persistence

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd finary-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect the settings
6. Click "Deploy"

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Project Structure

```
finary-app/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Background.tsx
│   │   ├── LoginPage.tsx
│   │   └── AccountManager.tsx
│   ├── constants/       # Constants and translations
│   │   └── index.ts
│   ├── contexts/        # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/           # Custom React hooks
│   │   └── useTransactions.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── formatters.ts
│   │   └── transactions.ts
│   ├── App.tsx          # Main application component
│   ├── index.tsx        # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
├── vercel.json          # Vercel deployment configuration
└── README.md            # This file
```

## Features Guide

### Creating an Account

1. Open the app
2. Click "Register"
3. Enter your email, password, and name
4. Click "Register" button

### Adding Transactions

1. Click the floating "+" button (mobile) or "Add New" button (desktop)
2. Select transaction type (Income/Expense)
3. Choose category
4. Enter amount and date
5. Add optional note
6. Click "Save"

### Switching Accounts

1. Go to Settings
2. Scroll to "Account Management"
3. Click on any account to switch
4. Or click "Logout" to return to login page

### Viewing Reports

1. Click "Reports" in navigation
2. Select a month from the archive
3. View detailed ledger with opening balance and transactions

### Customization

- Change theme in Settings (Light/Dark)
- Switch language (Indonesian/English)
- Customize greeting messages
- Edit your profile name

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Author

Created by mhalwiii

---

For support or questions, please open an issue on GitHub.
