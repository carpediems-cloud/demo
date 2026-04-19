"""
+==================================================+
|        *  MATRIX DIGITAL RAIN  *                |
|   Terminal animation with interactive controls   |
+==================================================+

Controls:
  q  - Quit
  +  - Speed up
  -  - Slow down
  c  - Cycle color theme
  m  - Show/hide Matrix message
"""
import os
import sys
import io
import time
import random
import threading

# Force UTF-8 output on Windows
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# ── Platform-specific terminal setup ────────────────────────────────────────
IS_WINDOWS = sys.platform == "win32"
if IS_WINDOWS:
    import msvcrt
    def _getch_nonblock():
        return msvcrt.getwch() if msvcrt.kbhit() else None
else:
    import tty, termios, select
    def _getch_nonblock():
        if select.select([sys.stdin], [], [], 0)[0]:
            fd = sys.stdin.fileno()
            old = termios.tcgetattr(fd)
            try:
                tty.setraw(fd)
                return sys.stdin.read(1)
            finally:
                termios.tcsetattr(fd, termios.TCSADRAIN, old)
        return None

# ── ANSI helpers ─────────────────────────────────────────────────────────────
def clear():
    os.system("cls" if IS_WINDOWS else "clear")

def move(r, c):
    print(f"\033[{r};{c}H", end="")

def color(r, g, b):
    return f"\033[38;2;{r};{g};{b}m"

RESET = "\033[0m"
HIDE_CURSOR = "\033[?25l"
SHOW_CURSOR = "\033[?25h"

# ── Color themes (head_rgb, body_rgb_bright, body_rgb_dim) ───────────────────
THEMES = [
    {"name": "Matrix Green",  "head": (220, 255, 220), "bright": (0, 220, 60),  "dim": (0, 80, 20)},
    {"name": "Cyber Blue",    "head": (200, 240, 255), "bright": (30, 160, 255), "dim": (10, 50, 110)},
    {"name": "Blood Red",     "head": (255, 220, 220), "bright": (220, 40, 40),  "dim": (80, 10, 10)},
    {"name": "Gold Rush",     "head": (255, 255, 200), "bright": (200, 170, 0),  "dim": (80, 60, 0)},
    {"name": "Purple Haze",   "head": (240, 220, 255), "bright": (160, 60, 220), "dim": (60, 10, 90)},
]

# ── Characters pool ───────────────────────────────────────────────────────────
KATAKANA   = "abcdefghijklmnopqrstuvwxyz"
LATIN      = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&"
SYMBOLS    = "!?><|/\\~^*+=[]{}:;_"
ALL_CHARS  = KATAKANA + LATIN + SYMBOLS

# ── The Matrix message easter egg ────────────────────────────────────────────
MATRIX_MSG = [
    "  +==============================+  ",
    "  |  Wake up, Neo...             |  ",
    "  |  The Matrix has you.         |  ",
    "  |  Follow the white rabbit.    |  ",
    "  |                              |  ",
    "  |  Knock, knock, Neo.          |  ",
    "  +==============================+  ",
]

# ── Drop (column stream) class ────────────────────────────────────────────────
class Drop:
    def __init__(self, col, rows):
        self.col   = col
        self.rows  = rows
        self.reset()

    def reset(self):
        self.length  = random.randint(6, 28)
        self.head    = random.randint(-self.length, 0)   # starts above screen
        self.speed   = random.uniform(0.5, 1.5)          # relative speed multiplier
        self.chars   = [random.choice(ALL_CHARS) for _ in range(self.length + 2)]
        self.tick    = 0

    def step(self):
        self.tick += 1
        if self.tick >= (1.0 / self.speed):
            self.head += 1
            self.tick  = 0
            # randomly mutate one char
            idx = random.randint(0, len(self.chars) - 1)
            self.chars[idx] = random.choice(ALL_CHARS)
        if self.head - self.length > self.rows:
            self.reset()

    def render_lines(self, theme):
        """Return {row: (char, ansi_color)} for visible cells of this drop."""
        cells = {}
        h = theme["head"]
        b = theme["bright"]
        d = theme["dim"]
        for offset in range(self.length):
            row = self.head - offset
            if 0 <= row < self.rows:
                char = self.chars[offset % len(self.chars)]
                if offset == 0:
                    # Brightest head character
                    c = color(*h)
                elif offset < 4:
                    c = color(*b)
                else:
                    # Fade to dim
                    fade = 1 - (offset / self.length)
                    r = int(d[0] + (b[0] - d[0]) * fade)
                    g = int(d[1] + (b[1] - d[1]) * fade)
                    bl = int(d[2] + (b[2] - d[2]) * fade)
                    c = color(r, g, bl)
                cells[row] = (char, c)
        return cells

