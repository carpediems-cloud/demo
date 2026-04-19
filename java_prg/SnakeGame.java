import java.io.*;
import java.util.*;

/**
 * ╔══════════════════════════════════════════╗
 * ║        SNAKE GAME - Terminal Edition     ║
 * ║  Use WASD or Arrow Keys to move          ║
 * ║  Eat (*) to grow and score points        ║
 * ║  Avoid walls and your own body!          ║
 * ╚══════════════════════════════════════════╝
 *
 * Compile : javac SnakeGame.java
 * Run     : java SnakeGame
 */
public class SnakeGame {

    // ── Board dimensions ─────────────────────────────────────────────────────
    static final int WIDTH  = 40;
    static final int HEIGHT = 20;

    // ── ANSI color codes ─────────────────────────────────────────────────────
    static final String RESET   = "\033[0m";
    static final String GREEN   = "\033[92m";
    static final String YELLOW  = "\033[93m";
    static final String RED     = "\033[91m";
    static final String CYAN    = "\033[96m";
    static final String WHITE   = "\033[97m";
    static final String MAGENTA = "\033[95m";
    static final String BOLD    = "\033[1m";
    static final String CLEAR   = "\033[H\033[2J";
    static final String HIDE_CURSOR = "\033[?25l";
    static final String SHOW_CURSOR = "\033[?25h";

    // ── Direction constants ───────────────────────────────────────────────────
    static final int UP    = 0;
    static final int RIGHT = 1;
    static final int DOWN  = 2;
    static final int LEFT  = 3;

    // ── Game state ────────────────────────────────────────────────────────────
    static LinkedList<int[]> snake = new LinkedList<>();  // [row, col]
    static int[] food = new int[2];
    static int direction  = RIGHT;
    static int nextDir    = RIGHT;
    static int score      = 0;
    static int highScore  = 0;
    static boolean running = true;
    static boolean paused  = false;

    static Random rng = new Random();

    // ── Terminal raw-mode helpers (Windows via msvcrt, Unix via stty) ─────────
    static boolean isWindows = System.getProperty("os.name").toLowerCase().contains("win");

    public static void main(String[] args) throws Exception {
        // Enable ANSI on Windows
        if (isWindows) {
            new ProcessBuilder("cmd", "/c", "").inheritIO().start().waitFor();
        }

        System.out.print(HIDE_CURSOR);
        Runtime.getRuntime().addShutdownHook(new Thread(() ->
            System.out.print(SHOW_CURSOR + RESET)));

        showSplash();

        // Input thread
        Thread inputThread = new Thread(SnakeGame::readInput);
        inputThread.setDaemon(true);
        inputThread.start();

        do {
            startGame();
            if (score > highScore) highScore = score;
            showGameOver();
        } while (askPlayAgain());

        System.out.print(CLEAR + SHOW_CURSOR);
        System.out.println(CYAN + BOLD + "Thanks for playing Snake! Final High Score: " + highScore + RESET);
    }

    // ── Game loop ─────────────────────────────────────────────────────────────
    static void startGame() throws Exception {
        // Initialize snake at center, length 3
        snake.clear();
        int startRow = HEIGHT / 2;
        
        int startCol = WIDTH  / 2;
        for (int i = 2; i >= 0; i--) {
            snake.addFirst(new int[]{startRow, startCol - i});
        }
        direction = RIGHT;
        nextDir   = RIGHT;
        score     = 0;
        running   = true;
        paused    = false;
        placeFood();

        long delay = 150;  // ms per frame (lower = faster)

        while (running) {
            if (!paused) {
                direction = nextDir;
                if (!moveSnake()) {
                    running = false;
                    break;
                }
                render();
                // Speed up every 5 points
                delay = Math.max(60, 150 - (score / 5) * 10L);
            }
            Thread.sleep(delay);
        }
    }

    // ── Move snake one step; returns false on collision ───────────────────────
    static boolean moveSnake() {
        int[] head = snake.getFirst();
        int newRow = head[0];
        int newCol = head[1];

        if      (direction == UP)    newRow--;
        else if (direction == DOWN)  newRow++;
        else if (direction == LEFT)  newCol--;
        else if (direction == RIGHT) newCol++;

        // Wall collision
        if (newRow < 0 || newRow >= HEIGHT || newCol < 0 || newCol >= WIDTH) return false;

        // Self collision
        for (int[] seg : snake) {
            if (seg[0] == newRow && seg[1] == newCol) return false;
        }

        snake.addFirst(new int[]{newRow, newCol});

        // Ate food?
        if (newRow == food[0] && newCol == food[1]) {
            score += 10;
            placeFood();
        } else {
            snake.removeLast();
        }
        return true;
    }

