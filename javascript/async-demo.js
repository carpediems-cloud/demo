/**
 * JavaScript Asynchronous Programming Demo
 * 
 * Demonstrates Callbacks, Promises, Promise Combinators (all, allSettled, race, any),
 * Async/Await syntax, and Event Loop execution order using Node.js.
 */

const readline = require('readline');

/**
 * Helper function to wrap readline in a Promise.
 */
function askQuestion(rl, query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer.trim());
        });
    });
}

/**
 * Simulates a delay using a Promise.
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * --- 1. CALLBACKS DEMONSTRATION ---
 * Simulates fetching data with a callback.
 */
function getUserCallback(userId, callback) {
    console.log(`[Callback] Fetching user ${userId}...`);
    setTimeout(() => {
        const user = { id: userId, username: 'dev_user' };
        callback(null, user);
    }, 1000);
}

function getOrdersCallback(username, callback) {
    console.log(`[Callback] Fetching orders for ${username}...`);
    setTimeout(() => {
        const orders = ['Order #101', 'Order #102'];
        callback(null, orders);
    }, 1000);
}

function getOrderDetailsCallback(orderId, callback) {
    console.log(`[Callback] Fetching details for ${orderId}...`);
    setTimeout(() => {
        const details = { orderId, status: 'Shipped', amount: 99.99 };
        callback(null, details);
    }, 1000);
}

/**
 * Triggers Callback Hell demonstration.
 */
function runCallbackHellDemo(onComplete) {
    console.log("\n--- Callback Hell Demo (Nested Callbacks) ---");
    getUserCallback(1, (err, user) => {
        if (err) return console.error(err);
        getOrdersCallback(user.username, (err, orders) => {
            if (err) return console.error(err);
            getOrderDetailsCallback(orders[0], (err, details) => {
                if (err) return console.error(err);
                console.log("\n[Success] Final Order Details:", details);
                console.log("--------------------------------------------");
                onComplete();
            });
        });
    });
}

/**
 * --- 2. PROMISES DEMONSTRATION ---
 * Promisified versions of the callback methods.
 */
function getUserPromise(userId) {
    return new Promise((resolve, reject) => {
        console.log(`[Promise] Fetching user ${userId}...`);
        setTimeout(() => {
            if (userId <= 0) reject(new Error("Invalid User ID"));
            else resolve({ id: userId, username: 'promise_user' });
        }, 1000);
    });
}

function getOrdersPromise(username) {
    return new Promise((resolve) => {
        console.log(`[Promise] Fetching orders for ${username}...`);
        setTimeout(() => {
            resolve(['Order #201', 'Order #202']);
        }, 1000);
    });
}

function getOrderDetailsPromise(orderId) {
    return new Promise((resolve) => {
        console.log(`[Promise] Fetching details for ${orderId}...`);
        setTimeout(() => {
            resolve({ orderId, status: 'Delivered', amount: 149.99 });
        }, 1000);
    });
}

/**
 * Runs Promise chaining demonstration.
 */
function runPromiseChainDemo() {
    console.log("\n--- Promise Chaining Demo ---");
    return getUserPromise(2)
        .then((user) => getOrdersPromise(user.username))
        .then((orders) => getOrderDetailsPromise(orders[0]))
        .then((details) => {
            console.log("\n[Success] Final Order Details:", details);
            console.log("--------------------------------------------");
        })
        .catch((error) => {
            console.error("[Error in Chain]:", error.message);
        });
}

/**
 * --- 3. ASYNC/AWAIT DEMONSTRATION ---
 * Clean asynchronous code with error handling.
 */
async function runAsyncAwaitDemo() {
    console.log("\n--- Async/Await Demo ---");
    try {
        const user = await getUserPromise(3);
        const orders = await getOrdersPromise(user.username);
        const details = await getOrderDetailsPromise(orders[0]);
        console.log("\n[Success] Final Order Details (Async/Await):", details);
    } catch (error) {
        console.error("[Error in Async/Await]:", error.message);
    }
    console.log("--------------------------------------------");
}

/**
 * Sequential vs Parallel execution performance demo.
 */
async function runPerformanceDemo() {
    console.log("\n--- Sequential vs Parallel Execution Demo ---");
    
    const task = async (id, ms, shouldSucceed = true) => {
        await delay(ms);
        if (!shouldSucceed) throw new Error(`Task ${id} Failed`);
        return `Result of Task ${id}`;
    };

    console.log("Executing sequentially (blocking)...");
    const startSeq = process.hrtime.bigint();
    const res1 = await task(1, 800);
    const res2 = await task(2, 800);
    const res3 = await task(3, 800);
    const endSeq = process.hrtime.bigint();
    const timeSeq = Number(endSeq - startSeq) / 1000000;
    console.log(`Sequential results: [${res1}, ${res2}, ${res3}]`);
    console.log(`Total Sequential Time: ${timeSeq.toFixed(2)} ms (Sum of all delays)`);

    console.log("\nExecuting in parallel (concurrent)...");
    const startPar = process.hrtime.bigint();
    const results = await Promise.all([
        task(1, 800),
        task(2, 800),
        task(3, 800)
    ]);
    const endPar = process.hrtime.bigint();
    const timePar = Number(endPar - startPar) / 1000000;
    console.log(`Parallel results: [${results.join(', ')}]`);
    console.log(`Total Parallel Time: ${timePar.toFixed(2)} ms (Max of all delays)`);
    console.log(`Improvement: ${(timeSeq / timePar).toFixed(1)}x faster!`);
    console.log("--------------------------------------------");
}

