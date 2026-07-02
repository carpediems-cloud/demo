"""
+===================================================+
|           *  TERMINAL SANDBOX PHYSICS  *          |
|    Interactive cellular automata simulation       |
+===================================================+

A cross-platform physics sandbox in your terminal. Watch sand fall,
water flow, fire spread, acid dissolve obstacles, and plants grow.

Controls:
  Arrow Keys / WASD - Move Cursor
  Space / Enter     - Draw selected material
  1                 - Select Sand (Gold)
  2                 - Select Water (Blue)
  3                 - Select Wall (Gray)
  4                 - Select Plant (Green)
  5                 - Select Fire (Orange-Red)
  6                 - Select Acid (Purple)
  7                 - Select Eraser (Clear cells)
  c / C             - Clear the sandbox
  p / P             - Pause / Resume physics
  q / Q             - Exit sandbox
"""

import os
import sys
import io
import time
import random

# Force UTF-8 output on Windows for clean rendering of borders
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# ── Platform-Specific Terminal Input ─────────────────────────────────────────
IS_WINDOWS = sys.platform == "win32"
if IS_WINDOWS:
    import msvcrt
    def get_input():
        if msvcrt.kbhit():
            ch = msvcrt.getwch()
            # Handle arrow key prefix (0 or 224 on Windows)
            if ch in ('\x00', '\xe0'):
                ch2 = msvcrt.getwch()
                return f"arrow_{ch2}"
            return ch
        return None
else:
    import tty
    import termios
    import select
    def get_input():
        if select.select([sys.stdin], [], [], 0)[0]:
            fd = sys.stdin.fileno()
            old_settings = termios.tcgetattr(fd)
            try:
                tty.setraw(fd)
                ch = sys.stdin.read(1)
                if ch == '\x1b':
                    # Read escape sequences (like arrows)
                    ch2 = sys.stdin.read(2)
                    if ch2 == '[A': return 'arrow_H'  # Up
                    if ch2 == '[B': return 'arrow_P'  # Down
                    if ch2 == '[C': return 'arrow_M'  # Right
                    if ch2 == '[D': return 'arrow_K'  # Left
                return ch
            finally:
                termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        return None

# ── ANSI Terminal Escape Codes ───────────────────────────────────────────────
def clear():
    os.system("cls" if IS_WINDOWS else "clear")

def move_cursor(r, c):
    print(f"\033[{r};{c}H", end="")

def rgb_color(r, g, b):
    return f"\033[38;2;{r};{g};{b}m"

RESET = "\033[0m"
HIDE_CURSOR = "\033[?25l"
SHOW_CURSOR = "\033[?25h"

# ── Material Settings & Design System ────────────────────────────────────────
MATERIALS = {
    '.': {"name": "Empty",  "char": " ", "color": rgb_color(40, 40, 40)},
    'S': {"name": "Sand",   "char": "░", "color": rgb_color(240, 200, 60)},   # Gold
    'W': {"name": "Water",  "char": "≈", "color": rgb_color(40, 130, 240)},   # Cyan-Blue
    '#': {"name": "Wall",   "char": "█", "color": rgb_color(130, 130, 130)},  # Gray
    'P': {"name": "Plant",  "char": "♣", "color": rgb_color(40, 200, 80)},    # Green
    'F': {"name": "Fire",   "char": "☼", "color": rgb_color(255, 70, 30)},    # Red-Orange
    'A': {"name": "Acid",   "char": "☣", "color": rgb_color(190, 40, 255)},   # Purple
}

KEYS_TO_MATERIAL = {
    '1': 'S',
    '2': 'W',
    '3': '#',
    '4': 'P',
    '5': 'F',
    '6': 'A',
    '7': '.',
}

# Map Windows virtual arrow letters to readable keys
ARROW_MAP = {
    'arrow_H': 'up',
    'arrow_P': 'down',
    'arrow_K': 'left',
    'arrow_M': 'right',
    'w': 'up',
    's': 'down',
    'a': 'left',
    'd': 'right',
}

