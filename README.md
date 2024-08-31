"# Stellar-LPool"

## Overview

Stellar-LPool is a liquidity pool dApp built on the Steller blockchain. It interacts with the Stellar blockchain testnet to perform various operations, including generating keypairs, funding accounts, creating and interacting with liquidity pools, and performing asset swaps. It utilizes the Stellar SDK to handle blockchain transactions and updates the user interface with transaction status and links.

These operations are performed on the Stellar testnet using the `@stellar/stellar-sdk` library.

## Proof of Transaction Actions

You can view and verify the transactions performed by this dApp using the following links:

- Transaction 1: [View Transaction](https://stellar.expert/explorer/testnet/tx/7352d1e2c32e27153a1453281d8db3e52ed5b144cec5c0e4c1c50f71d7db3762)
- Transaction 2: [View Transaction](https://stellar.expert/explorer/testnet/tx/61e3c220768fe259adb606cdfd78dfdcf437776018318f20ab05099e1a34aa5c)

## Links

- GitHub Repository: [https://github.com/Chigozie0706/Stellar-LPool](https://github.com/Chigozie0706/Stellar-LPool)
- Tweet/Post: [https://x.com/chigoziejacob1/status/1829900169070199035](https://x.com/chigoziejacob1/status/1829900169070199035)

## Features

- **Generate Keypair**: Generate a new Stellar keypair and display the public and secret keys.
- **Fund Account**: Fund a Stellar account using the Friendbot service.
- **Establish a New Liquidity Pool with a Custom Asset Pair**: Create a liquidity pool with custom and XLM assets.
- **Deposit Assets into the Liquidity Pool**: Deposit specified amounts of XLM and custom assets into the created liquidity pool.
- **Perform a Path Payment Using the Liquidity Pool**: Execute a path payment swap from XLM to a custom asset through the liquidity pool.
- **Withdraw from the Liquidity Pool and Analyze the Results**: Withdraw assets from the liquidity pool and review the results of the transaction.
- **Display Transaction Status**: Show the status of each transaction and provide links to the transactions on Stellar Expert.
- **Change Trust**: Add or update trust lines for assets involved in liquidity pools or swaps.
- **Manage Custom Assets**: Define and manage custom assets for use in liquidity pools or path payments.
- **Handle Errors and Notifications**: Provide feedback and error messages if transactions fail or require attention.
- **Clear Form Data**: Reset form fields and state variables after successful transactions to prepare for new operations.

## Getting Started

## Prerequisites

- Make sure you have Node.js and npm installed on your machine:

- Node.js (version 12 or higher): A JavaScript runtime that allows you to run JavaScript on your computer.
- npm (Node Package Manager): A tool that comes with Node.js to help you install and manage JavaScript packages.

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

## Usage

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

## Dependencies

- @mui/material: For UI components.
- @stellar/stellar-sdk: For interacting with the Stellar network.
- node-fetch

## Implementation

- This application uses the Stellar SDK to interact with the Stellar blockchain. It performs key operations such as generating keypairs, funding accounts, creating and managing liquidity pools, and executing swaps. Transactions are built and sent using the Stellar SDK's TransactionBuilder, and status updates are displayed to users.

- **Keypair Generation**: Uses Keypair.random() to generate new Stellar keypairs.
- **Account Funding**: Utilizes the Friendbot service to fund accounts on the testnet.
- **Liquidity Pool Management**: Creates and manages liquidity pools with custom assets and XLM.
- **Path Payments**: Executes swaps between XLM and custom assets.
- **Transaction Status**: Displays status updates and transaction links for user verification.

### How to Use the `README.md`:

1. **Clone**: Use the instructions to clone the repository.
2. **Install Dependencies**: Follow the instructions to install the necessary packages using either `npm` or `yarn`.
3. **Run the App**: Start the development server and interact with the application at `http://localhost:5173/`.
4. **Explore**: Understand the functionality provided, including generating keypairs, funding accounts, creating liquidity pools, performing swaps, and withdrawing assets.

This README will help any developer or user set up and understand your Stellar Operations React app.
