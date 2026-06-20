/**
 * JavaScript Interest Calculator Demo
 * 
 * Demonstrates how to calculate Simple Interest and Compound Interest
 * using formulas, along with an interactive console interface to accept user input.
 */

const readline = require('readline');

/**
 * Calculates Simple Interest with optional periodic contributions.
 * Formula: SI = (P * R * T) / 100
 * Note: Contributions themselves do not earn simple interest.
 * 
 * @param {number} principal - The principal amount (initial investment/loan)
 * @param {number} rate - The annual interest rate in percent (e.g., 5 for 5%)
 * @param {number} time - The time duration in years
 * @param {number} monthlyContribution - The optional monthly contribution amount (default is 0)
 * @returns {object} An object containing the interest, total contributions, and total amount
 */
function calculateSimpleInterest(principal, rate, time, monthlyContribution = 0) {
    if (principal < 0 || rate < 0 || time < 0 || monthlyContribution < 0) {
        throw new Error("Inputs must be non-negative values.");
    }
    const interest = (principal * rate * time) / 100;
    const totalContributions = monthlyContribution * 12 * time;
    const totalAmount = principal + interest + totalContributions;
    return {
        interest: Number(interest.toFixed(2)),
        totalContributions: Number(totalContributions.toFixed(2)),
        totalAmount: Number(totalAmount.toFixed(2))
    };
}

/**
 * Calculates Compound Interest with optional periodic contributions.
 * Formula (with contributions at start of period):
 * A = P * (1 + r/n)^(n*t) + PMT * [((1 + r/n)^(n*t) - 1) / (r/n)] * (1 + r/n)
 * Formula (with contributions at end of period):
 * A = P * (1 + r/n)^(n*t) + PMT * [((1 + r/n)^(n*t) - 1) / (r/n)]
 * 
 * @param {number} principal - The principal amount (initial investment/loan)
 * @param {number} rate - The annual interest rate in percent (e.g., 5 for 5%)
 * @param {number} time - The time duration in years
 * @param {number} compoundingFrequency - Number of times interest is compounded per year (default is 1 for annual)
 * @param {number} monthlyContribution - Monthly contribution amount (default is 0)
 * @param {boolean} contributionAtStart - Whether contributions are made at the start of each compounding period (default is true)
 * @returns {object} An object containing the interest calculated, total contributions, and total amount
 */
