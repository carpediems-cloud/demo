"""
+===================================================+
|           *  3D TERMINAL SHAPE EXPLORER  *        |
|    Interactive mathematical projection engine     |
+===================================================+

A rich terminal-based 3D renderer displaying various geometric shapes.
Supports real-time rotation, custom shader modes, multiple color palettes, 
dynamic lighting, camera zoom, and smooth, flicker-free rendering.

Controls:
  Arrow Keys / WASD - Rotate shape (adds physical momentum)
  + / -             - Zoom in / Zoom out (focal distance)
  c / C             - Cycle color theme
  s / S             - Cycle 3D shape geometry
  h / H             - Toggle normal shading (rainbow) vs luminance shading
  p / P             - Pause / Resume auto-rotation
  q / Q             - Quit explorer
"""

import os
import sys
import io
import time
import math
import random

# Force UTF-8 output on Windows for clean rendering of borders and chars
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

# ── Color Themes ─────────────────────────────────────────────────────────────
THEMES = [
    {
        "name": "Neon Cyan",
        "bg": (20, 20, 25),
        "func": lambda L, z_val, nx, ny, nz: (
            int(30 * L),
            int(150 + 105 * L),
            int(200 + 55 * L)
        )
    },
    {
        "name": "Matrix Green",
        "bg": (10, 20, 10),
        "func": lambda L, z_val, nx, ny, nz: (
            0,
            int(70 + 185 * L),
            int(20 * L)
        )
    },
    {
        "name": "Fire Glow",
        "bg": (25, 10, 5),
        "func": lambda L, z_val, nx, ny, nz: (
            int(130 + 125 * L),
            int(230 * (L ** 2.2)),
            int(120 * (L ** 5))
        )
    },
    {
        "name": "Sunset Magenta",
        "bg": (20, 10, 25),
        "func": lambda L, z_val, nx, ny, nz: (
            int(160 + 95 * L),
            int(25 + 50 * L),
            int(180 + 75 * (1 - L))
        )
    },
    {
        "name": "Gold / Bronze",
        "bg": (20, 15, 10),
        "func": lambda L, z_val, nx, ny, nz: (
            int(170 + 85 * L),
            int(120 + 100 * L),
            int(30 + 50 * L)
        )
    }
]

# Shading characters sorted by visual density (12 levels)
SHADE_CHARS = ".,-~:;=!*#$@"

