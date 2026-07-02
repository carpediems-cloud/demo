"""
+===================================================+
+            *  3D TERMINAL RAYCASTER  *           +
+    Interactive 2.5D FPS engine in your console    +
+===================================================+

Controls:
  W / S             - Move forward / backward
  A / D             - Strafe left / right
  Q / E             - Turn left / right
  Arrow Keys        - Look & move
  M / m             - Toggle Minimap
  T / t             - Cycle Themes
  L / l             - Cycle Levels / Maps
  H / h             - Toggle HUD Info
  P / p             - Pause / Menu
  ESC or ESC-key    - Quit
"""

import os
import sys
import io
import time
import math
import random

# Force UTF-8 output on Windows for clean rendering of blocks and symbols
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
                if msvcrt.kbhit():
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
                    # Read escape sequence
                    # Check if there is more to read
                    r, _, _ = select.select([sys.stdin], [], [], 0.05)
                    if r:
                        ch2 = sys.stdin.read(1)
                        if ch2 == '[':
                            ch3 = sys.stdin.read(1)
                            if ch3 == 'A': return 'arrow_H'  # Up
                            if ch3 == 'B': return 'arrow_P'  # Down
                            if ch3 == 'C': return 'arrow_M'  # Right
                            if ch3 == 'D': return 'arrow_K'  # Left
                        return 'esc'
                    return 'esc'
                return ch
            finally:
                termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        return None

# ── ANSI Terminal Escape Codes ───────────────────────────────────────────────
def clear_screen():
    os.system("cls" if IS_WINDOWS else "clear")

def move_cursor(r, c):
    print(f"\033[{r};{c}H", end="")

def rgb_color(r, g, b):
    return f"\033[38;2;{r};{g};{b}m"

RESET = "\033[0m"
HIDE_CURSOR = "\033[?25l"
SHOW_CURSOR = "\033[?25h"

# ── Levels / Maps ─────────────────────────────────────────────────────────────
MAPS = [
    # Level 0: The Classic Dungeon
    {
        "name": "The Dungeon",
        "grid": [
            "####################",
            "#..................#",
            "#..####......####..#",
            "#..#..#......#..#..#",
            "#..#..A......A..#..#",
            "#..####......####..#",
            "#..................#",
            "#......B....B......#",
            "#......######......#",
            "#..................#",
            "#..####......####..#",
            "#..#..#......#..#..#",
            "#..#..A......A..#..#",
            "#..####......####..#",
            "#..................#",
            "####################",
        ]
    },
    # Level 1: Cyber Arena / Pillars
    {
        "name": "Neon Pillars",
        "grid": [
            "####################",
            "#..................#",
            "#....A........A....#",
            "#........B.........#",
            "#....A........A....#",
            "#..................#",
            "#..######..######..#",
            "#..#....#..#....#..#",
            "#..#.A..#..#..A.#..#",
            "#..#....#..#....#..#",
            "#..######..######..#",
            "#..................#",
            "#....B........B....#",
            "#........A.........#",
            "#..................#",
            "####################",
        ]
    },
    # Level 2: The Spiral
    {
        "name": "The Great Spiral",
        "grid": [
            "####################",
            "#..................#",
            "#.################.#",
            "#.#..............#.#",
            "#.#.############.#.#",
            "#.#.#..........#.#.#",
            "#.#.#.########.#.#.#",
            "#.#.#.#......#.#.#.#",
            "#.#.#.#.BBBB.#.#.#.#",
            "#.#.#.#.B..B.#.#.#.#",
            "#.#.#.#....B.#.#.#.#",
            "#.#.#.######.#.#.#.#",
            "#.#.#........#.#.#.#",
            "#.#.##########.#.#",
            "#.#............#.#",
            "#.##############.#",
            "#................#",
            "##################"
        ]
    }
]