    // ── Place food at a random empty cell ────────────────────────────────────
    static void placeFood() {
        outer:
        while (true) {
            int r = rng.nextInt(HEIGHT);
            int c = rng.nextInt(WIDTH);
            for (int[] seg : snake) {
                if (seg[0] == r && seg[1] == c) continue outer;
            }
            food[0] = r;
            food[1] = c;
            return;
        }
    }

    // ── Render the board ─────────────────────────────────────────────────────
    static void render() {
        StringBuilder sb = new StringBuilder();
        sb.append(CLEAR);

        // Title bar
        sb.append(BOLD).append(CYAN)
          .append("  ╔══ SNAKE GAME ══╗  ")
          .append(YELLOW).append("Score: ").append(WHITE).append(String.format("%4d", score))
          .append(YELLOW).append("   Hi-Score: ").append(WHITE).append(String.format("%4d", highScore))
          .append(CYAN).append("   ").append(MAGENTA).append("[P]ause  [Q]uit").append(RESET).append("\n");

        // Top border
        sb.append(WHITE).append("  +");
        for (int c = 0; c < WIDTH; c++) sb.append('-');
        sb.append("+\n");

        // Board rows
        char[][] board = new char[HEIGHT][WIDTH];
        for (char[] row : board) Arrays.fill(row, ' ');

        // Place food
        board[food[0]][food[1]] = '*';

        // Place snake body
        boolean first = true;
        for (int[] seg : snake) {
            board[seg[0]][seg[1]] = first ? 'O' : 'o';
            first = false;
        }

        for (int r = 0; r < HEIGHT; r++) {
            sb.append(WHITE).append("  |");
            for (int c = 0; c < WIDTH; c++) {
                char ch = board[r][c];
                if (ch == 'O') {
                    sb.append(GREEN).append(BOLD).append('@').append(RESET);
                } else if (ch == 'o') {
                    sb.append(GREEN).append('o').append(RESET);
                } else if (ch == '*') {
                    sb.append(RED).append(BOLD).append('*').append(RESET);
                } else {
                    sb.append(' ');
                }
            }
            sb.append(WHITE).append("|\n");
        }

        // Bottom border
        sb.append(WHITE).append("  +");
        for (int c = 0; c < WIDTH; c++) sb.append('-');
        sb.append("+\n");

        // Controls hint
        sb.append(CYAN).append("  WASD / Arrow Keys to move")
          .append("   Length: ").append(WHITE).append(snake.size())
          .append(CYAN).append("   Speed: ").append(WHITE)
          .append(Math.min(10, 1 + score / 50)).append("/10\n").append(RESET);

        if (paused) {
            sb.append("\n  ").append(YELLOW).append(BOLD).append("*** PAUSED - Press P to resume ***").append(RESET);
        }

        System.out.print(sb);
    }

    // ── Non-blocking keyboard input ───────────────────────────────────────────
    static void readInput() {
        try {
            configureTerminal(true);
            while (true) {
                int ch = System.in.read();
                if (ch == -1) break;

                // Handle escape sequences for arrow keys
                if (ch == 27) {
                    int next = System.in.read();
                    if (next == '[') {
                        int arrow = System.in.read();
                        switch (arrow) {
                            case 'A': setDir(UP);    break;
                            case 'B': setDir(DOWN);  break;
                            case 'C': setDir(RIGHT); break;
                            case 'D': setDir(LEFT);  break;
                        }
                    }
                    continue;
                }

                switch (Character.toLowerCase((char) ch)) {
                    case 'w': setDir(UP);    break;
                    case 's': setDir(DOWN);  break;
                    case 'a': setDir(LEFT);  break;
                    case 'd': setDir(RIGHT); break;
                    case 'p': paused = !paused; break;
                    case 'q': running = false;  break;
                }
            }
        } catch (Exception e) {
            // Ignore
        } finally {
            configureTerminal(false);
        }
    }

