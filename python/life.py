import os
import time
import random

# Screen dimensions
WIDTH = 60
HEIGHT = 20

def clear_screen():
    """Clears the console screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def create_grid(randomize=True):
    """Creates a 2D grid, optionally initialized with random living cells."""
    grid = []
    for _ in range(HEIGHT):
        if randomize:
            # 20% chance of a cell being alive initially
            row = [1 if random.random() < 0.2 else 0 for _ in range(WIDTH)]
        else:
            row = [0 for _ in range(WIDTH)]
        grid.append(row)
    return grid

def print_grid(grid, generation):
    """Prints the grid to the console."""
    clear_screen()
    output = f"Conway's Game of Life | Generation: {generation}\n"
    output += "=" * WIDTH + "\n"
    
    for row in grid:
        line = ""
        for cell in row:
            if cell:
                line += "█" # Full block character for alive cells
            else:
                line += " " # Space for dead cells
        output += line + "\n"
        
    output += "=" * WIDTH + "\n"
    output += "Press Ctrl+C to stop."
    print(output)

def get_next_generation(grid):
    """Calculates the next generation of the grid based on Conway's rules."""
    new_grid = create_grid(randomize=False)
    
    for y in range(HEIGHT):
        for x in range(WIDTH):
            # Count alive neighbors
            alive_neighbors = 0
            
            # Check all 8 neighboring directions
            for dy in [-1, 0, 1]:
                for dx in [-1, 0, 1]:
                    if dy == 0 and dx == 0:
                        continue
                    
                    ny, nx = y + dy, x + dx
                    
                    # Wrap around the edges of the screen (toroidal array)
                    if ny < 0: ny = HEIGHT - 1
                    elif ny >= HEIGHT: ny = 0
                    
                    if nx < 0: nx = WIDTH - 1
                    elif nx >= WIDTH: nx = 0
                        
                    if grid[ny][nx] == 1:
                        alive_neighbors += 1
                        
            # Apply Conway's Game of Life rules:
            # 1. Any live cell with two or three live neighbours survives.
            # 2. Any dead cell with three live neighbours becomes a live cell.
            # 3. All other live cells die in the next generation. Similarly, all other dead cells stay dead.
            if grid[y][x] == 1:
                if alive_neighbors in [2, 3]:
                    new_grid[y][x] = 1
                else:
                    new_grid[y][x] = 0
            else:
                if alive_neighbors == 3:
                    new_grid[y][x] = 1
                    
    return new_grid

def main():
    # Initialize the grid
    grid = create_grid(randomize=True)
    generation = 0
    
    try:
        # Run the infinite simulation loop
        while True:
            print_grid(grid, generation)
            grid = get_next_generation(grid)
            generation += 1
            # Control the speed of the simulation
            time.sleep(0.1)
    except KeyboardInterrupt:
        # Handle graceful exit when user presses Ctrl+C
        clear_screen()
        print(f"Simulation ended at generation {generation}. See you next time!")

if __name__ == "__main__":
    main()
