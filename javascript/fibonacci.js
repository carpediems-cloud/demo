/**
 * JavaScript Fibonacci Demo
 * 
 * Generates the Fibonacci sequence up to N terms and
 * checks if a given number is a Fibonacci number.
 */

const readline = require('readline');

// A number is Fibonacci if and only if one or both of (5*n^2 + 4) or (5*n^2 - 4) is a perfect square
function isPerfectSquare(x) {
    const s = Math.round(Math.sqrt(x));
    return (s * s === x);
}

function isFibonacci(n) {
    if (n < 0) return false;
    return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4);
}

function printFibonacciSeries(n) {
    let t1 = 0n, t2 = 1n;
    const series = [];

    for (let i = 1; i <= n; ++i) {
        if (i === 1) {
            series.push(t1.toString());
            continue;
        }
        if (i === 2) {
            series.push(t2.toString());
            continue;
        }
        const nextTerm = t1 + t2;
        t1 = t2;
        t2 = nextTerm;
        series.push(nextTerm.toString());
    }
    return series.join(" ");
}

function askQuestion(rl, query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        const nStr = await askQuestion(rl, "Enter the number of terms for Fibonacci series: ");
        const n = parseInt(nStr, 10);
        if (isNaN(n) || n <= 0) {
            console.log("Invalid input. Please enter a positive integer.");
            rl.close();
            return;
        }

        console.log(`\nFibonacci Series up to ${n} terms:`);
        console.log(printFibonacciSeries(n));
        console.log("\n");

        const numStr = await askQuestion(rl, "Enter an integer to check if it belongs to the Fibonacci sequence: ");
        const num = parseInt(numStr, 10);
        if (isNaN(num)) {
            console.log("Invalid input. Please enter a valid integer.");
        } else {
            if (isFibonacci(num)) {
                console.log(`${num} is a Fibonacci number.`);
            } else {
                console.log(`${num} is NOT a Fibonacci number.`);
            }
        }
    } catch (err) {
        console.error("An error occurred:", err);
    } finally {
        rl.close();
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    isFibonacci,
    printFibonacciSeries
};