class ShapeExplorer3D:
    def __init__(self):
        self.running = True
        self.width = 80
        self.height = 30
        
        # Camera & Projection settings
        self.K1 = 45.0  # Projection focal scale
        self.D = 38.0   # Camera distance
        
        # Rotation angles (radians)
        self.A = 0.0
        self.B = 0.0
        self.C = 0.0
        
        # Rotation velocities (momentum-based)
        self.vel_A = 0.0
        self.vel_B = 0.0
        self.vel_C = 0.0
        
        self.auto_rotate = True
        self.normal_shading = False # If True, maps normal vector (nx, ny, nz) to RGB
        self.theme_idx = 0
        self.shape_idx = 0
        
        self.shapes = ["Torus", "Sphere", "Mobius Strip", "Trefoil Knot", "Cube"]
        self.base_points = []
        self.generate_shape_points()
        
        # Setup console
        if IS_WINDOWS:
            os.system("color")  # Enable ANSI escape sequences on Windows
        clear()
        print(HIDE_CURSOR, end="", flush=True)

    def generate_shape_points(self):
        """Pre-computes vertices and surface normal vectors for the selected shape."""
        self.base_points = []
        shape = self.shapes[self.shape_idx]
        
        if shape == "Torus":
            u_steps, v_steps = 72, 32
            R1, R2 = 12.0, 5.5
            for i in range(u_steps):
                u = i * (2.0 * math.pi / u_steps)
                cos_u, sin_u = math.cos(u), math.sin(u)
                for j in range(v_steps):
                    v = j * (2.0 * math.pi / v_steps)
                    cos_v, sin_v = math.cos(v), math.sin(v)
                    
                    x = (R1 + R2 * cos_v) * cos_u
                    y = (R1 + R2 * cos_v) * sin_u
                    z = R2 * sin_v
                    
                    nx = cos_v * cos_u
                    ny = cos_v * sin_u
                    nz = sin_v
                    self.base_points.append((x, y, z, nx, ny, nz))
                    
        elif shape == "Sphere":
            u_steps, v_steps = 60, 30
            R = 9.5
            for i in range(u_steps):
                u = i * (2.0 * math.pi / u_steps)
                cos_u, sin_u = math.cos(u), math.sin(u)
                for j in range(v_steps):
                    # v from -pi/2 to pi/2
                    v = -math.pi/2.0 + j * (math.pi / v_steps)
                    cos_v, sin_v = math.cos(v), math.sin(v)
                    
                    x = R * cos_v * cos_u
                    y = R * cos_v * sin_u
                    z = R * sin_v
                    
                    self.base_points.append((x, y, z, cos_v * cos_u, cos_v * sin_u, sin_v))
                    
        elif shape == "Mobius Strip":
            u_steps, v_steps = 90, 16
            R = 10.0
            for i in range(u_steps):
                u = i * (2.0 * math.pi / u_steps)
                cos_u, sin_u = math.cos(u), math.sin(u)
                cos_u2, sin_u2 = math.cos(u / 2.0), math.sin(u / 2.0)
                for j in range(v_steps):
                    # v from -3.0 to 3.0
                    v = -3.0 + j * (6.0 / (v_steps - 1))
                    
                    x = (R + v * cos_u2) * cos_u
                    y = (R + v * cos_u2) * sin_u
                    z = v * sin_u2
                    
                    # Numerical normal calculation (perfectly robust)
                    eps = 1e-4
                    # u displacement
                    u1 = u + eps
                    x1 = (R + v * math.cos(u1 / 2.0)) * math.cos(u1)
                    y1 = (R + v * math.cos(u1 / 2.0)) * math.sin(u1)
                    z1 = v * math.sin(u1 / 2.0)
                    
                    u2 = u - eps
                    x2 = (R + v * math.cos(u2 / 2.0)) * math.cos(u2)
                    y2 = (R + v * math.cos(u2 / 2.0)) * math.sin(u2)
                    z2 = v * math.sin(u2 / 2.0)
                    du = (x1-x2, y1-y2, z1-z2)
                    
                    # v displacement
                    v1 = v + eps
                    x3 = (R + v1 * cos_u2) * cos_u
                    y3 = (R + v1 * cos_u2) * sin_u
                    z3 = v1 * sin_u2
                    
                    v2 = v - eps
                    x4 = (R + v2 * cos_u2) * cos_u
                    y4 = (R + v2 * cos_u2) * sin_u
                    z4 = v2 * sin_u2
                    dv = (x3-x4, y3-y4, z3-z4)
                    
                    # Normal = du X dv
                    nx = du[1]*dv[2] - du[2]*dv[1]
                    ny = du[2]*dv[0] - du[0]*dv[2]
                    nz = du[0]*dv[1] - du[1]*dv[0]
                    
                    l = math.sqrt(nx*nx + ny*ny + nz*nz)
                    if l > 0:
                        nx, ny, nz = nx/l, ny/l, nz/l
                    else:
                        nx, ny, nz = 0.0, 0.0, 1.0
                    
                    self.base_points.append((x, y, z, nx, ny, nz))
                    
        elif shape == "Trefoil Knot":
            scale = 3.6
            t_steps, theta_steps = 110, 12
            r_tube = 1.3
            for i in range(t_steps):
                t = i * (2.0 * math.pi / t_steps)
                # Core coordinates
                cx = scale * (math.sin(t) + 2.0 * math.sin(2.0 * t))
                cy = scale * (math.cos(t) - 2.0 * math.cos(2.0 * t))
                cz = scale * (-math.sin(3.0 * t))
                
                # Tangent vector derivative
                tx = scale * (math.cos(t) + 4.0 * math.cos(2.0 * t))
                ty = scale * (-math.sin(t) + 4.0 * math.sin(2.0 * t))
                tz = scale * (-3.0 * math.cos(3.0 * t))
                
                tl = math.sqrt(tx*tx + ty*ty + tz*tz)
                if tl > 0:
                    tx, ty, tz = tx/tl, ty/tl, tz/tl
                else:
                    tx, ty, tz = 1.0, 0.0, 0.0
                    
                # Perpendicular axis A (use secondary vector)
                ax, ay, az = 0.0, 1.0, 0.0
                if abs(ty) > 0.9:
                    ax, ay, az = 1.0, 0.0, 0.0
                    
                # N = T x A
                nx_t = ty*az - tz*ay
                ny_t = tz*ax - tx*az
                nz_t = tx*ay - ty*ax
                nl = math.sqrt(nx_t*nx_t + ny_t*ny_t + nz_t*nz_t)
                if nl > 0:
                    nx_t, ny_t, nz_t = nx_t/nl, ny_t/nl, nz_t/nl
                else:
                    nx_t, ny_t, nz_t = 0.0, 0.0, 1.0
                    
                # B = T x N
                bx = ty*nz_t - tz*ny_t
                by = tz*nx_t - tx*nz_t
                bz = tx*ny_t - ty*nx_t
                
                for j in range(theta_steps):
                    theta = j * (2.0 * math.pi / theta_steps)
                    cos_th, sin_th = math.cos(theta), math.sin(theta)
                    
                    x = cx + r_tube * (cos_th * nx_t + sin_th * bx)
                    y = cy + r_tube * (cos_th * nx_t + sin_th * bx)
                    z = cz + r_tube * (cos_th * nz_t + sin_th * bz)
                    
                    nx = cos_th * nx_t + sin_th * bx
                    ny = cos_th * ny_t + sin_th * by
                    nz = cos_th * nz_t + sin_th * bz
                    
                    # Normalize
                    nl = math.sqrt(nx*nx + ny*ny + nz*nz)
                    if nl > 0:
                        nx, ny, nz = nx/nl, ny/nl, nz/nl
                    else:
                        nx, ny, nz = 0.0, 0.0, 1.0
                    
                    self.base_points.append((x, y, z, nx, ny, nz))
                    
        elif shape == "Cube":
            S = 7.0
            steps = 14
            faces = [
                (1.0, 0.0, 0.0, (0.0, 1.0, 0.0), (0.0, 0.0, 1.0), S),    # Right
                (-1.0, 0.0, 0.0, (0.0, 1.0, 0.0), (0.0, 0.0, -1.0), -S), # Left
                (0.0, 1.0, 0.0, (1.0, 0.0, 0.0), (0.0, 0.0, 1.0), S),    # Top
                (0.0, -1.0, 0.0, (1.0, 0.0, 0.0), (0.0, 0.0, -1.0), -S), # Bottom
                (0.0, 0.0, 1.0, (1.0, 0.0, 0.0), (0.0, 1.0, 0.0), S),    # Front
                (0.0, 0.0, -1.0, (-1.0, 0.0, 0.0), (0.0, 1.0, 0.0), -S)  # Back
            ]
            for nx, ny, nz, u_ax, v_ax, const in faces:
                for i in range(steps):
                    u_val = -S + i * (2.0 * S / (steps - 1))
                    for j in range(steps):
                        v_val = -S + j * (2.0 * S / (steps - 1))
                        
                        x = nx * const + u_ax[0] * u_val + v_ax[0] * v_val
                        y = ny * const + u_ax[1] * u_val + v_ax[1] * v_val
                        z = nz * const + u_ax[2] * u_val + v_ax[2] * v_val
                        
                        self.base_points.append((x, y, z, nx, ny, nz))

    def _get_terminal_dimensions(self):
        try:
            size = os.get_terminal_size()
            return size.lines - 5, size.columns
        except:
            return 25, 80

    def render_frame(self):
        """Performs 3D rotations, camera projection, depth checks, and ANSI rendering."""
        lines, cols = self._get_terminal_dimensions()
        
        # Center shape on terminal window dynamically
        self.width = min(80, cols - 2)
        self.height = min(30, lines - 2)
        
        # Aspect ratio adjustment: characters are about 2.1x taller than they are wide
        aspect_ratio = 0.48
        
        # Set up Z-buffer and screen buffer
        screen = [[" " for _ in range(self.width)] for _ in range(self.height)]
        z_buffer = [[0.0 for _ in range(self.width)] for _ in range(self.height)]
        
        # Precompute trigonometry
        sin_A, cos_A = math.sin(self.A), math.cos(self.A)
        sin_B, cos_B = math.sin(self.B), math.cos(self.B)
        sin_C, cos_C = math.sin(self.C), math.cos(self.C)
        
        # Light direction vector (normalized)
        lx, ly, lz = 0.0, 1.0, -1.0
        l_len = math.sqrt(lx*lx + ly*ly + lz*lz)
        lx, ly, lz = lx/l_len, ly/l_len, lz/l_len
        
        theme = THEMES[self.theme_idx]
        
        # Project each point
        for x, y, z, nx, ny, nz in self.base_points:
            # 1. Rotate point in 3D
            # Rotation around X-axis
            y1 = y * cos_A - z * sin_A
            z1 = y * sin_A + z * cos_A
            
            # Rotation around Y-axis
            x2 = x * cos_B + z1 * sin_B
            z2 = -x * sin_B + z1 * cos_B
            
            # Rotation around Z-axis
            x3 = x2 * cos_C - y1 * sin_C
            y3 = x2 * sin_C + y1 * cos_C
            
            # 2. Rotate normal vector
            # Normal X-rotation
            ny1 = ny * cos_A - nz * sin_A
            nz1 = ny * sin_A + nz * cos_A
            # Normal Y-rotation
            nx2 = nx * cos_B + nz1 * sin_B
            nz2 = -nx * sin_B + nz1 * cos_B
            # Normal Z-rotation
            nx3 = nx2 * cos_C - ny1 * sin_C
            ny3 = nx2 * sin_C + ny1 * cos_C
            
            # 3. Projection calculations
            z_projected = self.D + z2
            ooz = 1.0 / z_projected  # One over Z (depth value)
            
            # Screen projection coordinates (centered)
            xp = int(self.width / 2.0 + self.K1 * x3 * ooz)
            yp = int(self.height / 2.0 - (self.K1 * y3 * ooz) * aspect_ratio)
            
            # Check viewport boundaries
            if 0 <= xp < self.width and 0 <= yp < self.height:
                # Z-buffer test: larger ooz means closer to the camera
                if ooz > z_buffer[yp][xp]:
                    z_buffer[yp][xp] = ooz
                    
                    # 4. Lighting & Shading
                    L = nx3 * lx + ny3 * ly + nz2 * lz
                    L = max(0.0, min(1.0, L))  # Clamp between 0.0 and 1.0
                    
                    # Map luminance to char
                    char_idx = int(L * (len(SHADE_CHARS) - 1))
                    char = SHADE_CHARS[char_idx]
                    
                    # 5. Color Shader Calculation
                    if self.normal_shading:
                        # Normal vector mapping directly to RGB color (like normal maps in games)
                        r = int((nx3 + 1.0) * 127.5)
                        g = int((ny3 + 1.0) * 127.5)
                        b = int((nz2 + 1.0) * 127.5)
                    else:
                        # Theme-based color shader mapping
                        r, g, b = theme["func"](L, z2, nx3, ny3, nz2)
                        
                    # Clamp color ranges
                    r = max(0, min(255, r))
                    g = max(0, min(255, g))
                    b = max(0, min(255, b))
                    
                    screen[yp][xp] = rgb_color(r, g, b) + char + RESET

        # Assemble final frame buffer string to draw in single print call (no flicker!)
        buf = []
        
        # Border Top
        border_col = rgb_color(80, 80, 80)
        buf.append(border_col + "┌" + "─" * self.width + "┐\n" + RESET)
        
        # Screen rows
        for row in screen:
            buf.append(border_col + "│" + RESET)
            buf.append("".join(row))
            buf.append(border_col + "│\n" + RESET)
            
        # Border Bottom
        buf.append(border_col + "└" + "─" * self.width + "┘\n" + RESET)
        
        # HUD Information
        hud_color = rgb_color(160, 160, 160)
        shape_name = self.shapes[self.shape_idx]
        theme_name = "NORMAL MAPS" if self.normal_shading else theme["name"]
        
        status_line = (
            f" Shape: {rgb_color(255,180,50)}{shape_name}{RESET}  │"
            f"  Theme: {rgb_color(50,220,255)}{theme_name}{RESET}  │"
            f"  Focal Length (K1): {self.K1:.1f}  │"
            f"  Auto-Rotate: {'ON' if self.auto_rotate else 'OFF'}"
        )
        buf.append(status_line + "\n")
        
        controls_line = (
            " Rotate: [WASD / Arrows]  │  Zoom: [+/-]  │  Shape: [s]  │  Theme: [c]  │"
            " Shader: [h]  │  Quit: [q]"
        )
        buf.append(hud_color + controls_line + RESET + "\n")
        
        # Move cursor to top-left and write full frame
        move_cursor(3, 1)
        sys.stdout.write("".join(buf))
        sys.stdout.flush()

    def run(self):
        clear()
        
        # Print high quality header
        hdr_glow = rgb_color(50, 220, 180)
        header = (
            hdr_glow + "  +===================================================+\n" +
            hdr_glow + "  |           *  3D TERMINAL SHAPE EXPLORER  *        |\n" +
            hdr_glow + "  |    Real-time interactive mathematical projection  |\n" +
            hdr_glow + "  +===================================================+\n" + RESET
        )
        print(header)
        
        self.render_frame()
        
        last_time = time.time()
        
        try:
            while self.running:
                # Calculate Delta Time for smooth animation independent of key inputs
                current_time = time.time()
                dt = current_time - last_time
                last_time = current_time
                
                # ── Rotation physics ──────────────────────────────────────────
                if self.auto_rotate:
                    # Constant gentle rotation over time
                    self.A += 1.2 * dt
                    self.B += 0.6 * dt
                    self.C += 0.2 * dt
                
                # Apply velocity rotation inputs (adds momentum/inertia)
                self.A += self.vel_A
                self.B += self.vel_B
                self.C += self.vel_C
                
                # Decay velocities (friction simulation)
                self.vel_A *= 0.90
                self.vel_B *= 0.90
                self.vel_C *= 0.90
                
                # ── Process Key Inputs ───────────────────────────────────────
                key = get_input()
                if key:
                    key_lower = key.lower()
                    
                    if key_lower == 'q':
                        self.running = False
                        
                    elif key_lower == 'p':
                        self.auto_rotate = not self.auto_rotate
                        # Reset manual velocity when toggling auto-rotate
                        self.vel_A = 0.0
                        self.vel_B = 0.0
                        self.vel_C = 0.0
                        
                    elif key_lower == 'c':
                        # Cycle theme
                        self.normal_shading = False
                        self.theme_idx = (self.theme_idx + 1) % len(THEMES)
                        
                    elif key_lower == 'h':
                        # Toggle normal vector shader vs standard theme shader
                        self.normal_shading = not self.normal_shading
                        
                    elif key_lower == 's':
                        # Cycle Shape
                        self.shape_idx = (self.shape_idx + 1) % len(self.shapes)
                        self.generate_shape_points()
                        
                    elif key == '+':
                        self.K1 = min(100.0, self.K1 + 2.0)
                    elif key == '-':
                        self.K1 = max(10.0, self.K1 - 2.0)
                        
                    # Handle arrow keys or WASD for manual momentum rotation
                    mapped_direction = ARROW_MAP.get(key_lower)
                    if mapped_direction:
                        # Disable auto rotation so the user can control manually
                        self.auto_rotate = False
                        
                        if mapped_direction == 'up':
                            self.vel_A -= 0.06
                        elif mapped_direction == 'down':
                            self.vel_A += 0.06
                        elif mapped_direction == 'left':
                            self.vel_B -= 0.08
                        elif mapped_direction == 'right':
                            self.vel_B += 0.08
                            
                # ── Draw Render Frame ─────────────────────────────────────────
                self.render_frame()
                
                # Sleep a short duration to target ~45 FPS
                time.sleep(max(0.01, 0.022 - (time.time() - current_time)))
                
        except KeyboardInterrupt:
            pass
        finally:
            print(SHOW_CURSOR, end="")
            clear()
            print(rgb_color(50, 220, 180) + "[*] 3D Shape Explorer closed. Thanks for exploring!\n" + RESET)

if __name__ == "__main__":
    ShapeExplorer3D().run()
