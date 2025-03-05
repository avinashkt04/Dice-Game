"use client";

declare global {
  interface Window {
    ethereum?: any;
  }
}

import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import crypto from "crypto";
import { ethers } from "ethers";
import BettingSlider from "../components/BettingSlider";

export default function Game() {
  const [balance, setBalance] = useState<number>(0);
  const [clientSeed, setClientSeed] = useState<string | null>(null);
  const [betValue, setBetValue] = useState(0);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [serverSeed, setServerSeed] = useState<string | null>(null);
  const [hashedServerSeed, setHashedServerSeed] = useState<string | null>(null);
  const [fairnessVerified, setFairnessVerified] = useState<boolean | null>(
    null
  );

  const fetchBalance = async () => {
    const storedBalance = localStorage.getItem("balance");

    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const providerInstance = new ethers.BrowserProvider(
          window.ethereum as any
        );
        const signerInstance = await providerInstance.getSigner();
        const userAddress = await signerInstance.getAddress();
        const balanceWei = await providerInstance.getBalance(userAddress);
        const ethBalance = Number(ethers.formatEther(balanceWei));
        const convertedBalance = Math.floor(ethBalance * 1000); // Convert and round down to nearest whole number

        // Ensure stored balance is valid, and update if necessary
        if (!storedBalance || Number(storedBalance) !== convertedBalance) {
          setBalance(convertedBalance);
          localStorage.setItem("balance", convertedBalance.toString());
        } else {
          setBalance(Number(storedBalance));
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(1000); // Default balance if fetching fails
        localStorage.setItem("balance", "1000");
      }
    } else if (storedBalance) {
      setBalance(Number(storedBalance));
    } else {
      setBalance(1000);
      localStorage.setItem("balance", "1000");
    }
  };

  useEffect(() => {
    fetchBalance();

    // Generate random client seed
    const randomBytes = new Uint8Array(16);
    window.crypto.getRandomValues(randomBytes);
    const seed = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setClientSeed(seed);
  }, []);

  const handleClick = async () => {
    if (balance <= 0) {
      toast.error("Insufficient balance.");
      return;
    }

    if (betValue <= 0) {
      toast.error("Please select a bet amount");
      return;
    }

    if (!clientSeed) {
      toast.error("Client seed not generated yet.");
      return;
    }

    try {
      const response = await axios.post("/api/roll-dice", {
        clientSeed,
        betAmount: betValue,
        balance,
      });

      const { roll, message, newBalance, serverSeed, hashedServerSeed } =
        response.data;

      const roundedBalance = Math.floor(newBalance);

      setBalance(roundedBalance);
      localStorage.setItem("balance", roundedBalance.toString()); // Store as whole number
      setRollResult(roll);
      setMessage(message);
      setServerSeed(serverSeed);
      setHashedServerSeed(hashedServerSeed);
      setFairnessVerified(null);

      roll > 3 ? toast.success(message) : toast.error(message);
      setBetValue(0);
    } catch (error) {
      console.error("Error rolling dice:", error);
    }
  };

  const checkFairness = () => {
    if (!serverSeed || !hashedServerSeed || !clientSeed) {
      toast.error("No roll data available.");
      return;
    }

    const computedHash = crypto
      .createHash("sha256")
      .update(serverSeed)
      .digest("hex");

    if (computedHash === hashedServerSeed) {
      toast.success("Fairness verified: Roll is valid!");
      setFairnessVerified(true);
    } else {
      toast.error("Fairness check failed: Something is wrong!");
      setFairnessVerified(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button className="text-xl bg-teal-500 text-white px-4 py-2 rounded-lg mb-2">
        Balance: ${balance}
      </button>

      {/* Display Roll Result & Fairness Section */}
      {rollResult !== null && (
        <div className="bg-gray-800 text-white rounded-lg p-4 mb-4 shadow-lg text-center w-80">
          <p className="text-3xl font-bold">🎲 {rollResult}</p>
          <p
            className={`text-xl font-semibold mt-2 ${
              message === "You win!" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
          {serverSeed && hashedServerSeed && fairnessVerified === null && (
            <button
              onClick={checkFairness}
              className="mt-3 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-full"
            >
              Check Fairness
            </button>
          )}
          {fairnessVerified !== null && (
            <p
              className={`mt-2 text-lg font-semibold ${
                fairnessVerified ? "text-green-400" : "text-red-400"
              }`}
            >
              {fairnessVerified
                ? "✅ Fairness Verified!"
                : "❌ Fairness Check Failed!"}
            </p>
          )}
        </div>
      )}

      <p className="text-lg font-semibold text-gray-400 mb-2">
        Select Your Bet Amount
      </p>

      {/* Betting Slider */}
      <BettingSlider
        key={balance}
        balance={balance}
        sliderValue={betValue}
        setSliderValue={(val) => setBetValue(Math.floor(val))}
      />

      <p className="text-xl text-center mt-2 font-semibold">
        Bet Amount: ${betValue}
      </p>

      {/* Roll Button */}
      <button
        onClick={handleClick}
        className="mt-6 p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
      >
        Roll Dice
      </button>
    </div>
  );
}
