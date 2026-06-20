/**
 * JavaScript Recursion Demo
 * 
 * Demonstrates recursive functions (base cases, call stack, and optimization)
 * using classic examples: Factorial, Fibonacci (naive vs. memoized),
 * Array Flattening, and Binary Search, with an interactive console interface.
 */

const readline = require('readline');

/**
 * Calculates the factorial of a non-negative integer.
 * Formula: n! = n * (n-1) * ... * 1, where 0! = 1
 * 
 * @param {number} n - The integer to compute factorial for
 * @returns {number} The factorial result
 */
function factorial(n) {
    // Base Case
    if (n === 0 || n === 1) {
        return 1;
    }
    // Recursive Step
    return n * factorial(n - 1);
}

/**
 * Calculates the Nth Fibonacci number recursively (naive implementation).
 * Time Complexity: O(2^n)
 * 
 * @param {number} n - The index of the Fibonacci number
 * @returns {number} The Nth Fibonacci number
 */
function fibonacciNaive(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return fibonacciNaive(n - 1) + fibonacciNaive(n - 2);
}

/**
 * Calculates the Nth Fibonacci number recursively using Memoization.
 * Time Complexity: O(n)
 * 
 * @param {number} n - The index of the Fibonacci number
 * @param {object} memo - Cache to store already calculated values
 * @returns {number} The Nth Fibonacci number
 */
function fibonacciMemoized(n, memo = {}) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    if (memo[n] !== undefined) return memo[n];
    
    memo[n] = fibonacciMemoized(n - 1, memo) + fibonacciMemoized(n - 2, memo);
    return memo[n];
}

/**
 * Recursively flattens an array of arbitrary depth.
 * Example: [1, [2, [3, 4], 5]] -> [1, 2, 3, 4, 5]
 * 
 * @param {Array} arr - The nested array to flatten
 * @returns {Array} The flattened array
 */
function flattenArray(arr) {
    let result = [];
    for (const item of arr) {
        if (Array.isArray(item)) {
            // Recursive step: flatten the sub-array and concatenate
            result = result.concat(flattenArray(item));
        } else {
            // Base step: push the non-array item
            result.push(item);
        }
    }
    return result;
}

/**
 * Recursively performs binary search on a sorted array.
 * 
 * @param {number[]} arr - Sorted array of numbers
 * @param {number} target - Element to search for
 * @param {number} left - Left boundary index
 * @param {number} right - Right boundary index
 * @returns {number} The index of target if found, otherwise -1
 */
function binarySearch(arr, target, left = 0, right = arr.length - 1) {
    // Base Case: search interval is empty
    if (left > right) {
        return -1;
    }
    
    const mid = Math.floor(left + (right - left) / 2);
    
    // Base Case: element found at midpoint
    if (arr[mid] === target) {
        return mid;
    }
    
    // Recursive Step
    if (arr[mid] > target) {
        return binarySearch(arr, target, left, mid - 1);
    } else {
        return binarySearch(arr, target, mid + 1, right);
    }
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

    console.log("=== JavaScript Recursion Demos ===");
    console.log("1. Factorial (n!)");
    console.log("2. Fibonacci Sequence (Naive vs. Memoized)");
    console.log("3. Array Flattening (Arbitrary Depth)");
    console.log("4. Recursive Binary Search (Sorted Array)");
    console.log("5. Exit");

    try {
        const choice = await askQuestion(rl, "\nChoose an option (1-5): ");

        if (choice === '5' || !choice) {
            console.log("\nExiting. Goodbye!");
            rl.close();
            return;
        }

        if (!['1', '2', '3', '4'].includes(choice)) {
            console.log("\nError: Invalid option chosen.");
            rl.close();
            return;
        }

        if (choice === '1') {
            const numStr = await askQuestion(rl, "Enter a non-negative integer for factorial: ");
            const n = parseInt(numStr, 10);
            if (isNaN(n) || n < 0) {
                console.log("Error: Please enter a valid non-negative integer.");
            } else {
                console.log(`\nFactorial of ${n}:`);
                console.log(`${n}! = ${factorial(n)}`);
            }
        } else if (choice === '2') {
            const numStr = await askQuestion(rl, "Enter index N for Fibonacci (e.g. 40 to see speed difference): ");
            const n = parseInt(numStr, 10);
            if (isNaN(n) || n < 0) {
                console.log("Error: Please enter a valid non-negative integer.");
            } else {
                console.log(`\nCalculating Fibonacci(${n})...`);
                
                // Measure memoized performance
                const startMemo = process.hrtime.bigint();
                const resMemo = fibonacciMemoized(n);
                const endMemo = process.hrtime.bigint();
                const timeMemo = Number(endMemo - startMemo) / 1000000; // milliseconds
                console.log(`- Memoized Result: ${resMemo} (took ${timeMemo.toFixed(4)} ms)`);

                // Naive is slow for n > 40, so let's check with user before executing if n is large
                if (n > 42) {
                    console.log(`- Naive calculation skipped (too slow for N = ${n})`);
                } else {
                    const startNaive = process.hrtime.bigint();
                    const resNaive = fibonacciNaive(n);
                    const endNaive = process.hrtime.bigint();
                    const timeNaive = Number(endNaive - startNaive) / 1000000; // milliseconds
                    console.log(`- Naive Result:    ${resNaive} (took ${timeNaive.toFixed(4)} ms)`);
                    if (timeMemo > 0) {
                        console.log(`Note: Memoized recursion was ${(timeNaive / timeMemo).toFixed(1)}x faster!`);
                    }
                }
            }
        } else if (choice === '3') {
            console.log("\nDefault deeply nested array: [1, [2, [3, 4], 5], [6, 7]]");
            const inputStr = await askQuestion(rl, "Enter a JSON-formatted nested array (or press Enter for default): ");
            let arr;
            if (inputStr === "") {
                arr = [1, [2, [3, 4], 5], [6, 7]];
            } else {
                try {
                    arr = JSON.parse(inputStr);
                    if (!Array.isArray(arr)) throw new Error("Input must be an array");
                } catch (e) {
                    console.log("Error: Invalid JSON array format. Using default array.");
                    arr = [1, [2, [3, 4], 5], [6, 7]];
                }
            }
            
            console.log("\nOriginal Array:", JSON.stringify(arr));
            console.log("Flattened Array:", JSON.stringify(flattenArray(arr)));
        } else if (choice === '4') {
            const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
            console.log("\nSorted Array:", JSON.stringify(arr));
            const targetStr = await askQuestion(rl, "Enter target number to search: ");
            const target = parseFloat(targetStr);
            if (isNaN(target)) {
                console.log("Error: Please enter a valid number.");
            } else {
                const index = binarySearch(arr, target);
                if (index !== -1) {
                    console.log(`Success: Target ${target} found at index ${index}.`);
                } else {
                    console.log(`Failure: Target ${target} was not found in the array.`);
                }
            }
        }

    } catch (err) {
        console.error("\nAn error occurred:", err.message);
    } finally {
        rl.close();
    }
}

// Export functions for potential reuse/testing
module.exports = {
    factorial,
    fibonacciNaive,
    fibonacciMemoized,
    flattenArray,
    binarySearch
};

// Run the interactive demo if executed directly
if (require.main === module) {
    main();
}
