// 1. Deposit some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. check if the user won
// 6. give the user their winnings
// 7. play again

const prompt = require("prompt-sync")(); // for synchronous command-line input.

const ROWS = 3;
const COLS = 3;

const SYMBOL_COUNT = {
  "🍒": 5,
  "🍋": 4,
  "🍊": 3,
  "🍉": 2,
  "🍓": 1,
  "🍇": 6,
  "💎": 2,
  "🔔": 3,
};

const SYMBOL_VALUE = {
  "🍒": 10,
  "🍋": 8,
  "🍊": 7,
  "🍉": 6,
  "🍓": 5,
  "🍇": 4,
  "💎": 15,
  "🔔": 12,
};

// Function to deposit money into the account
const deposit = () => {
  while (true) {
    const depositMoney = prompt("Enter a deposit amount: ");
    const numDepositMoney = parseFloat(depositMoney);

    if (numDepositMoney <= 0 || isNaN(numDepositMoney)) {
      console.log("This is an invalid amount");
    } else {
      return numDepositMoney;
    }
  }
};

// Function to get the number of lines the player wants to bet on
const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("Enter number of Lines you wanna bet on (1-3): ");
    const numLines = parseInt(lines);

    if (numLines <= 0 || isNaN(numLines) || numLines > 3) {
      console.log("Invalid, Enter number of lines in range of (1-3)");
    } else {
      return numLines;
    }
  }
};

// Function to collect the betting amount per line
const getBet = (depositAmount, numberOfLines) => {
  while (true) {
    const bet = prompt("Enter betting amount(per line): ");
    const numBet = parseFloat(bet);

    if (
      numBet <= 0 ||
      isNaN(numBet) ||
      numBet > depositAmount / numberOfLines
    ) {
      console.log("Invalid betting amount, try again.");
    } else {
      return numBet;
    }
  }
};

// Function to randomly spin the reels and generate slot symbols
const spin = () => {
  const symbols = []; //we form an array with all the existing symbol
  for (const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const tempReel = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * tempReel.length);
      reels[i].push(tempReel[randomIndex]);
      tempReel.slice(randomIndex, 1);
    }
  }

  return reels;
};

// Function to transpose the reel grid for easier row-based evaluation
const transpose = (reels) => {
  const trans = [];
  for (let i = 0; i < ROWS; i++) {
    trans.push([]);
    for (let j = 0; j < COLS; j++) {
      trans[i].push(reels[j][i]);
    }
  }
  return trans;
};

const printRows = (trans) => {
  for (const row of trans) {
    let string = "";
    for (const [i, symbol] of row.entries()) {
      string += symbol;
      if (i != trans.length - 1) {
        string += "  | ";
      }
    }
    console.log(string);
  }
};

/// Function to transpose the reel grid for easier row-based evaluation
const getWin = (numberOfLines, betAmount, trans) => {
  let winnings = 0;
  for (const element of trans) {
    let flag = true;
    for (let i = 0; i < COLS - 1; i++) {
      if (element[i] != element[i + 1]) {
        flag = false;
        break;
      }
    }
    if (flag === true) {
      winnings += betAmount * SYMBOL_VALUE[element[0]];
    }
  }
  return winnings;
};

// Main game function to handle the game loop
const game = () => {
  let depositAmount = deposit();

  while (true) {
    console.log(
      "Current Balance in your Account: $" + depositAmount.toFixed(2)
    );
    const numberOfLines = getNumberOfLines();
    const betAmount = getBet(depositAmount, numberOfLines);

    // Deduct the total bet from the deposit
    depositAmount -= betAmount * numberOfLines;

    // Spin the reels and display the result
    const reels = spin();
    const trans = transpose(reels);
    printRows(trans);

    // Calculate winnings
    const winnings = getWin(numberOfLines, betAmount, trans);
    depositAmount += winnings;

    console.log(`You won: $${winnings.toFixed(2)}`);
    console.log(`Updated Balance: $${depositAmount.toFixed(2)}`);

    // Check if the user wants to play again
    if (depositAmount <= 0) {
      console.log("You ran out of money!");
      const addMore = prompt(
        "Do you want to add more money to play again (y/n)? "
      ).toLowerCase();
      if (addMore === "y") {
        depositAmount = deposit();
      } else {
        console.log("Thank you for playing! Goodbye!");
        break;
      }
    } else {
      const playAgain = prompt(
        "Do you want to play again (y/n)? "
      ).toLowerCase();
      if (playAgain !== "y") {
        console.log("Thank you for playing! Goodbye!");
        break;
      }
    }
  }
};

game();
