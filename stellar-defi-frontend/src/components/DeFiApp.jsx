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
  const [assetName, setAssetName] = useState("");
  const [liquidityPoolId, setLiquidityPoolId] = useState("");
  const [xlmAmount, setXlmAmount] = useState("");
  const [customAssetAmount, setCustomAssetAmount] = useState("");
  const [generateKeypairProcessing, setGenerateKeypairProcessing] =
    useState(false);
  const [fundAccountProcessing, setFundAccountProcessing] = useState(false);
  const [createLiquidityPoolProcessing, setCreateLiquidityPoolProcessing] =
    useState(false);
  const [performSwapProcessing, setPerformSwapProcessing] = useState(false);
  const [withdrawProcessing, setWithdrawProcessing] = useState(false);

  const logMessage = (message, result) => {
    setStatus((prevStatus) => `${prevStatus}\n${message}`);
    if (result) {
      setTransactionLinks((prevLinks) => [
        ...prevLinks,
        `https://stellar.expert/explorer/testnet/tx/${result.hash}`,
      ]);
    }
  };

  const generateKeypair = () => {
    setGenerateKeypairProcessing(true);
    try {
      const newKeypair = Keypair.random();
      setDefiKeypair(newKeypair);
      setSecretKey(newKeypair.secret());
      logMessage(
        `New keypair generated. Public Key: ${newKeypair.publicKey()}`
      );
    } finally {
      setGenerateKeypairProcessing(false);
    }
  };

  const fundAccountWithFriendbot = async () => {
    const address = defiKeypair.publicKey();
    const friendbotUrl = `https://friendbot.stellar.org?addr=${address}`;

    try {
      setFundAccountProcessing(true);
      let response = await fetch(friendbotUrl);
      if (response.ok) {
        logMessage(`Account ${address} successfully funded.`);
      } else {
        logMessage(`Something went wrong funding account: ${address}.`);
      }
    } catch (error) {
      logMessage(`Error funding account ${address}: ${error}`);
    } finally {
      setFundAccountProcessing(false);
    }
  };

  const createLiquidityPool = async () => {
    try {
      setCreateLiquidityPoolProcessing(true);
      const defiAccount = await server.getAccount(defiKeypair.publicKey());
      const customAsset = new Asset("LPool", defiKeypair.publicKey());
      const lpAsset = new LiquidityPoolAsset(Asset.native(), customAsset, 30);
      const liquidityPoolId = getLiquidityPoolId(
        "constant_product",
        lpAsset
      ).toString("hex");

      setLiquidityPoolId(liquidityPoolId);

      logMessage(`Custom Asset: ${customAsset}`);
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
            maxAmountA: xlmAmount,
            maxAmountB: customAssetAmount,
            minPrice: { n: 1, d: 1 },
            maxPrice: { n: 1, d: 1 },
          })
        )
        .setTimeout(30)
        .build();

      lpDepositTransaction.sign(defiKeypair);
      const result = await server.sendTransaction(lpDepositTransaction);
      logMessage(
        `Liquidity Pool Created. Transaction URL: https://stellar.expert/explorer/testnet/tx/${result.hash}`,
        result
      );

      setAssetName("");
      setXlmAmount("");
      setCustomAssetAmount("");
    } catch (error) {
      logMessage(`Error creating liquidity pool: ${error.message}`);
    } finally {
      setCreateLiquidityPoolProcessing(false);
    }
  };

  const performSwap = async () => {
    try {
      setPerformSwapProcessing(true);
      const traderKeypair = Keypair.fromSecret(secretKey);
      const traderAccount = await server.getAccount(traderKeypair.publicKey());
      const customAsset = new Asset("LPool", traderKeypair.publicKey());

      const pathPaymentTransaction = new TransactionBuilder(traderAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.changeTrust({
            asset: customAsset,
            source: traderKeypair.publicKey(),
          })
        )
        .addOperation(
          Operation.pathPaymentStrictReceive({
            sendAsset: Asset.native(),
            sendMax: "1000",
            destination: traderKeypair.publicKey(),
            destAsset: customAsset,
            destAmount: swapAmount,
            source: traderKeypair.publicKey(),
          })
        )
        .setTimeout(30)
        .build();

      pathPaymentTransaction.sign(traderKeypair);
      const result = await server.sendTransaction(pathPaymentTransaction);
      logMessage(
        `Swap Performed. Transaction URL: https://stellar.expert/explorer/testnet/tx/${result.hash}`,
        result
      );

      setSwapAmount("");
    } catch (error) {
      logMessage(`Error performing swap: ${error.message}`);
    } finally {
      setPerformSwapProcessing(false);
    }
  };

  const withdrawFromLiquidityPool = async () => {
    try {
      setWithdrawProcessing(true);
      const defiAccount = await server.getAccount(defiKeypair.publicKey());
      const customAsset = new Asset("LPool", defiKeypair.publicKey());
      const lpAsset = new LiquidityPoolAsset(Asset.native(), customAsset, 30);
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
        `Withdrawal Successful. Transaction URL: https://stellar.expert/explorer/testnet/tx/${result.hash}`,
        result
      );
      setWithdrawAmount("");
    } catch (error) {
      logMessage(`Error withdrawing from liquidity pool: ${error.message}`);
    } finally {
      setWithdrawProcessing(false);
    }
  };

  return (
    <div className="flex">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="contained"
              onClick={generateKeypair}
              disabled={generateKeypairProcessing}
              sx={{ mb: 2 }}
            >
              {generateKeypairProcessing
                ? "Generating Keypair..."
                : "Generate New Keypair"}
            </Button>
            <Button
              variant="contained"
              onClick={fundAccountWithFriendbot}
              disabled={fundAccountProcessing}
            >
              {fundAccountProcessing ? "Funding Account..." : "Fund Account"}
            </Button>

            <TextField
              label="Custom Asset Name"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              fullWidth
            />

            <TextField
              label="XLM Deposit Amount"
              type="number"
              value={xlmAmount}
              onChange={(e) => setXlmAmount(e.target.value)}
              required
            />
            <TextField
              label="Custom Asset Deposit Amount"
              type="number"
              value={customAssetAmount}
              onChange={(e) => setCustomAssetAmount(e.target.value)}
              required
            />

            <Button
              variant="contained"
              onClick={createLiquidityPool}
              disabled={createLiquidityPoolProcessing}
            >
              {createLiquidityPoolProcessing
                ? "Creating Liquidity Pool..."
                : "Create Liquidity Pool"}
            </Button>

            <TextField
              label="Liquidity Pool ID"
              value={liquidityPoolId}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              margin="normal"
            />

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
              disabled={performSwapProcessing}
            >
              {performSwapProcessing ? "Performing Swap..." : "Perform Swap"}
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
              disabled={withdrawProcessing}
              style={{ marginBottom: "12px" }}
            >
              {withdrawProcessing
                ? "Withdrawing..."
                : "Withdraw from Liquidity Pool"}
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6" gutterBottom>
              Latest Log
            </Typography>
            {status && <pre>{status}</pre>}

            <Typography variant="h6" gutterBottom>
              Transaction Links
            </Typography>

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