class SandboxSimulation:
    def __init__(self, height=22, width=60):
        self.height = height
        self.width = width
        self.grid = [['.' for _ in range(width)] for _ in range(height)]
        self.cursor_r = height // 2
        self.cursor_c = width // 2
        self.active_tool = 'S'
        self.is_paused = False
        self.running = True
        self.tick_delay = 0.05
        
    def clear_sandbox(self):
        self.grid = [['.' for _ in range(self.width)] for _ in range(self.height)]

    def draw_material(self):
        # Spawns material at current cursor position
        self.grid[self.cursor_r][self.cursor_c] = self.active_tool

    def get_neighbors(self, r, c):
        neighbors = []
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < self.height and 0 <= nc < self.width:
                neighbors.append((nr, nc))
        return neighbors

    def update_physics(self):
        if self.is_paused:
            return

        updated = set()
        
        # Physics update proceeds bottom-up to prevent elements falling multiple steps per tick
        for r in range(self.height - 1, -1, -1):
            col_indices = list(range(self.width))
            # Shuffle columns scan to avoid left/right sliding biases
            random.shuffle(col_indices)
            
            for c in col_indices:
                if (r, c) in updated:
                    continue
                
                material = self.grid[r][c]
                if material == '.':
                    continue

                # ── 1. SAND PHYSICS ──────────────────────────────────────────
                if material == 'S':
                    # Fall straight down
                    if r + 1 < self.height:
                        below = self.grid[r+1][c]
                        if below == '.':
                            self.grid[r][c], self.grid[r+1][c] = '.', 'S'
                            updated.update({(r, c), (r+1, c)})
                            continue
                        elif below == 'W': # Sand sinks in water
                            self.grid[r][c], self.grid[r+1][c] = 'W', 'S'
                            updated.update({(r, c), (r+1, c)})
                            continue

                        # Slide diagonally down-left/down-right
                        diagonals = [c - 1, c + 1]
                        random.shuffle(diagonals)
                        moved = False
                        for dc in diagonals:
                            if 0 <= dc < self.width:
                                diag_cell = self.grid[r+1][dc]
                                if diag_cell == '.':
                                    self.grid[r][c], self.grid[r+1][dc] = '.', 'S'
                                    updated.update({(r, c), (r+1, dc)})
                                    moved = True
                                    break
                                elif diag_cell == 'W':
                                    self.grid[r][c], self.grid[r+1][dc] = 'W', 'S'
                                    updated.update({(r, c), (r+1, dc)})
                                    moved = True
                                    break
                        if moved:
                            continue

                # ── 2. WATER PHYSICS ─────────────────────────────────────────
                elif material == 'W':
                    # Flow down
                    if r + 1 < self.height and self.grid[r+1][c] == '.':
                        self.grid[r][c], self.grid[r+1][c] = '.', 'W'
                        updated.update({(r, c), (r+1, c)})
                        continue
                    
                    # Flow diagonally down
                    diagonals = [c - 1, c + 1]
                    random.shuffle(diagonals)
                    moved = False
                    for dc in diagonals:
                        if r + 1 < self.height and 0 <= dc < self.width:
                            if self.grid[r+1][dc] == '.':
                                self.grid[r][c], self.grid[r+1][dc] = '.', 'W'
                                updated.update({(r, c), (r+1, dc)})
                                moved = True
                                break
                    if moved:
                        continue
                    
                    # Flow sideways (horizontal spreading)
                    sideways = [c - 1, c + 1]
                    random.shuffle(sideways)
                    for dc in sideways:
                        if 0 <= dc < self.width and self.grid[r][dc] == '.':
                            self.grid[r][c], self.grid[r][dc] = '.', 'W'
                            updated.update({(r, c), (r, dc)})
                            moved = True
                            break
                    if moved:
                        continue

                # ── 3. FIRE PHYSICS ──────────────────────────────────────────
                elif material == 'F':
                    # Fire burns with a lifecycle decay rate
                    if random.random() < 0.18:
                        self.grid[r][c] = '.'
                        continue

                    # Spread to adjacent plants (combustion)
                    burned = False
                    for nr, nc in self.get_neighbors(r, c):
                        if self.grid[nr][nc] == 'P':
                            self.grid[nr][nc] = 'F'
                            updated.add((nr, nc))
                            burned = True
                    
                    # Float upwards/diagonally with wind drift
                    if r - 1 >= 0:
                        targets = [c, c - 1, c + 1]
                        random.shuffle(targets)
                        for tc in targets:
                            if 0 <= tc < self.width:
                                cell = self.grid[r-1][tc]
                                if cell == '.':
                                    self.grid[r][c] = '.'
                                    self.grid[r-1][tc] = 'F'
                                    updated.update({(r, c), (r-1, tc)})
                                    break
                                elif cell == 'W': # Fire gets extinguished by water
                                    self.grid[r][c] = '.'
                                    updated.add((r, c))
                                    break

                # ── 4. ACID PHYSICS ──────────────────────────────────────────
                elif material == 'A':
                    # Acid eats materials (Plants, Sand, Walls)
                    dissolved = False
                    for nr, nc in self.get_neighbors(r, c):
                        target = self.grid[nr][nc]
                        if target in ('P', 'S', '#'):
                            self.grid[nr][nc] = '.'
                            self.grid[r][c] = '.'
                            updated.update({(r, c), (nr, nc)})
                            dissolved = True
                            break
                    if dissolved:
                        continue

                    # Fall and flow like water if it didn't react
                    if r + 1 < self.height and self.grid[r+1][c] == '.':
                        self.grid[r][c], self.grid[r+1][c] = '.', 'A'
                        updated.update({(r, c), (r+1, c)})
                        continue
                    
                    diagonals = [c - 1, c + 1]
                    random.shuffle(diagonals)
                    moved = False
                    for dc in diagonals:
                        if r + 1 < self.height and 0 <= dc < self.width:
                            if self.grid[r+1][dc] == '.':
                                self.grid[r][c], self.grid[r+1][dc] = '.', 'A'
                                updated.update({(r, c), (r+1, dc)})
                                moved = True
                                break
                    if moved:
                        continue
                    
                    sideways = [c - 1, c + 1]
                    random.shuffle(sideways)
                    for dc in sideways:
                        if 0 <= dc < self.width and self.grid[r][dc] == '.':
                            self.grid[r][c], self.grid[r][dc] = '.', 'A'
                            updated.update({(r, c), (r, dc)})
                            moved = True
                            break
                    if moved:
                        continue

                # ── 5. PLANT PHYSICS ─────────────────────────────────────────
                elif material == 'P':
                    # Plants grow when absorbing adjacent water
                    for nr, nc in self.get_neighbors(r, c):
                        if self.grid[nr][nc] == 'W' and random.random() < 0.25:
                            self.grid[nr][nc] = 'P'
                            updated.add((nr, nc))

    def render(self):
        # Build frame buffer string to draw grid efficiently to reduce console screen flicker
        buf = []
        
        # Border Top
        buf.append(rgb_color(150, 150, 150) + "+" + "-" * self.width + "+" + RESET + "\n")
        
        for r in range(self.height):
            buf.append(rgb_color(150, 150, 150) + "|" + RESET)
            for c in range(self.width):
                # Draw cursor overlay
                if r == self.cursor_r and c == self.cursor_c:
                    buf.append(f"\033[48;2;80;80;80m\033[1m[{MATERIALS[self.active_tool]['char']}]\033[0m")
                else:
                    item = self.grid[r][c]
                    m = MATERIALS[item]
                    buf.append(m["color"] + m["char"] + RESET)
            buf.append(rgb_color(150, 150, 150) + "|" + RESET + "\n")
            
        # Border Bottom
        buf.append(rgb_color(150, 150, 150) + "+" + "-" * self.width + "+" + RESET + "\n")
        
        # HUD Status bar
        tool_name = MATERIALS[self.active_tool]["name"]
        tool_color = MATERIALS[self.active_tool]["color"]
        status_text = f" Tool: {tool_color}{tool_name}{RESET}  |  Pos: ({self.cursor_r},{self.cursor_c})  |  Status: {'PAUSED' if self.is_paused else 'RUNNING'}"
        buf.append(status_text + "\n")
        
        # Controls Cheat Sheet
        controls = (
            " Select Tool: [1] Sand  [2] Water  [3] Wall  [4] Plant  [5] Fire  [6] Acid  [7] Eraser\n"
            " Play keys:   [Space/Enter] Draw  [c] Clear  [p] Pause/Resume  [q] Quit game"
        )
        buf.append(rgb_color(160, 160, 160) + controls + RESET + "\n")

        # Move to screen start and print frame buffer
        move_cursor(5, 1)
        sys.stdout.write("".join(buf))
        sys.stdout.flush()

    def run(self):
        clear()
        
        # Header display
        header = (
            rgb_color(240, 100, 50) + "  +===================================================+\n" +
            rgb_color(240, 160, 50) + "  |           *  TERMINAL SANDBOX PHYSICS  *          |\n" +
            rgb_color(240, 200, 50) + "  |    Interactive cellular automata simulation       |\n" +
            rgb_color(240, 100, 50) + "  +===================================================+\n" + RESET
        )
        print(header)
        print(HIDE_CURSOR, end="")
        
        # Initial render
        self.render()
        
        try:
            while self.running:
                # ── Physics Tick ─────────────────────────────────────────────
                self.update_physics()
                
                # ── Input Handling ───────────────────────────────────────────
                key = get_input()
                if key:
                    key_lower = key.lower()
                    
                    if key_lower == 'q':
                        self.running = False
                    elif key_lower == 'p':
                        self.is_paused = not self.is_paused
                    elif key_lower == 'c':
                        self.clear_sandbox()
                    elif key_lower in KEYS_TO_MATERIAL:
                        self.active_tool = KEYS_TO_MATERIAL[key_lower]
                    elif key in (' ', '\r', '\n'):
                        self.draw_material()
                        
                    # Handle movements
                    direction = ARROW_MAP.get(key_lower)
                    if direction == 'up' and self.cursor_r > 0:
                        self.cursor_r -= 1
                    elif direction == 'down' and self.cursor_r < self.height - 1:
                        self.cursor_r += 1
                    elif direction == 'left' and self.cursor_c > 0:
                        self.cursor_c -= 1
                    elif direction == 'right' and self.cursor_c < self.width - 1:
                        self.cursor_c += 1
                
                # ── Render Frame ─────────────────────────────────────────────
                self.render()
                time.sleep(self.tick_delay)
                
        except KeyboardInterrupt:
            pass
        finally:
            print(SHOW_CURSOR, end="")
            clear()
            print(rgb_color(240, 160, 50) + "[*] Terminal Sandbox Simulation closed. Goodbye!\n" + RESET)

if __name__ == "__main__":
    SandboxSimulation().run()