function calculateCompoundInterest(principal, rate, time, compoundingFrequency = 1, monthlyContribution = 0, contributionAtStart = true) {
    if (principal < 0 || rate < 0 || time < 0 || compoundingFrequency <= 0 || monthlyContribution < 0) {
        throw new Error("Inputs must be non-negative values, and compounding frequency must be greater than zero.");
    }
    const r = rate / 100;
    const n = compoundingFrequency;
    const t = time;
    
    // Convert monthly contribution to contribution per compounding period
    const pmt = (monthlyContribution * 12) / n;
    const nt = n * t;
    
    let totalAmount;
    if (r === 0) {
        totalAmount = principal + pmt * nt;
    } else {
        const compoundFactor = Math.pow(1 + r / n, nt);
        const principalPart = principal * compoundFactor;
        let contributionPart = pmt * ((compoundFactor - 1) / (r / n));
        if (contributionAtStart) {
            contributionPart *= (1 + r / n);
        }
        totalAmount = principalPart + contributionPart;
    }
    
    const totalContributions = monthlyContribution * 12 * t;
    const interest = totalAmount - principal - totalContributions;
    
    return {
        interest: Number(interest.toFixed(2)),
        totalContributions: Number(totalContributions.toFixed(2)),
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

        const monthlyContribStr = await askQuestion(rl, "Enter monthly contribution ($ or 0 for none, default 0): ");
        let monthlyContribution = parseFloat(monthlyContribStr);
        if (isNaN(monthlyContribution) || monthlyContribution < 0) {
            monthlyContribution = 0;
        }

        let contributionAtStart = true;
        if (monthlyContribution > 0) {
            const timingStr = await askQuestion(rl, "Make contributions at the start of each compounding period? (y/n, default y): ");
            contributionAtStart = timingStr.toLowerCase() !== 'n';
        }

        if (choice === '1') {
            const result = calculateSimpleInterest(principal, rate, time, monthlyContribution);
            console.log("\n--- Simple Interest Results ---");
            console.log(`Principal:      $${principal.toFixed(2)}`);
            console.log(`Annual Rate:    ${rate}%`);
            console.log(`Time Period:    ${time} years`);
            if (monthlyContribution > 0) {
                console.log(`Monthly Contrib:$${monthlyContribution.toFixed(2)}`);
                console.log(`Total Contrib:  $${result.totalContributions.toFixed(2)}`);
            }
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

            const result = calculateCompoundInterest(principal, rate, time, frequency, monthlyContribution, contributionAtStart);
            const freqNames = { 1: "Annually", 2: "Semi-annually", 4: "Quarterly", 12: "Monthly", 365: "Daily" };
            
            console.log("\n--- Compound Interest Results ---");
            console.log(`Principal:      $${principal.toFixed(2)}`);
            console.log(`Annual Rate:    ${rate}%`);
            console.log(`Time Period:    ${time} years`);
            console.log(`Compounding:    ${freqNames[frequency] || frequency + " times/year"}`);
            if (monthlyContribution > 0) {
                console.log(`Monthly Contrib:$${monthlyContribution.toFixed(2)} (${contributionAtStart ? "Start" : "End"} of period)`);
                console.log(`Total Contrib:  $${result.totalContributions.toFixed(2)}`);
            }
            console.log(`---------------------------------`);
            console.log(`Interest:       $${result.interest.toFixed(2)}`);
            console.log(`Total Value:    $${result.totalAmount.toFixed(2)}`);
        } else if (choice === '3') {
            // Compare Simple vs Compound (Annually, Quarterly, Monthly)
            const simple = calculateSimpleInterest(principal, rate, time, monthlyContribution);
            const compAnnual = calculateCompoundInterest(principal, rate, time, 1, monthlyContribution, contributionAtStart);
            const compQuarterly = calculateCompoundInterest(principal, rate, time, 4, monthlyContribution, contributionAtStart);
            const compMonthly = calculateCompoundInterest(principal, rate, time, 12, monthlyContribution, contributionAtStart);

            console.log("\n--- Interest Comparison Table ---");
            console.log(`Principal: $${principal.toFixed(2)} | Rate: ${rate}% | Time: ${time} years`);
            if (monthlyContribution > 0) {
                console.log(`Monthly Contribution: $${monthlyContribution.toFixed(2)} (${contributionAtStart ? "Start" : "End"} of period)`);
            }
            console.log("-------------------------------------------------------------");
            console.log(String("Type").padEnd(25) + String("Interest").padEnd(18) + "Total Value");
            console.log("-------------------------------------------------------------");
            console.log(String("Simple Interest").padEnd(25) + String(`$${simple.interest.toFixed(2)}`).padEnd(18) + `$${simple.totalAmount.toFixed(2)}`);
            console.log(String("Compound (Annually)").padEnd(25) + String(`$${compAnnual.interest.toFixed(2)}`).padEnd(18) + `$${compAnnual.totalAmount.toFixed(2)}`);
            console.log(String("Compound (Quarterly)").padEnd(25) + String(`$${compQuarterly.interest.toFixed(2)}`).padEnd(18) + `$${compQuarterly.totalAmount.toFixed(2)}`);
            console.log(String("Compound (Monthly)").padEnd(25) + String(`$${compMonthly.interest.toFixed(2)}`).padEnd(18) + `$${compMonthly.totalAmount.toFixed(2)}`);
            console.log("-------------------------------------------------------------");
            
            const diff = compMonthly.interest - simple.interest;
            console.log(`Note: Monthly compounding earns $${diff.toFixed(2)} more interest than Simple Interest.`);
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
