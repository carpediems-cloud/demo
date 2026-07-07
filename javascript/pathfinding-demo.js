/**
 * JavaScript Pathfinding & Grid Search Demo
 * 
 * Demonstrates BFS, DFS, Dijkstra, and A* pathfinding algorithms on a 2D grid
 * with obstacles, varying terrain costs (mud/swamp), and ANSI terminal color visualizations.
 * Includes interactive mode, step-by-step animation, and algorithm comparisons.
 */

const readline = require('readline');

// ANSI Terminal Colors for Rich UI
const COLORS = {
    RESET: '\x1b[0m',
    START: '\x1b[1;32m',    // Bold Green
    END: '\x1b[1;31m',      // Bold Red
    WALL: '\x1b[90m',       // Dark Grey
    MUD: '\x1b[33m',        // Yellow
    VISITED: '\x1b[36m',    // Cyan
    PATH: '\x1b[1;33m',     // Bold Yellow
    EMPTY: '\x1b[37m',      // White
    INFO: '\x1b[35m',       // Magenta
    CYAN: '\x1b[36m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    RED: '\x1b[31m'
};

// Default map representation
// 'S' - Start (cost 0)
// 'E' - End (cost 1)
// '#' - Wall (impassable)
// '~' - Mud/Swamp (cost 5)
// '.' - Empty space (cost 1)
const DEFAULT_GRID = [
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', 'S', '.', '.', '.', '#', '.', '.', '.', '.'],
    ['.', '~', '.', '.', '.', '#', '.', '#', 'E', '.'],
    ['.', '~', '.', '.', '.', '#', '.', '#', '.', '.'],
    ['.', '~', '.', '.', '.', '#', '.', '#', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '#', '.', '.'],
    ['.', '#', '#', '#', '#', '#', '#', '#', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
];

/**
 * Finds the Start ('S') and End ('E') coordinates on the grid.
 * @param {string[][]} grid 
 * @returns {{start: {r: number, c: number}|null, end: {r: number, c: number}|null}}
 */
function findPoints(grid) {
    let start = null;
    let end = null;
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c] === 'S') start = { r, c };
            if (grid[r][c] === 'E') end = { r, c };
        }
    }
    return { start, end };
}

/**
 * Reconstructs path from start to end using the parent pointers.
 * @param {({r: number, c: number}|null)[][]} parent 
 * @param {{r: number, c: number}} start 
 * @param {{r: number, c: number}} end 
 * @returns {{r: number, c: number}[]}
 */
function reconstructPath(parent, start, end) {
    const path = [];
    let curr = end;
    while (curr !== null) {
        path.push(curr);
        if (curr.r === start.r && curr.c === start.c) {
            break;
        }
        curr = parent[curr.r][curr.c];
    }
    return path.reverse();
}

/**
 * Calculates the total cost of a path based on terrain types.
 * @param {string[][]} grid 
 * @param {{r: number, c: number}[]|null} path 
 * @returns {number}
 */
function calculatePathCost(grid, path) {
    if (!path) return Infinity;
    let cost = 0;
    // Skip index 0 (Start node) since starting has 0 cost
    for (let i = 1; i < path.length; i++) {
        const { r, c } = path[i];
        const val = grid[r][c];
        if (val === '~') cost += 5;
        else cost += 1;
    }
    return cost;
}

/**
 * Clears the console terminal screen.
 */
function clearConsole() {
    process.stdout.write('\x1Bc');
}

/**
 * Sleep helper function.
 * @param {number} ms 
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Prints the grid with colors, showing walls, visited cells, and paths.
 * @param {string[][]} grid 
 * @param {boolean[][]} visited 
 * @param {{r: number, c: number}[]|null} path 
 * @param {{r: number, c: number}|null} currentPos 
 */
