"# Stellar-LPool"

# Stellar Operations React App

This project is a React-based frontend that allows users to interact with the Stellar blockchain. The app provides functionalities to:

- Fund an account using the Stellar Friendbot service.
- Create a liquidity pool.
- Perform a token swap.
- Withdraw from a liquidity pool.

These operations are performed on the Stellar testnet using the `@stellar/stellar-sdk` library.

## Features

- **Generate Keypair**: Create a new keypair (public/private key pair) for Stellar operations.
- **Fund Account**: Fund a Stellar account using Friendbot, a service that provides testnet Lumens (XLM).
- **Create Liquidity Pool**: Create a liquidity pool on the Stellar testnet with a custom asset.
- **Perform Swap**: Swap assets using the liquidity pool.
- **Withdraw from Liquidity Pool**: Withdraw assets from a liquidity pool.

## Getting Started

## Prerequisites

- Make sure you have Node.js and npm installed on your machine.

- Node.js (>= 14.x)
- NPM (>= 6.x) or Yarn (>= 1.x)

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Chigozie0706/Stellar-LPool.git
   ```

   ```bash
   cd Stellar-LPool\stellar-defi-frontend
   ```

2. **Install dependencies:**

- If you're using NPM:

  ```bash
  npm install
  ```

3. **Run the application:**

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

# Usage

1. Generating a New Keypair
   Click the "Generate New Keypair" button to generate a new Stellar keypair. The public and secret keys will be logged in the status area.

2. Funding an Account
   Click the "Fund Account" button to fund the generated keypair using the Friendbot service.

3. Creating a Liquidity Pool
   Click the "Create Liquidity Pool" button to create a liquidity pool on the Stellar testnet. A custom asset is created, and the liquidity pool ID is logged in the status area.

4. Performing a Swap
   Enter the amount to swap and click the "Perform Swap" button to execute a swap operation within the created liquidity pool.

5. Withdrawing from a Liquidity Pool
   Enter the amount to withdraw and click the "Withdraw from Liquidity Pool" button to withdraw assets from the liquidity pool.

6. Viewing Transaction Links
   After each operation, a transaction link will be generated and displayed in the "Transaction Links" section. You can click the link to view the transaction details on the Stellar Explorer.

# Dependencies

- @mui/material: For UI components.
- @stellar/stellar-sdk: For interacting with the Stellar network.

### How to Use the `README.md`:

1. **Clone**: Use the instructions to clone the repository.
2. **Install Dependencies**: Follow the instructions to install the necessary packages using either `npm` or `yarn`.
3. **Run the App**: Start the development server and interact with the application at `http://localhost:5173/`.
4. **Explore**: Understand the functionality provided, including generating keypairs, funding accounts, creating liquidity pools, performing swaps, and withdrawing assets.

This README will help any developer or user set up and understand your Stellar Operations React app.
