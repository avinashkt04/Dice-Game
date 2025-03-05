import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// generate a random number between 1 and 6
function generateRoll(serverSeed: string, clientSeed: string) {
  const combined = serverSeed + clientSeed;
  const hash = crypto.createHash("sha256").update(combined).digest("hex");
  return (parseInt(hash.slice(0, 6), 16) % 6) + 1;
}

export async function POST(req: NextRequest) {
  const { betAmount, balance, clientSeed } = await req.json();

  // validate balance
  if (balance === 0) {
    return NextResponse.json(
      { error: "Insufficient balance." },
      { status: 400 }
    );
  }

  // validate bet amount
  if (betAmount === 0) {
    return NextResponse.json(
      { error: "Please select a bet amount." },
      { status: 400 }
    );
  }

  // validate inputs
  if (!clientSeed) {
    return NextResponse.json(
      { error: "Invalid input. Please try again." },
      { status: 400 }
    );
  }

  try {
    // generate serverSeed and hashedServerSeed 
    const serverSeed = crypto.randomBytes(16).toString("hex");
    const hashedServerSeed = crypto
      .createHash("sha256")
      .update(serverSeed)
      .digest("hex");

    // generate a roll
    const roll = generateRoll(serverSeed, clientSeed);
    let newBalance = balance;
    let message = "";

    // if roll is greater than 3, player wins else player loses
    if (roll > 3) {
      newBalance += betAmount;
      message = "You win!";
    } else {
      newBalance -= betAmount;
      message = "You lose!";
    }

    // return 
    return NextResponse.json({
      roll,
      message, 
      newBalance, 
      hashedServerSeed, 
      serverSeed
    });
  } catch (error) {
    console.error("Error rolling dice:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
