import React, { useState } from "react";
import {
  Keypair,
  SorobanRpc,
  TransactionBuilder,
  Asset,
  Operation,
  LiquidityPoolAsset,
  getLiquidityPoolId,
  BASE_FEE,
  Networks,
} from "@stellar/stellar-sdk";

const DeFiApp = () => {
  const [logs, setLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const logMessage = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const server = new SorobanRpc.Server("https://soroban-testnet.stellar.org");
  const defiKeypair = Keypair.random();
  const secretKey = defiKeypair.secret();

  const fundAccountWithFriendbot = async (address) => {
    const friendbotUrl = `https://friendbot.stellar.org?addr=${address}`;
    try {
      let response = await fetch(friendbotUrl);
      if (response.ok) {
        logMessage(`Account ${address} successfully funded.`);
        return true;
      } else {
        logMessage(`Something went wrong funding account: ${address}.`);
        return false;
      }
    } catch (error) {
      logMessage(`Error funding account ${address}: ${error}`);
      return false;
    }
  };

  const createLiquidityPool = async (defiKeypair, defiAccount, server) => {
    const ekoLanceAsset = new Asset("EkoLance", defiKeypair.publicKey());
    const lpAsset = new LiquidityPoolAsset(Asset.native(), ekoLanceAsset, 30);
    const liquidityPoolId = getLiquidityPoolId(
      "constant_product",
      lpAsset
    ).toString("hex");

    logMessage(`Custom Asset: ${ekoLanceAsset}`);
    logMessage(`Liquidity Pool Asset: ${lpAsset}`);
    logMessage(`Liquidity Pool ID: ${liquidityPoolId}`);

    const lpDepositTransaction = new TransactionBuilder(defiAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(Operation.changeTrust({ asset: lpAsset }))
      .addOperation(
        Operation.liquidityPoolDeposit({
          liquidityPoolId: liquidityPoolId,
          maxAmountA: "100",
          maxAmountB: "100",
          minPrice: { n: 1, d: 1 },
          maxPrice: { n: 1, d: 1 },
        })
      )
      .setTimeout(30)
      .build();

    lpDepositTransaction.sign(defiKeypair);
    const result = await server.sendTransaction(lpDepositTransaction);
    logMessage(
      `Liquidity Pool Created. Transaction URL: https://stellar.expert/explorer/testnet/tx/${result.hash}`
    );

    return liquidityPoolId;
  };

  const performSwap = async (
    traderKeypair,
    traderAccount,
    ekoLanceAsset,
    server
  ) => {
    const pathPaymentTransaction = new TransactionBuilder(traderAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.changeTrust({
          asset: ekoLanceAsset,
          source: traderKeypair.publicKey(),
        })
      )
      .addOperation(
        Operation.pathPaymentStrictReceive({
          sendAsset: Asset.native(),
          sendMax: "1000",
          destination: traderKeypair.publicKey(),
          destAsset: ekoLanceAsset,
          destAmount: "50",
          source: traderKeypair.publicKey(),
        })
      )
      .setTimeout(30)
      .build();

    pathPaymentTransaction.sign(traderKeypair);
    const result = await server.sendTransaction(pathPaymentTransaction);
    logMessage(
      `Swap Performed. Transaction URL: https://stellar.expert/explorer/testnet/tx/${result.hash}`
    );
  };

  const withdrawFromLiquidityPool = async (
    defiKeypair,
    defiAccount,
    liquidityPoolId,
    server
  ) => {
    const lpWithdrawTransaction = new TransactionBuilder(defiAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.liquidityPoolWithdraw({
          liquidityPoolId: liquidityPoolId,
          amount: "50",
          minAmountA: "0",
          minAmountB: "0",
        })
      )
      .setTimeout(30)
      .build();

    lpWithdrawTransaction.sign(defiKeypair);
    const result = await server.sendTransaction(lpWithdrawTransaction);
    logMessage(
      `Withdrawal Successful. Transaction URL: https://stellar.expert/explorer/testnet/tx/${result.hash}`
    );
  };

  const runDeFiOperations = async () => {
    setIsProcessing(true);
    try {
      const server = new SorobanRpc.Server(
        "https://soroban-testnet.stellar.org"
      );
      const defiKeypair = Keypair.random();
      const secretKey = defiKeypair.secret();

      logMessage(`DeFi Provider Public Key: ${defiKeypair.publicKey()}`);
      logMessage(`DeFi Provider Private Key: ${secretKey}`);
      await fundAccountWithFriendbot(defiKeypair.publicKey());
      const defiAccount = await server.getAccount(defiKeypair.publicKey());

      const liquidityPoolId = await createLiquidityPool(
        defiKeypair,
        defiAccount,
        server
      );

      const traderKeypair = Keypair.random();
      logMessage(`Trader Public Key: ${traderKeypair.publicKey()}`);
      await fundAccountWithFriendbot(traderKeypair.publicKey());
      const traderAccount = await server.getAccount(traderKeypair.publicKey());

      const ekoLanceAsset = new Asset("EkoLance", defiKeypair.publicKey());
      await performSwap(traderKeypair, traderAccount, ekoLanceAsset, server);

      await withdrawFromLiquidityPool(
        defiKeypair,
        defiAccount,
        liquidityPoolId,
        server
      );
    } catch (error) {
      logMessage(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="defi-app">
      <h1>DeFi Operations on Stellar</h1>
      <button onClick={runDeFiOperations} disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Run DeFi Operations"}
      </button>
      <div className="logs">
        {logs.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
};

export default DeFiApp;
