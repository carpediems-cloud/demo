/**
 * JavaScript Interest Calculator Demo
 * 
 * Demonstrates how to calculate Simple Interest and Compound Interest
 * using formulas, along with an interactive console interface to accept user input.
 */

const readline = require('readline');

/**
 * Calculates Simple Interest.
 * Formula: SI = (P * R * T) / 100
 * 
 * @param {number} principal - The principal amount (initial investment/loan)
 * @param {number} rate - The annual interest rate in percent (e.g., 5 for 5%)
 * @param {number} time - The time duration in years
 * @returns {object} An object containing the interest calculated and total amount
 */
function calculateSimpleInterest(principal, rate, time) {
    if (principal < 0 || rate < 0 || time < 0) {
        throw new Error("Inputs must be non-negative values.");
    }
    const interest = (principal * rate * time) / 100;
    const totalAmount = principal + interest;
    return {
        interest: Number(interest.toFixed(2)),
        totalAmount: Number(totalAmount.toFixed(2))
    };
}

/**
 * Calculates Compound Interest.
 * Formula: A = P * (1 + r/n)^(n*t)
 * where r = R / 100, and CI = A - P
 * 
 * @param {number} principal - The principal amount (initial investment/loan)
 * @param {number} rate - The annual interest rate in percent (e.g., 5 for 5%)
 * @param {number} time - The time duration in years
 * @param {number} compoundingFrequency - Number of times interest is compounded per year (default is 1 for annual)
 * @returns {object} An object containing the interest calculated and total amount
 */
function calculateCompoundInterest(principal, rate, time, compoundingFrequency = 1) {
    if (principal < 0 || rate < 0 || time < 0 || compoundingFrequency <= 0) {
        throw new Error("Inputs must be non-negative values, and compounding frequency must be greater than zero.");
    }
    const r = rate / 100;
    const n = compoundingFrequency;
    const t = time;
    
    const totalAmount = principal * Math.pow((1 + r / n), (n * t));
    const interest = totalAmount - principal;
    
    return {
        interest: Number(interest.toFixed(2)),
        totalAmount: Number(totalAmount.toFixed(2))
    };
}

/**
 * Helper function to prompt user using Promises.
 * 
 * @param {readline.Interface} rl 
 * @param {string} query 
 * @returns {Promise<string>}
 */
function askQuestion(rl, query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer.trim());
        });
    });
}

/**
 * Main interactive console application.
 */
async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("=== JavaScript Interest Calculator ===");
    console.log("1. Calculate Simple Interest");
    console.log("2. Calculate Compound Interest");
    console.log("3. Compare Simple vs. Compound Interest");
    console.log("4. Exit");

    try {
        const choice = await askQuestion(rl, "\nChoose an option (1-4): ");

        if (choice === '4' || !choice) {
            console.log("\nExiting. Thank you!");
            rl.close();
            return;
        }

        if (choice !== '1' && choice !== '2' && choice !== '3') {
            console.log("\nError: Invalid option chosen.");
            rl.close();
            return;
        }

        const principalStr = await askQuestion(rl, "Enter principal amount ($): ");
        const rateStr = await askQuestion(rl, "Enter annual interest rate (%): ");
        const timeStr = await askQuestion(rl, "Enter time period (years): ");

        const principal = parseFloat(principalStr);
        const rate = parseFloat(rateStr);
        const time = parseFloat(timeStr);

        if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal < 0 || rate < 0 || time < 0) {
            console.log("\nError: Please enter valid positive numbers for all inputs.");
            rl.close();
            return;
        }

        if (choice === '1') {
            const result = calculateSimpleInterest(principal, rate, time);
            console.log("\n--- Simple Interest Results ---");
            console.log(`Principal:      $${principal.toFixed(2)}`);
            console.log(`Annual Rate:    ${rate}%`);
            console.log(`Time Period:    ${time} years`);
            console.log(`-------------------------------`);
            console.log(`Interest:       $${result.interest.toFixed(2)}`);
            console.log(`Total Value:    $${result.totalAmount.toFixed(2)}`);
        } else if (choice === '2') {
            console.log("\nCompounding Frequency options:");
            console.log("1. Annually (1/year)");
            console.log("2. Semi-annually (2/year)");
            console.log("3. Quarterly (4/year)");
            console.log("4. Monthly (12/year)");
            console.log("5. Daily (365/year)");
            
            const freqChoice = await askQuestion(rl, "Choose compounding frequency (1-5, default 1): ");
            let frequency = 1;
            
            switch (freqChoice) {
                case '2': frequency = 2; break;
                case '3': frequency = 4; break;
                case '4': frequency = 12; break;
                case '5': frequency = 365; break;
                default: frequency = 1; break;
            }

            const result = calculateCompoundInterest(principal, rate, time, frequency);
            const freqNames = { 1: "Annually", 2: "Semi-annually", 4: "Quarterly", 12: "Monthly", 365: "Daily" };
            
            console.log("\n--- Compound Interest Results ---");
            console.log(`Principal:      $${principal.toFixed(2)}`);
            console.log(`Annual Rate:    ${rate}%`);
            console.log(`Time Period:    ${time} years`);
            console.log(`Compounding:    ${freqNames[frequency] || frequency + " times/year"}`);
            console.log(`---------------------------------`);
            console.log(`Interest:       $${result.interest.toFixed(2)}`);
            console.log(`Total Value:    $${result.totalAmount.toFixed(2)}`);
        } else if (choice === '3') {
            // Compare Simple vs Compound (Annually, Quarterly, Monthly)
            const simple = calculateSimpleInterest(principal, rate, time);
            const compAnnual = calculateCompoundInterest(principal, rate, time, 1);
            const compQuarterly = calculateCompoundInterest(principal, rate, time, 4);
            const compMonthly = calculateCompoundInterest(principal, rate, time, 12);

            console.log("\n--- Interest Comparison Table ---");
            console.log(`Principal: $${principal.toFixed(2)} | Rate: ${rate}% | Time: ${time} years`);
            console.log("-------------------------------------------------------------");
            console.log(String("Type").padEnd(25) + String("Interest").padEnd(18) + "Total Value");
            console.log("-------------------------------------------------------------");
            console.log(String("Simple Interest").padEnd(25) + String(`$${simple.interest.toFixed(2)}`).padEnd(18) + `$${simple.totalAmount.toFixed(2)}`);
            console.log(String("Compound (Annually)").padEnd(25) + String(`$${compAnnual.interest.toFixed(2)}`).padEnd(18) + `$${compAnnual.totalAmount.toFixed(2)}`);
            console.log(String("Compound (Quarterly)").padEnd(25) + String(`$${compQuarterly.interest.toFixed(2)}`).padEnd(18) + `$${compQuarterly.totalAmount.toFixed(2)}`);
            console.log(String("Compound (Monthly)").padEnd(25) + String(`$${compMonthly.interest.toFixed(2)}`).padEnd(18) + `$${compMonthly.totalAmount.toFixed(2)}`);
            console.log("-------------------------------------------------------------");
            
            const diff = compMonthly.interest - simple.interest;
            console.log(`Note: Monthly compounding earns $${diff.toFixed(2)} more than Simple Interest.`);
        }

    } catch (err) {
        console.error("\nAn error occurred:", err.message);
    } finally {
        rl.close();
    }
}

// Export functions for potential reuse/testing
module.exports = {
    calculateSimpleInterest,
    calculateCompoundInterest
};

// Run the interactive demo if executed directly
if (require.main === module) {
    main();
}