function printGrid(grid, visited = null, path = null, currentPos = null) {
    const rows = grid.length;
    const cols = grid[0].length;
    
    const pathSet = new Set();
    if (path) {
        for (const p of path) {
            pathSet.add(`${p.r},${p.c}`);
        }
    }

    let output = '\n';
    for (let r = 0; r < rows; r++) {
        let rowStr = '  ';
        for (let c = 0; c < cols; c++) {
            const val = grid[r][c];
            const isPath = pathSet.has(`${r},${c}`);
            const isVisited = visited && visited[r][c];
            const isCurrent = currentPos && currentPos.r === r && currentPos.c === c;

            let char = val;
            let color = COLORS.RESET;

            if (val === 'S') {
                color = COLORS.START;
            } else if (val === 'E') {
                color = COLORS.END;
            } else if (isCurrent) {
                char = '●';
                color = COLORS.INFO;
            } else if (isPath) {
                char = '*';
                color = COLORS.PATH;
            } else if (isVisited) {
                char = 'o';
                color = COLORS.VISITED;
            } else if (val === '#') {
                char = '█';
                color = COLORS.WALL;
            } else if (val === '~') {
                char = '~';
                color = COLORS.MUD;
            } else {
                char = '.';
                color = COLORS.EMPTY;
            }

            rowStr += color + char + ' ' + COLORS.RESET;
        }
        output += rowStr + '\n';
    }
    console.log(output);
}

/**
 * Breadth-First Search (BFS)
 * Guarantees shortest path in terms of steps, but ignores terrain weights.
 */
async function bfs(grid, start, end, onStep = null, delay = 80) {
    const rows = grid.length;
    const cols = grid[0].length;
    const queue = [start];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const parent = Array.from({ length: rows }, () => Array(cols).fill(null));
    
    visited[start.r][start.c] = true;
    let nodesVisited = 0;

    while (queue.length > 0) {
        const curr = queue.shift();
        nodesVisited++;

        if (curr.r === end.r && curr.c === end.c) {
            const path = reconstructPath(parent, start, end);
            return { path, nodesVisited };
        }

        const directions = [
            { r: -1, c: 0 }, // Up
            { r: 1, c: 0 },  // Down
            { r: 0, c: -1 }, // Left
            { r: 0, c: 1 }   // Right
        ];

        for (const dir of directions) {
            const nr = curr.r + dir.r;
            const nc = curr.c + dir.c;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                if (!visited[nr][nc] && grid[nr][nc] !== '#') {
                    visited[nr][nc] = true;
                    parent[nr][nc] = curr;
                    queue.push({ r: nr, c: nc });

                    if (onStep && !(nr === end.r && nc === end.c)) {
                        await onStep(visited, nr, nc);
                        await sleep(delay);
                    }
                }
            }
        }
    }
    return { path: null, nodesVisited };
}

/**
 * Depth-First Search (DFS)
 * Explores deep pathways first. Does not guarantee the shortest path.
 */
async function dfs(grid, start, end, onStep = null, delay = 80) {
    const rows = grid.length;
    const cols = grid[0].length;
    const stack = [start];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const parent = Array.from({ length: rows }, () => Array(cols).fill(null));
    
    let nodesVisited = 0;

    while (stack.length > 0) {
        const curr = stack.pop();

        if (visited[curr.r][curr.c]) continue;
        visited[curr.r][curr.c] = true;
        nodesVisited++;

        if (curr.r === end.r && curr.c === end.c) {
            const path = reconstructPath(parent, start, end);
            return { path, nodesVisited };
        }

        // Search down, right, up, left
        const directions = [
            { r: 1, c: 0 },  // Down
            { r: 0, c: 1 },  // Right
            { r: -1, c: 0 }, // Up
            { r: 0, c: -1 }  // Left
        ];

        for (const dir of directions) {
            const nr = curr.r + dir.r;
            const nc = curr.c + dir.c;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                if (!visited[nr][nc] && grid[nr][nc] !== '#') {
                    parent[nr][nc] = curr;
                    stack.push({ r: nr, c: nc });

                    if (onStep && !(nr === end.r && nc === end.c)) {
                        await onStep(visited, nr, nc);
                        await sleep(delay);
                    }
                }
            }
        }
    }
    return { path: null, nodesVisited };
}

/**
 * Dijkstra's Algorithm
 * Finds the actual cheapest cost path considering terrain weight.
 */