# ── Design Themes ────────────────────────────────────────────────────────────
THEMES = [
    {
        "name": "Stone Dungeon",
        "primary": (130, 130, 130),     # Stone gray
        "secondary": (160, 100, 40),    # Wood / Rust
        "accent": (230, 180, 50),       # Glowing Torch Gold
        "floor": (50, 40, 30),          # Muddy ground
        "ceiling": (20, 25, 35),        # Dark night
        "wall_char": "█",
        "floor_char": ".",
        "ceiling_char": " "
    },
    {
        "name": "Cyberpunk Grid",
        "primary": (255, 0, 128),       # Neon pink
        "secondary": (0, 255, 255),     # Neon cyan
        "accent": (255, 255, 0),        # Neon yellow
        "floor": (25, 15, 45),          # Dark synth violet
        "ceiling": (10, 5, 20),         # Pitch black sky
        "wall_char": "▓",
        "floor_char": "+",
        "ceiling_char": " "
    },
    {
        "name": "Emerald Canopy",
        "primary": (30, 120, 30),       # Deep foliage green
        "secondary": (120, 75, 30),     # Tree bark brown
        "accent": (160, 230, 50),       # Light moss green
        "floor": (40, 65, 30),          # Leafy grass
        "ceiling": (15, 20, 15),        # Forest canopy
        "wall_char": "█",
        "floor_char": ",",
        "ceiling_char": " "
    },
    {
        "name": "Molten Core",
        "primary": (100, 20, 10),       # Crimson basalt
        "secondary": (220, 70, 15),     # Radiant lava orange
        "accent": (255, 180, 0),        # Yellow heat vents
        "floor": (45, 10, 5),           # Hot ash
        "ceiling": (15, 10, 10),        # Ash cloud
        "wall_char": "▒",
        "floor_char": "~",
        "ceiling_char": " "
    }
]

ARROW_MAP = {
    'arrow_H': 'up',
    'arrow_h': 'up',
    'arrow_P': 'down',
    'arrow_p': 'down',
    'arrow_K': 'turn_left',
    'arrow_k': 'turn_left',
    'arrow_M': 'turn_right',
    'arrow_m': 'turn_right',
    'w': 'up',
    's': 'down',
    'a': 'strafe_left',
    'd': 'strafe_right',
    'q': 'turn_left',
    'e': 'turn_right'
}