# ── Renderer ──────────────────────────────────────────────────────────────────
class MatrixRain:
    def __init__(self):
        self.running      = True
        self.theme_idx    = 0
        self.delay        = 0.05       # seconds between frames
        self.show_msg     = False
        self.msg_timer    = 0
        self._lock        = threading.Lock()
        self._setup_terminal()

    def _setup_terminal(self):
        if IS_WINDOWS:
            os.system("color")         # enable ANSI on Windows
        clear()
        print(HIDE_CURSOR, end="", flush=True)

    def _get_size(self):
        try:
            size = os.get_terminal_size()
            return size.lines - 1, size.columns
        except:
            return 24, 80

    def _draw_hud(self, rows, cols, theme):
        t = theme["name"]
        fps_str = f"MATRIX RAIN  |  Theme: {t}  |  [+/-] speed  [c] theme  [m] message  [q] quit"
        fps_str = fps_str[:cols - 1]
        move(rows + 1, 1)
        print(color(*theme["bright"]) + fps_str + RESET, end="", flush=True)

    def _draw_message(self, rows, cols):
        mid_row = rows // 2 - len(MATRIX_MSG) // 2
        mid_col = cols // 2 - len(MATRIX_MSG[0]) // 2
        for i, line in enumerate(MATRIX_MSG):
            move(mid_row + i, max(1, mid_col))
            print(color(0, 255, 80) + line + RESET, end="")

    def run(self):
        rows, cols = self._get_size()
        drops = [Drop(c, rows) for c in range(1, cols + 1)]
        frame = 0

        try:
            while self.running:
                rows, cols = self._get_size()

                # Adjust drops if terminal resized
                if len(drops) < cols:
                    drops += [Drop(c, rows) for c in range(len(drops) + 1, cols + 1)]
                elif len(drops) > cols:
                    drops = drops[:cols]

                # Collect all cells for this frame
                theme = THEMES[self.theme_idx]
                all_cells = {}   # (row, col) -> (char, ansi_color)

                for i, drop in enumerate(drops):
                    drop.rows = rows
                    drop.step()
                    col = i + 1
                    for row, (ch, c) in drop.render_lines(theme).items():
                        all_cells[(row + 1, col)] = (ch, c)

                # Render all cells (batch print to reduce flicker)
                buf = []
                for (r, c), (ch, col_code) in all_cells.items():
                    buf.append(f"\033[{r};{c}H{col_code}{ch}{RESET}")
                sys.stdout.write("".join(buf))
                sys.stdout.flush()

                # HUD
                self._draw_hud(rows, cols, theme)

                # Easter egg message
                if self.show_msg:
                    self._draw_message(rows, cols)
                    self.msg_timer -= 1
                    if self.msg_timer <= 0:
                        self.show_msg = False

                # Input (non-blocking)
                ch = _getch_nonblock()
                if ch:
                    ch = ch.lower()
                    if ch == 'q':
                        self.running = False
                    elif ch == '+':
                        self.delay = max(0.01, self.delay - 0.01)
                    elif ch == '-':
                        self.delay = min(0.3, self.delay + 0.01)
                    elif ch == 'c':
                        self.theme_idx = (self.theme_idx + 1) % len(THEMES)
                        clear()
                    elif ch == 'm':
                        self.show_msg  = True
                        self.msg_timer = 60

                time.sleep(self.delay)
                frame += 1

        except KeyboardInterrupt:
            pass
        finally:
            print(SHOW_CURSOR, end="")
            clear()
            print(color(0, 220, 60) + "[*] Exited the Matrix. Welcome back.\n" + RESET)

# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    MatrixRain().run()