    static void setDir(int d) {
        // Prevent reversing direction
        if ((d == UP && direction != DOWN)   ||
            (d == DOWN && direction != UP)   ||
            (d == LEFT && direction != RIGHT) ||
            (d == RIGHT && direction != LEFT)) {
            nextDir = d;
        }
    }

    // ── Configure terminal for raw mode (Unix) ────────────────────────────────
    static String savedStty = null;

    static void configureTerminal(boolean raw) {
        if (isWindows) return;  // Windows reads fine via System.in
        try {
            if (raw) {
                // Save current settings
                Process save = Runtime.getRuntime().exec(new String[]{"sh", "-c", "stty -g < /dev/tty"});
                savedStty = new String(save.getInputStream().readAllBytes()).trim();
                Runtime.getRuntime().exec(new String[]{"sh", "-c", "stty raw -echo < /dev/tty"}).waitFor();
            } else {
                if (savedStty != null) {
                    Runtime.getRuntime().exec(new String[]{"sh", "-c", "stty " + savedStty + " < /dev/tty"}).waitFor();
                }
            }
        } catch (Exception e) { /* ignore */ }
    }

    // ── Splash screen ─────────────────────────────────────────────────────────
    static void showSplash() throws Exception {
        System.out.print(CLEAR);
        System.out.println();
        System.out.println(GREEN + BOLD + "  ███████╗███╗   ██╗ █████╗ ██╗  ██╗███████╗" + RESET);
        System.out.println(GREEN + BOLD + "  ██╔════╝████╗  ██║██╔══██╗██║ ██╔╝██╔════╝" + RESET);
        System.out.println(GREEN + BOLD + "  ███████╗██╔██╗ ██║███████║█████╔╝ █████╗  " + RESET);
        System.out.println(GREEN + BOLD + "  ╚════██║██║╚██╗██║██╔══██║██╔═██╗ ██╔══╝  " + RESET);
        System.out.println(GREEN + BOLD + "  ███████║██║ ╚████║██║  ██║██║  ██╗███████╗" + RESET);
        System.out.println(GREEN + BOLD + "  ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝" + RESET);
        System.out.println();
        System.out.println(YELLOW + "              Terminal Edition - Java" + RESET);
        System.out.println();
        System.out.println(WHITE + "  Controls:" + RESET);
        System.out.println(CYAN  + "    W / ↑   " + WHITE + "Move Up");
        System.out.println(CYAN  + "    S / ↓   " + WHITE + "Move Down");
        System.out.println(CYAN  + "    A / ←   " + WHITE + "Move Left");
        System.out.println(CYAN  + "    D / →   " + WHITE + "Move Right");
        System.out.println(CYAN  + "    P       " + WHITE + "Pause / Resume");
        System.out.println(CYAN  + "    Q       " + WHITE + "Quit" + RESET);
        System.out.println();
        System.out.println(MAGENTA + "  Eat " + RED + BOLD + "*" + RESET + MAGENTA + " to grow. Avoid walls and yourself!");
        System.out.println(MAGENTA + "  Speed increases as your score grows!" + RESET);
        System.out.println();
        System.out.println(YELLOW + BOLD + "  Press ENTER to start..." + RESET);
        System.in.read();
    }

    // ── Game Over screen ──────────────────────────────────────────────────────
    static void showGameOver() throws Exception {
        render();
        System.out.println();
        System.out.println(RED + BOLD + "  ╔══════════════════════════╗" + RESET);
        System.out.println(RED + BOLD + "  ║       GAME  OVER!        ║" + RESET);
        System.out.println(RED + BOLD + "  ╚══════════════════════════╝" + RESET);
        System.out.println(YELLOW + "  Final Score : " + WHITE + BOLD + score + RESET);
        System.out.println(YELLOW + "  Snake Length: " + WHITE + BOLD + snake.size() + RESET);
        System.out.println(YELLOW + "  High Score  : " + WHITE + BOLD + highScore + RESET);
        System.out.println();
    }

    static boolean askPlayAgain() throws Exception {
        System.out.print(CYAN + "  Play again? (Y/N): " + RESET);
        System.out.flush();
        // Flush leftovers
        while (System.in.available() > 0) System.in.read();
        int ch = System.in.read();
        return Character.toLowerCase((char) ch) == 'y';
    }
}