async function dijkstra(grid, start, end, onStep = null, delay = 80) {
    const rows = grid.length;
    const cols = grid[0].length;
    const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const parent = Array.from({ length: rows }, () => Array(cols).fill(null));

    dist[start.r][start.c] = 0;
    let nodesVisited = 0;

    while (true) {
        // Find the unvisited node with the smallest distance
        let curr = null;
        let minDist = Infinity;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!visited[r][c] && dist[r][c] < minDist) {
                    minDist = dist[r][c];
                    curr = { r, c };
                }
            }
        }

        if (!curr || minDist === Infinity) {
            break; // No path or all reachable nodes traversed
        }

        visited[curr.r][curr.c] = true;
        nodesVisited++;

        if (curr.r === end.r && curr.c === end.c) {
            const path = reconstructPath(parent, start, end);
            return { path, nodesVisited };
        }

        const directions = [
            { r: -1, c: 0 }, { r: 1, c: 0 }, { r: 0, c: -1 }, { r: 0, c: 1 }
        ];

        for (const dir of directions) {
            const nr = curr.r + dir.r;
            const nc = curr.c + dir.c;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== '#') {
                const cellCost = grid[nr][nc] === '~' ? 5 : 1;
                const alt = dist[curr.r][curr.c] + cellCost;

                if (alt < dist[nr][nc]) {
                    dist[nr][nc] = alt;
                    parent[nr][nc] = curr;

                    if (onStep && !visited[nr][nc] && !(nr === end.r && nc === end.c)) {
                        await onStep(visited, nr, nc);
                        await sleep(delay);
                    }
                }
            }
        }
    }
    return { path: null, nodesVisited };
}

/**
 * A* Search Algorithm
 * Uses heuristic (Manhattan distance) to guide search quickly towards destination.
 */
async function astar(grid, start, end, onStep = null, delay = 80) {
    const rows = grid.length;
    const cols = grid[0].length;
    const gScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const fScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const parent = Array.from({ length: rows }, () => Array(cols).fill(null));

    const heuristic = (pos) => Math.abs(pos.r - end.r) + Math.abs(pos.c - end.c);

    gScore[start.r][start.c] = 0;
    fScore[start.r][start.c] = heuristic(start);

    // Open list stores node coordinates and their f-values
    const openSet = [{ r: start.r, c: start.c, f: fScore[start.r][start.c] }];
    let nodesVisited = 0;

    while (openSet.length > 0) {
        // Sort openSet by f value to pop the lowest
        openSet.sort((a, b) => a.f - b.f);
        const curr = openSet.shift();

        if (visited[curr.r][curr.c]) continue;
        visited[curr.r][curr.c] = true;
        nodesVisited++;

        if (curr.r === end.r && curr.c === end.c) {
            const path = reconstructPath(parent, start, end);
            return { path, nodesVisited };
        }

        const directions = [
            { r: -1, c: 0 }, { r: 1, c: 0 }, { r: 0, c: -1 }, { r: 0, c: 1 }
        ];

        for (const dir of directions) {
            const nr = curr.r + dir.r;
            const nc = curr.c + dir.c;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== '#') {
                const cellCost = grid[nr][nc] === '~' ? 5 : 1;
                const tentativeG = gScore[curr.r][curr.c] + cellCost;

                if (tentativeG < gScore[nr][nc]) {
                    parent[nr][nc] = curr;
                    gScore[nr][nc] = tentativeG;
                    fScore[nr][nc] = tentativeG + heuristic({ r: nr, c: nc });

                    if (!visited[nr][nc]) {
                        openSet.push({ r: nr, c: nc, f: fScore[nr][nc] });

                        if (onStep && !(nr === end.r && nc === end.c)) {
                            await onStep(visited, nr, nc);
                            await sleep(delay);
                        }
                    }
                }
            }
        }
    }
    return { path: null, nodesVisited };
}

/**
 * Generates a random layout of walls and mud on the grid.
 * @param {string[][]} grid 
 */
function randomizeGrid(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 'S' || grid[r][c] === 'E') continue;

            const rand = Math.random();
            if (rand < 0.25) {
                grid[r][c] = '#'; // 25% chance of wall
            } else if (rand < 0.40) {
                grid[r][c] = '~'; // 15% chance of mud
            } else {
                grid[r][c] = '.';
            }
        }
    }
}

/**
 * Helper to prompt the user.
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
 * Main application runner.
 */