/**
 * --- 4. PROMISE COMBINATORS DEMONSTRATION ---
 */
async function runCombinatorsDemo() {
    console.log("\n--- Promise Combinators Demo ---");
    
    // Setup promises with varying delays and outcomes
    const slowSuccess = () => new Promise(res => setTimeout(() => res("Slow Success (2000ms)"), 2000));
    const fastSuccess = () => new Promise(res => setTimeout(() => res("Fast Success (500ms)"), 500));
    const slowFailure = () => new Promise((_, rej) => setTimeout(() => rej(new Error("Slow Error (1500ms)")), 1500));
    const fastFailure = () => new Promise((_, rej) => setTimeout(() => rej(new Error("Fast Error (300ms)")), 300));

    console.log("1. Promise.all() - Resolves when ALL resolve, rejects if ANY rejects.");
    try {
        const results = await Promise.all([fastSuccess(), slowSuccess()]);
        console.log("   - [Resolved]:", results);
    } catch (e) {
        console.log("   - [Rejected]:", e.message);
    }

    try {
        console.log("   - Running with a failing promise...");
        await Promise.all([fastSuccess(), fastFailure()]);
    } catch (e) {
        console.log("   - [Rejected]:", e.message);
    }

    console.log("\n2. Promise.allSettled() - Resolves when ALL settle, never rejects.");
    const settledResults = await Promise.allSettled([fastSuccess(), fastFailure(), slowSuccess()]);
    console.log("   - [Settled]:", JSON.stringify(settledResults, null, 2));

    console.log("\n3. Promise.race() - Settles as soon as the first promise settles (success or fail).");
    try {
        const winner = await Promise.race([fastFailure(), slowSuccess()]);
        console.log("   - [Winner Resolved]:", winner);
    } catch (e) {
        console.log("   - [Winner Rejected (First to settle was error)]:", e.message);
    }

    console.log("\n4. Promise.any() - Resolves as soon as the first success occurs. Rejects only if ALL fail.");
    try {
        const firstSuccess = await Promise.any([fastFailure(), slowSuccess()]);
        console.log("   - [First Successful Promise]:", firstSuccess);
    } catch (e) {
        console.log("   - [Rejected]:", e.message);
    }
    
    console.log("--------------------------------------------");
}

/**
 * --- 5. EVENT LOOP DEMONSTRATION ---
 */
function runEventLoopDemo(onComplete) {
    console.log("\n--- Event Loop Execution Order Demo ---");
    console.log("We will schedule synchronous logs, microtasks, and macrotasks.");
    console.log("Look at the console to see the output order!");
    console.log("\nExpected Order of Execution:");
    console.log("1. Sync execution (Main Thread)");
    console.log("2. Microtasks (Promise .then callbacks, process.nextTick)");
    console.log("3. Macrotasks (setTimeout / setInterval callbacks)");
    console.log("\n--- Execution Starts ---");

    // Macrotask
    setTimeout(() => {
        console.log("🕒 Macrotask 1 (setTimeout 0ms callback) - Executed after microtasks");
        
        // Final completion callback after everything runs
        setTimeout(() => {
            console.log("--------------------------------------------");
            onComplete();
        }, 10);
    }, 0);

    // Sync
    console.log("🚀 Sync Log 1 (Call Stack - Main Thread) - Executed first");

    // Microtask
    Promise.resolve().then(() => {
        console.log("🧪 Microtask 1 (Promise.then) - Executed after Call Stack is empty");
    });

    // Microtask
    process.nextTick(() => {
        console.log("⚡ process.nextTick (Microtask) - Executed before Promise.then in Node.js");
    });

    // Sync
    console.log("🚀 Sync Log 2 (Call Stack - Main Thread) - Executed immediately after Sync Log 1");
}

/**
 * Main application entry point.
 */
async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    while (true) {
        console.log("\n=== Asynchronous JavaScript Demos ===");
        console.log("1. Callbacks & Callback Hell");
        console.log("2. Promise Chaining & Error Catching");
        console.log("3. Async/Await and Performance Comparison");
        console.log("4. Promise Combinators (all, allSettled, race, any)");
        console.log("5. Event Loop & Microtask/Macrotask Execution Order");
        console.log("6. Exit");

        const choice = await askQuestion(rl, "\nChoose a demo to run (1-6): ");

        if (choice === '6' || !choice) {
            console.log("\nExiting. Goodbye!");
            break;
        }

        switch (choice) {
            case '1':
                await new Promise((resolve) => runCallbackHellDemo(resolve));
                break;
            case '2':
                await runPromiseChainDemo();
                break;
            case '3':
                await runAsyncAwaitDemo();
                await runPerformanceDemo();
                break;
            case '4':
                await runCombinatorsDemo();
                break;
            case '5':
                await new Promise((resolve) => runEventLoopDemo(resolve));
                break;
            default:
                console.log("\nInvalid option. Please try again.");
        }
        
        await askQuestion(rl, "\nPress Enter to continue...");
    }

    rl.close();
}

module.exports = {
    delay,
    getUserCallback,
    getUserPromise,
    runPerformanceDemo,
    runCombinatorsDemo
};

if (require.main === module) {
    main();
}
