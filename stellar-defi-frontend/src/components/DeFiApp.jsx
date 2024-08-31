import React, { useState } from "react";
import { TextField, Button, Box, Typography, Link, Grid } from "@mui/material";
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

const server = new SorobanRpc.Server("https://soroban-testnet.stellar.org");

const StellarOperations = () => {
  const [secretKey, setSecretKey] = useState("");
  const [amount, setAmount] = useState("");
  const [swapAmount, setSwapAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [defiKeypair, setDefiKeypair] = useState(Keypair.random());
  const [transactionLinks, setTransactionLinks] = useState([]);

  // const logMessage = (message) => {
  //   setStatus((prevStatus) => `${prevStatus}\n${message}`);
  // };

  const logMessage = (message, hash) => {
    setStatus((prevStatus) => `${prevStatus}\n${message}`);
    if (hash) {
      setTransactionLinks((prevLinks) => [
        ...prevLinks,
        `https://stellar.expert/explorer/testnet/tx/${hash}`,
      ]);
    }
  };

  const generateKeypair = () => {
    const newKeypair = Keypair.random();
    setDefiKeypair(newKeypair);
    setSecretKey(newKeypair.secret());
    logMessage(`New keypair generated. Public Key: ${newKeypair.publicKey()}`);
  };

  const fundAccountWithFriendbot = async () => {
    const address = defiKeypair.publicKey();
    const friendbotUrl = `https://friendbot.stellar.org?addr=${address}`;
    try {
      setIsProcessing(true);
      let response = await fetch(friendbotUrl);
      if (response.ok) {
        logMessage(`Account ${address} successfully funded.`);
      } else {
        logMessage(`Something went wrong funding account: ${address}.`);
      }
    } catch (error) {
      logMessage(`Error funding account ${address}: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const createLiquidityPool = async () => {
    try {
      setIsProcessing(true);
      const defiAccount = await server.getAccount(defiKeypair.publicKey());
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
    } catch (error) {
      logMessage(`Error creating liquidity pool: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const performSwap = async () => {
    try {
      setIsProcessing(true);
      const traderKeypair = Keypair.fromSecret(secretKey);
      const traderAccount = await server.getAccount(traderKeypair.publicKey());
      const ekoLanceAsset = new Asset("EkoLance", traderKeypair.publicKey());

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
            destAmount: swapAmount,
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
    } catch (error) {
      logMessage(`Error performing swap: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const withdrawFromLiquidityPool = async () => {
    try {
      setIsProcessing(true);
      const defiAccount = await server.getAccount(defiKeypair.publicKey());
      const ekoLanceAsset = new Asset("EkoLance", defiKeypair.publicKey());
      const lpAsset = new LiquidityPoolAsset(Asset.native(), ekoLanceAsset, 30);
      const liquidityPoolId = getLiquidityPoolId(
        "constant_product",
        lpAsset
      ).toString("hex");

      const lpWithdrawTransaction = new TransactionBuilder(defiAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.liquidityPoolWithdraw({
            liquidityPoolId: liquidityPoolId,
            amount: withdrawAmount,
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
    } catch (error) {
      logMessage(`Error withdrawing from liquidity pool: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex ">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="contained"
              onClick={generateKeypair}
              sx={{ mb: 2 }}
            >
              Generate New Keypair
            </Button>

            <Button
              variant="contained"
              onClick={fundAccountWithFriendbot}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Fund Account"}
            </Button>

            <Button
              variant="contained"
              onClick={createLiquidityPool}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Create Liquidity Pool"}
            </Button>

            <TextField
              label="Amount to Swap"
              type="number"
              value={swapAmount}
              onChange={(e) => setSwapAmount(e.target.value)}
              required
            />

            <Button
              variant="contained"
              onClick={performSwap}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Perform Swap"}
            </Button>

            <TextField
              label="Amount to Withdraw"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              onClick={withdrawFromLiquidityPool}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Withdraw from Liquidity Pool"}
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6" gutterBottom>
              Transaction Links
            </Typography>

            {status && <pre>{status}</pre>}

            {transactionLinks.map((link, index) => (
              <Typography key={index}>
                <Link href={link} target="_blank" rel="noopener noreferrer">
                  Transaction {index + 1}
                </Link>
              </Typography>
            ))}
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default StellarOperations;