async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const grid = DEFAULT_GRID.map(row => [...row]); // Deep copy of default grid
    let { start, end } = findPoints(grid);

    while (true) {
        clearConsole();
        console.log(`=== ${COLORS.CYAN}PATHFINDING & GRID SEARCH DEMO${COLORS.RESET} ===`);
        console.log(`\nMap Elements:`);
        console.log(`- ${COLORS.START}S${COLORS.RESET} : Start Node`);
        console.log(`- ${COLORS.END}E${COLORS.RESET} : End Node`);
        console.log(`- ${COLORS.WALL}█${COLORS.RESET} : Impassable Wall (infinite cost)`);
        console.log(`- ${COLORS.MUD}~${COLORS.RESET} : Mud / Swamp (weight cost: 5)`);
        console.log(`- ${COLORS.EMPTY}.${COLORS.RESET} : Clear path (weight cost: 1)`);
        console.log(`- ${COLORS.PATH}*${COLORS.RESET} : Shortest path node`);
        console.log(`- ${COLORS.VISITED}o${COLORS.RESET} : Visited/explored node`);

        printGrid(grid);

        console.log(`\nOptions:`);
        console.log(`1. Run BFS (Breadth-First Search)`);
        console.log(`2. Run DFS (Depth-First Search)`);
        console.log(`3. Run Dijkstra's Algorithm`);
        console.log(`4. Run A* Search`);
        console.log(`5. Compare all algorithms side-by-side`);
        console.log(`6. Randomize map walls & mud`);
        console.log(`7. Reset map to default`);
        console.log(`8. Exit`);

        const choice = await askQuestion(rl, `\nSelect an option (1-8): `);

        if (choice === '8') {
            console.log('\nGoodbye!');
            rl.close();
            break;
        }

        if (choice === '6') {
            randomizeGrid(grid);
            const pts = findPoints(grid);
            start = pts.start;
            end = pts.end;
            console.log('\nMap randomized! Press Enter to continue...');
            await askQuestion(rl, '');
            continue;
        }

        if (choice === '7') {
            // Restore default grid
            for (let r = 0; r < DEFAULT_GRID.length; r++) {
                grid[r] = [...DEFAULT_GRID[r]];
            }
            const pts = findPoints(grid);
            start = pts.start;
            end = pts.end;
            console.log('\nMap reset to default! Press Enter to continue...');
            await askQuestion(rl, '');
            continue;
        }

        if (!['1', '2', '3', '4', '5'].includes(choice)) {
            console.log('\nInvalid choice. Press Enter to retry.');
            await askQuestion(rl, '');
            continue;
        }

        if (!start || !end) {
            console.log('\nError: Start ("S") or End ("E") point not found on grid. Resetting.');
            await askQuestion(rl, '');
            continue;
        }

        let animate = 'n';
        if (choice !== '5') {
            animate = await askQuestion(rl, 'Animate search progress? (y/n): ');
            animate = animate.toLowerCase();
        }

        const stepCallback = animate === 'y' ? async (visited, r, c) => {
            clearConsole();
            console.log(`Running algorithm...`);
            printGrid(grid, visited, null, { r, c });
            console.log(`Current coordinate: (${r}, ${c})`);
        } : null;

        if (choice === '1') {
            const { path, nodesVisited } = await bfs(grid, start, end, stepCallback);
            clearConsole();
            console.log(`=== BFS (Breadth-First Search) Results ===`);
            printGrid(grid, null, path);
            if (path) {
                console.log(`- Path Found! Path Length (nodes): ${COLORS.GREEN}${path.length}${COLORS.RESET}`);
                console.log(`- Total Path Traversal Cost: ${COLORS.YELLOW}${calculatePathCost(grid, path)}${COLORS.RESET}`);
                console.log(`- Total Nodes Explored: ${COLORS.CYAN}${nodesVisited}${COLORS.RESET}`);
            } else {
                console.log(`${COLORS.RED}- No path found between Start and End.${COLORS.RESET}`);
            }
            await askQuestion(rl, '\nPress Enter to return to menu...');
        } else if (choice === '2') {
            const { path, nodesVisited } = await dfs(grid, start, end, stepCallback);
            clearConsole();
            console.log(`=== DFS (Depth-First Search) Results ===`);
            printGrid(grid, null, path);
            if (path) {
                console.log(`- Path Found! Path Length (nodes): ${COLORS.GREEN}${path.length}${COLORS.RESET}`);
                console.log(`- Total Path Traversal Cost: ${COLORS.YELLOW}${calculatePathCost(grid, path)}${COLORS.RESET}`);
                console.log(`- Total Nodes Explored: ${COLORS.CYAN}${nodesVisited}${COLORS.RESET}`);
            } else {
                console.log(`${COLORS.RED}- No path found between Start and End.${COLORS.RESET}`);
            }
            await askQuestion(rl, '\nPress Enter to return to menu...');
        } else if (choice === '3') {
            const { path, nodesVisited } = await dijkstra(grid, start, end, stepCallback);
            clearConsole();
            console.log(`=== Dijkstra's Algorithm Results ===`);
            printGrid(grid, null, path);
            if (path) {
                console.log(`- Path Found! Path Length (nodes): ${COLORS.GREEN}${path.length}${COLORS.RESET}`);
                console.log(`- Total Path Traversal Cost: ${COLORS.YELLOW}${calculatePathCost(grid, path)}${COLORS.RESET} (Optimal cost)`);
                console.log(`- Total Nodes Explored: ${COLORS.CYAN}${nodesVisited}${COLORS.RESET}`);
            } else {
                console.log(`${COLORS.RED}- No path found between Start and End.${COLORS.RESET}`);
            }
            await askQuestion(rl, '\nPress Enter to return to menu...');
        } else if (choice === '4') {
            const { path, nodesVisited } = await astar(grid, start, end, stepCallback);
            clearConsole();
            console.log(`=== A* Search Results ===`);
            printGrid(grid, null, path);
            if (path) {
                console.log(`- Path Found! Path Length (nodes): ${COLORS.GREEN}${path.length}${COLORS.RESET}`);
                console.log(`- Total Path Traversal Cost: ${COLORS.YELLOW}${calculatePathCost(grid, path)}${COLORS.RESET} (Optimal cost)`);
                console.log(`- Total Nodes Explored: ${COLORS.CYAN}${nodesVisited}${COLORS.RESET}`);
            } else {
                console.log(`${COLORS.RED}- No path found between Start and End.${COLORS.RESET}`);
            }
            await askQuestion(rl, '\nPress Enter to return to menu...');
        } else if (choice === '5') {
            // Run all 4 algorithms instantly
            const bfsRes = await bfs(grid, start, end);
            const dfsRes = await dfs(grid, start, end);
            const dijkstraRes = await dijkstra(grid, start, end);
            const astarRes = await astar(grid, start, end);

            clearConsole();
            console.log(`=== ALGORITHM COMPARISON ===`);
            console.log(`Current Grid State:`);
            printGrid(grid);

            const formatResult = (name, res) => {
                if (!res.path) {
                    return `${name.padEnd(10)} | ${COLORS.RED}No Path Found${COLORS.RESET}`;
                }
                const cost = calculatePathCost(grid, res.path);
                return `${name.padEnd(10)} | Nodes in Path: ${COLORS.GREEN}${res.path.length.toString().padEnd(4)}${COLORS.RESET} | Path Cost: ${COLORS.YELLOW}${cost.toString().padEnd(4)}${COLORS.RESET} | Nodes Explored: ${COLORS.CYAN}${res.nodesVisited.toString().padEnd(4)}${COLORS.RESET}`;
            };

            console.log(`--------------------------------------------------------------------------------`);
            console.log(formatResult('BFS', bfsRes));
            console.log(formatResult('DFS', dfsRes));
            console.log(formatResult('Dijkstra', dijkstraRes));
            console.log(formatResult('A*', astarRes));
            console.log(`--------------------------------------------------------------------------------`);
            console.log(`\nKey Learning Points:`);
            console.log(`1. ${COLORS.CYAN}BFS${COLORS.RESET} explores level-by-level. It guarantees fewest steps but ignores mud cost.`);
            console.log(`2. ${COLORS.CYAN}DFS${COLORS.RESET} explores deep pathways. It is fast to code but doesn't guarantee shortest path or cost.`);
            console.log(`3. ${COLORS.CYAN}Dijkstra${COLORS.RESET} guarantees the lowest-cost path, adapting to mud (~), but explores widely.`);
            console.log(`4. ${COLORS.CYAN}A*${COLORS.RESET} finds the lowest-cost path like Dijkstra, but uses a heuristic to explore significantly fewer nodes.`);

            await askQuestion(rl, '\nPress Enter to return to menu...');
        }
    }
}

module.exports = {
    bfs,
    dfs,
    dijkstra,
    astar,
    calculatePathCost,
    findPoints
};

if (require.main === module) {
    main();
}