class RaycasterEngine:
    def __init__(self):
        self.running = True
        self.paused = False
        
        # Player state
        self.px = 2.5
        self.py = 2.5
        self.player_angle = 0.0
        self.fov = math.pi / 3.0  # 60 degrees Field of View
        
        # System settings
        self.level_idx = 0
        self.theme_idx = 0
        self.show_minimap = True
        self.show_hud = True
        
        # Performance timing
        self.last_frame_time = time.time()
        self.fps = 0.0
        self.fps_list = []
        
        self._setup_terminal()

    def _setup_terminal(self):
        if IS_WINDOWS:
            os.system("color")  # Enable virtual terminal sequence support on Windows Cmd/PowerShell
        clear_screen()
        print(HIDE_CURSOR, end="", flush=True)

    def _get_terminal_size(self):
        try:
            size = os.get_terminal_size()
            # Reserve space for the HUD at the bottom
            return max(15, size.lines - 6), max(40, size.columns)
        except Exception:
            return 24, 80

    def load_level(self, idx):
        self.level_idx = idx % len(MAPS)
        # Reset position to a safe spot
        self.px = 2.5
        self.py = 2.5
        self.player_angle = 0.0

    def cycle_theme(self):
        self.theme_idx = (self.theme_idx + 1) % len(THEMES)

    def cast_rays(self, screen_w, screen_h):
        # Frame buffer representing (char, color_ansi)
        theme = THEMES[self.theme_idx]
        grid = MAPS[self.level_idx]["grid"]
        map_h = len(grid)
        map_w = len(grid[0])
        
        frame_buffer = [[(' ', RESET) for _ in range(screen_w)] for _ in range(screen_h)]

        # Precompute player direction vectors
        dir_x = math.cos(self.player_angle)
        dir_y = math.sin(self.player_angle)
        
        # Perpendicular camera plane vector scaled by FOV
        fov_scale = math.tan(self.fov / 2.0)
        plane_x = -dir_y * fov_scale
        plane_y = dir_x * fov_scale

        for x in range(screen_w):
            # Calculate ray position and direction
            camera_x = 2.0 * x / float(screen_w) - 1.0  # Range [-1, 1]
            ray_dir_x = dir_x + plane_x * camera_x
            ray_dir_y = dir_y + plane_y * camera_x

            # DDA variables
            map_x = int(self.px)
            map_y = int(self.py)

            delta_dist_x = abs(1.0 / ray_dir_x) if ray_dir_x != 0 else float('inf')
            delta_dist_y = abs(1.0 / ray_dir_y) if ray_dir_y != 0 else float('inf')

            # Calculate step and initial side distance
            if ray_dir_x < 0:
                step_x = -1
                side_dist_x = (self.px - map_x) * delta_dist_x
            else:
                step_x = 1
                side_dist_x = (map_x + 1.0 - self.px) * delta_dist_x

            if ray_dir_y < 0:
                step_y = -1
                side_dist_y = (self.py - map_y) * delta_dist_y
            else:
                step_y = 1
                side_dist_y = (map_y + 1.0 - self.py) * delta_dist_y

            # DDA Marching
            hit = False
            side = 0  # 0 for East/West face hit, 1 for North/South face hit
            wall_type = '#'
            max_steps = 40
            steps = 0

            while not hit and steps < max_steps:
                steps += 1
                if side_dist_x < side_dist_y:
                    side_dist_x += delta_dist_x
                    map_x += step_x
                    side = 0
                else:
                    side_dist_y += delta_dist_y
                    map_y += step_y
                    side = 1

                # Check map bounds
                if map_y < 0 or map_y >= map_h or map_x < 0 or map_x >= map_w:
                    break

                # Check wall collision
                cell = grid[map_y][map_x]
                if cell != '.':
                    hit = True
                    wall_type = cell

            # Calculate projected distance
            if side == 0:
                perp_wall_dist = side_dist_x - delta_dist_x
            else:
                perp_wall_dist = side_dist_y - delta_dist_y

            # Prevent divide by zero / extreme values
            perp_wall_dist = max(0.05, perp_wall_dist)

            # Calculate wall draw height
            # Height multiplier adjusted for terminal row height vs column width
            # Standard terminals have ~2:1 height/width ratio, so we scale height down slightly
            line_h = int(screen_h / perp_wall_dist * 0.85)
            
            draw_start = -line_h // 2 + screen_h // 2
            draw_end = line_h // 2 + screen_h // 2

            # Clamp drawing limits
            draw_start_clamped = max(0, draw_start)
            draw_end_clamped = min(screen_h - 1, draw_end)

            # ── Draw Ceiling ──────────────────────────────────────────────────
            for y in range(0, draw_start_clamped):
                # Gradient fade towards the horizon
                fade = (screen_h / 2.0 - y) / (screen_h / 2.0)
                fade = max(0.0, min(1.0, fade * 1.2))
                
                r = int(theme["ceiling"][0] * fade)
                g = int(theme["ceiling"][1] * fade)
                b = int(theme["ceiling"][2] * fade)
                
                frame_buffer[y][x] = (theme["ceiling_char"], rgb_color(r, g, b))

            # ── Draw Wall ─────────────────────────────────────────────────────
            # Select colors based on wall type
            if wall_type == 'A':
                base_color = theme["secondary"]
            elif wall_type == 'B':
                base_color = theme["accent"]
            else:
                base_color = theme["primary"]

            # Depth Shading: wall gets darker in the distance
            shade = 1.0 / (1.0 + perp_wall_dist * 0.16 + perp_wall_dist * perp_wall_dist * 0.015)
            # Side face shadow for 3D corners
            if side == 1:
                shade *= 0.72

            shade = max(0.05, min(1.0, shade))
            wr = int(base_color[0] * shade)
            wg = int(base_color[1] * shade)
            wb = int(base_color[2] * shade)
            wall_ansi = rgb_color(wr, wg, wb)

            for y in range(draw_start_clamped, draw_end_clamped + 1):
                frame_buffer[y][x] = (theme["wall_char"], wall_ansi)

            # ── Draw Floor ────────────────────────────────────────────────────
            for y in range(draw_end_clamped + 1, screen_h):
                # Gradient fade (brighter closer to camera)
                fade = (y - screen_h / 2.0) / (screen_h / 2.0)
                fade = max(0.05, min(1.0, fade * 1.5))
                
                fr = int(theme["floor"][0] * fade)
                fg = int(theme["floor"][1] * fade)
                fb = int(theme["floor"][2] * fade)
                
                frame_buffer[y][x] = (theme["floor_char"], rgb_color(fr, fg, fb))

        # ── Draw Minimap Overlay ──────────────────────────────────────────────
        if self.show_minimap and screen_w > 55 and screen_h > 18:
            self._render_minimap(frame_buffer, grid, map_w, map_h, screen_w)

        return frame_buffer

    def _render_minimap(self, frame_buffer, grid, map_w, map_h, screen_w):
        # Draw map in top-right corner
        start_x = screen_w - map_w - 3
        start_y = 1
        
        # Border color for map
        border_ansi = rgb_color(100, 100, 100)
        
        # Top border
        for c in range(start_x - 1, start_x + map_w + 1):
            if 0 <= c < screen_w:
                frame_buffer[start_y - 1][c] = ('-', border_ansi)
                
        # Bottom border
        for c in range(start_x - 1, start_x + map_w + 1):
            if 0 <= c < screen_w:
                frame_buffer[start_y + map_h][c] = ('-', border_ansi)

        # Draw grid
        for my in range(map_h):
            # Left & right borders
            frame_buffer[start_y + my][start_x - 1] = ('|', border_ansi)
            frame_buffer[start_y + my][start_x + map_w] = ('|', border_ansi)
            
            for mx in range(map_w):
                cell_char = grid[my][mx]
                out_x = start_x + mx
                
                if int(self.py) == my and int(self.px) == mx:
                    # Draw player indicator based on facing angle
                    a = self.player_angle
                    # Normalize to [0, 2*pi]
                    norm_a = (a + 2 * math.pi) % (2 * math.pi)
                    if 0.25 * math.pi <= norm_a < 0.75 * math.pi:
                        p_char = '▼'
                    elif 0.75 * math.pi <= norm_a < 1.25 * math.pi:
                        p_char = '◄'
                    elif 1.25 * math.pi <= norm_a < 1.75 * math.pi:
                        p_char = '▲'
                    else:
                        p_char = '▶'
                    frame_buffer[start_y + my][out_x] = (p_char, rgb_color(255, 255, 0))
                elif cell_char != '.':
                    # Wall representation
                    if cell_char == 'A':
                        wall_c = rgb_color(0, 220, 220)
                    elif cell_char == 'B':
                        wall_c = rgb_color(220, 220, 0)
                    else:
                        wall_c = rgb_color(150, 150, 150)
                    frame_buffer[start_y + my][out_x] = ('█', wall_c)
                else:
                    # Empty space
                    frame_buffer[start_y + my][out_x] = ('·', rgb_color(60, 60, 60))

    def move_player(self, key_action):
        grid = MAPS[self.level_idx]["grid"]
        
        # Direction vector
        dx = math.cos(self.player_angle)
        dy = math.sin(self.player_angle)
        
        # Strafe vector
        sx = -dy
        sy = dx

        move_speed = 0.18
        rot_speed = 0.12
        
        new_px = self.px
        new_py = self.py

        if key_action == 'up':
            new_px += dx * move_speed
            new_py += dy * move_speed
        elif key_action == 'down':
            new_px -= dx * move_speed
            new_py -= dy * move_speed
        elif key_action == 'strafe_left':
            new_px -= sx * move_speed
            new_py -= sy * move_speed
        elif key_action == 'strafe_right':
            new_px += sx * move_speed
            new_py += sy * move_speed
        elif key_action == 'turn_left':
            self.player_angle -= rot_speed
        elif key_action == 'turn_right':
            self.player_angle += rot_speed

        # Keep angle in bounds [-pi, pi]
        self.player_angle = (self.player_angle + math.pi) % (2.0 * math.pi) - math.pi

        # ── Collision Detection (Wall Sliding) ───────────────────────────────
        # Check X movement independently
        if grid[int(self.py)][int(new_px)] == '.':
            self.px = new_px
        # Check Y movement independently
        if grid[int(new_py)][int(self.px)] == '.':
            self.py = new_py

    def render_frame(self, screen_w, screen_h):
        # Calculate full screen buffer
        frame_buffer = self.cast_rays(screen_w, screen_h)
        
        # Optimized double-buffering assembler:
        # Avoids spitting out duplicate ANSI color declarations for contiguous pixels
        output_lines = []
        for r in range(screen_h):
            line_parts = []
            active_color = None
            for c in range(screen_w):
                char, ansi_color = frame_buffer[r][c]
                if ansi_color != active_color:
                    if active_color is not None:
                        line_parts.append(RESET)
                    line_parts.append(ansi_color)
                    active_color = ansi_color
                line_parts.append(char)
            if active_color is not None:
                line_parts.append(RESET)
            output_lines.append("".join(line_parts))

        # Position cursor at top-left home (0,0) without clear-screen to prevent flickering
        sys.stdout.write("\033[H" + "\n".join(output_lines) + "\n")
        sys.stdout.flush()

    def draw_hud(self, screen_w, screen_h):
        theme = THEMES[self.theme_idx]
        level = MAPS[self.level_idx]
        
        # Assemble bottom status/HUD
        hud_bar_color = rgb_color(180, 180, 180)
        accent_c = rgb_color(*theme["primary"])
        
        lines = []
        lines.append(hud_bar_color + "+" + "-" * (screen_w - 2) + "+" + RESET)
        
        if self.show_hud:
            fps_str = f"FPS: {self.fps:.1f}"
            pos_str = f"Pos: ({self.px:.2f}, {self.py:.2f})  Angle: {self.player_angle:.2f} rad"
            state_str = f"Level: {accent_c}{level['name']}{hud_bar_color}  |  Theme: {accent_c}{theme['name']}{hud_bar_color}"
            
            # Pad details to layout correctly
            left_space = max(2, screen_w - len(fps_str) - len(pos_str) - len(level['name']) - len(theme['name']) - 32)
            hud_line = f"  {fps_str}  |  {pos_str}  |  {state_str}" + " " * left_space
            hud_line = hud_line[:screen_w - 4]
            lines.append(hud_bar_color + "| " + RESET + hud_line + hud_bar_color + " |" + RESET)
            
            # Command Guide
            controls = "  Controls: WASD/Arrows: Move/Look  [Q/E]: Strafe/Turn  [T]: Theme  [L]: Level  [M]: Minimap  [ESC]: Exit"
            controls = controls.ljust(screen_w - 4)[:screen_w - 4]
            lines.append(hud_bar_color + "| " + RESET + rgb_color(140, 140, 140) + controls + hud_bar_color + " |" + RESET)
        else:
            lines.append(hud_bar_color + "| " + RESET + "HUD is Hidden. Press [H] to restore hud display.".ljust(screen_w - 4) + hud_bar_color + " |" + RESET)
            
        lines.append(hud_bar_color + "+" + "-" * (screen_w - 2) + "+" + RESET)
        
        sys.stdout.write("\n".join(lines) + "\n")
        sys.stdout.flush()

    def run(self):
        clear_screen()
        
        # Cool startup splash screen
        splash = (
            rgb_color(0, 255, 255) + "   ====================================================\n" +
            rgb_color(0, 200, 255) + "   *             3D TERMINAL RAYCASTER                *\n" +
            rgb_color(0, 150, 255) + "   *       Interactive Retro Engine in Python         *\n" +
            rgb_color(0, 100, 255) + "   ====================================================\n\n" + RESET +
            "   Loading asset tables & setting up console buffers...\n"
        )
        print(splash)
        time.sleep(0.7)
        clear_screen()

        tick_delay = 0.03  # targeting ~33 FPS
        
        try:
            while self.running:
                loop_start = time.time()
                
                # Dynamic screen size
                screen_h, screen_w = self._get_terminal_size()
                
                # ── Handle Input ──────────────────────────────────────────────
                key = get_input()
                if key:
                    key_lower = key.lower()
                    
                    if key == 'esc' or key_lower == 'x':
                        self.running = False
                    elif key_lower == 'p':
                        self.paused = not self.paused
                        clear_screen()
                    elif key_lower == 't':
                        self.cycle_theme()
                        clear_screen()
                    elif key_lower == 'l':
                        self.load_level(self.level_idx + 1)
                        clear_screen()
                    elif key_lower == 'm':
                        self.show_minimap = not self.show_minimap
                        clear_screen()
                    elif key_lower == 'h':
                        self.show_hud = not self.show_hud
                        clear_screen()
                    else:
                        action = ARROW_MAP.get(key_lower)
                        if action and not self.paused:
                            self.move_player(action)

                # ── Render Frame ──────────────────────────────────────────────
                if not self.paused:
                    self.render_frame(screen_w, screen_h)
                    self.draw_hud(screen_w, screen_h)
                else:
                    # Draw a nice Pause Screen
                    pause_lines = [
                        "*" * screen_w,
                        " " * (screen_w // 2 - 5) + "GAME PAUSED",
                        " " * (screen_w // 2 - 12) + "Press [P] to Resume Game",
                        " " * (screen_w // 2 - 12) + "Press [T] to Cycle Themes",
                        " " * (screen_w // 2 - 12) + "Press [L] to Cycle Levels",
                        "*" * screen_w
                    ]
                    # Center vertically on terminal
                    pad_top = screen_h // 2 - 3
                    sys.stdout.write("\033[H" + "\n" * pad_top + "\n".join(pause_lines) + "\n")
                    sys.stdout.flush()

                # Frame-rate and timing calculations
                loop_end = time.time()
                frame_duration = loop_end - loop_start
                sleep_time = max(0.005, tick_delay - frame_duration)
                time.sleep(sleep_time)
                
                # Track exact FPS
                actual_duration = time.time() - loop_start
                self.fps_list.append(1.0 / actual_duration)
                if len(self.fps_list) > 15:
                    self.fps_list.pop(0)
                self.fps = sum(self.fps_list) / len(self.fps_list)

        except KeyboardInterrupt:
            pass
        finally:
            print(SHOW_CURSOR, end="")
            clear_screen()
            print(rgb_color(0, 255, 200) + "[*] Engine shutdown gracefully. Hope you enjoyed the 3D depth!\n" + RESET)

if __name__ == "__main__":
    RaycasterEngine().run()
