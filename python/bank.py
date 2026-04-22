"""
╔══════════════════════════════════════════════════════════╗
║              🏦  PYTHON BANK  🏦                         ║
║        Your Trusted Digital Banking Partner              ║
╚══════════════════════════════════════════════════════════╝

Features:
  - Create personal bank accounts
  - Deposit & Withdraw funds
  - Monthly interest on savings (bonus feature!)
  - View full transaction history
  - Mini statement (last 5 transactions)
  - Transfer money between accounts
  - Account summary dashboard
"""

import sys
import io

# Enable UTF-8 output on Windows so emojis and box-drawing chars display correctly
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stdin  = io.TextIOWrapper(sys.stdin.buffer,  encoding="utf-8", errors="replace")
    # Enable ANSI VT100 escape codes in Windows console
    import ctypes
    kernel32 = ctypes.windll.kernel32
    kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)

import os
import json
import hashlib
import datetime
from pathlib import Path

# ─── Constants ────────────────────────────────────────────
DATA_FILE = Path(__file__).parent / "bank_data.json"
INTEREST_RATE = 0.05          # 5% monthly interest (bonus!)
WELCOME_BONUS = 500.0         # New account bonus (bonus!)
MIN_BALANCE = 100.0           # Minimum balance required

# ─── Color Helpers (ANSI) ─────────────────────────────────
class Color:
    RESET   = "\033[0m"
    BOLD    = "\033[1m"
    GREEN   = "\033[92m"
    RED     = "\033[91m"
    YELLOW  = "\033[93m"
    CYAN    = "\033[96m"
    MAGENTA = "\033[95m"
    BLUE    = "\033[94m"
    WHITE   = "\033[97m"
    BG_BLUE = "\033[44m"

def clr(text, color):
    return f"{color}{text}{Color.RESET}"

def banner():
    os.system("cls" if os.name == "nt" else "clear")
    print(clr("""
╔══════════════════════════════════════════════════════════╗
║          🏦   P Y T H O N   B A N K   🏦                ║
║        Your Trusted Digital Banking Partner              ║
╚══════════════════════════════════════════════════════════╝""", Color.CYAN + Color.BOLD))

# ─── Data Persistence ─────────────────────────────────────
def load_data() -> dict:
    if DATA_FILE.exists():
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return {}

def save_data(data: dict):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

# ─── Utility ──────────────────────────────────────────────
def hash_pin(pin: str) -> str:
    return hashlib.sha256(pin.encode()).hexdigest()

def now() -> str:
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def fmt_money(amount: float) -> str:
    return clr(f"₹{amount:,.2f}", Color.GREEN)

def separator(char="─", length=58):
    print(clr(char * length, Color.BLUE))

def success(msg): print(clr(f"  ✅  {msg}", Color.GREEN))
def error(msg):   print(clr(f"  ❌  {msg}", Color.RED))
def info(msg):    print(clr(f"  ℹ️   {msg}", Color.YELLOW))

def get_input(prompt: str) -> str:
    return input(clr(f"  ➤  {prompt}: ", Color.CYAN)).strip()

# ─── Account Operations ───────────────────────────────────
def create_account(data: dict):
    banner()
    print(clr("\n  📋  CREATE NEW ACCOUNT\n", Color.MAGENTA + Color.BOLD))
    separator()

    name = get_input("Enter your full name")
    if not name:
        error("Name cannot be empty.")
        return

    username = get_input("Choose a username (no spaces)")
    if not username or " " in username:
        error("Invalid username.")
        return

    if username in data:
        error(f"Username '{username}' is already taken.")
        return

    pin = get_input("Set a 4-digit PIN")
    if not pin.isdigit() or len(pin) != 4:
        error("PIN must be exactly 4 digits.")
        return

    confirm_pin = get_input("Confirm your PIN")
    if pin != confirm_pin:
        error("PINs do not match.")
        return

    # Create the account
    data[username] = {
        "name": name,
        "pin": hash_pin(pin),
        "balance": WELCOME_BONUS,
        "created": now(),
        "transactions": [
            {
                "type": "🎁 Welcome Bonus",
                "amount": WELCOME_BONUS,
                "balance_after": WELCOME_BONUS,
                "note": "Account opening bonus",
                "time": now()
            }
        ]
    }
    save_data(data)
    separator()
    success(f"Account created for {clr(name, Color.WHITE + Color.BOLD)}!")
    info(f"You've received a welcome bonus of {fmt_money(WELCOME_BONUS)}!")
    info(f"Your username is: {clr(username, Color.YELLOW)}")
    input(clr("\n  Press Enter to continue...", Color.CYAN))

def login(data: dict) -> tuple[str, dict] | tuple[None, None]:
    banner()
    print(clr("\n  🔐  LOGIN TO YOUR ACCOUNT\n", Color.MAGENTA + Color.BOLD))
    separator()

    username = get_input("Username")
    if username not in data:
        error("Account not found.")
        input(clr("\n  Press Enter to continue...", Color.CYAN))
        return None, None

    pin = get_input("4-digit PIN")
    if data[username]["pin"] != hash_pin(pin):
        error("Incorrect PIN.")
        input(clr("\n  Press Enter to continue...", Color.CYAN))
        return None, None

    success(f"Welcome back, {clr(data[username]['name'], Color.WHITE + Color.BOLD)}!")
    input(clr("\n  Press Enter to continue...", Color.CYAN))
    return username, data[username]

def add_transaction(account: dict, tx_type: str, amount: float, note: str = ""):
    account["transactions"].append({
        "type": tx_type,
        "amount": amount,
        "balance_after": account["balance"],
        "note": note,
        "time": now()
    })

# ─── Banking Features ─────────────────────────────────────
def deposit(data: dict, username: str):
    banner()
    account = data[username]
    print(clr(f"\n  💰  DEPOSIT FUNDS  —  {account['name']}\n", Color.MAGENTA + Color.BOLD))
    separator()
    info(f"Current Balance: {fmt_money(account['balance'])}")
    separator()

    try:
        amount = float(get_input("Enter deposit amount (₹)"))
    except ValueError:
        error("Invalid amount.")
        input(clr("\n  Press Enter to continue...", Color.CYAN))
        return

    if amount <= 0:
        error("Deposit amount must be positive.")
        input(clr("\n  Press Enter to continue...", Color.CYAN))
        return

    note = get_input("Add a note (optional)")
    account["balance"] += amount
    add_transaction(account, "⬆️  Deposit", amount, note or "Cash deposit")
    save_data(data)

    separator()
    success(f"Deposited {fmt_money(amount)} successfully!")
    info(f"New Balance: {fmt_money(account['balance'])}")
    input(clr("\n  Press Enter to continue...", Color.CYAN))

def withdraw(data: dict, username: str):
    banner()
    account = data[username]
    print(clr(f"\n  💸  WITHDRAW FUNDS  —  {account['name']}\n", Color.MAGENTA + Color.BOLD))
    separator()
    info(f"Current Balance: {fmt_money(account['balance'])}")
    info(f"Minimum Balance Required: {fmt_money(MIN_BALANCE)}")
    separator()

    try:
        amount = float(get_input("Enter withdrawal amount (₹)"))
    except ValueError:
        error("Invalid amount.")
        input(clr("\n  Press Enter to continue...", Color.CYAN))
        return

    if amount <= 0:
        error("Amount must be positive.")
        input(clr("\n  Press Enter to continue...", Color.CYAN))
        return

    if account["balance"] - amount < MIN_BALANCE:
        error(f"Insufficient funds! Must maintain a minimum balance of {fmt_money(MIN_BALANCE)}.")
        input(clr("\n  Press Enter to continue...", Color.CYAN))
        return

    note = get_input("Add a note (optional)")
    account["balance"] -= amount
    add_transaction(account, "⬇️  Withdrawal", amount, note or "Cash withdrawal")
    save_data(data)

    separator()
    success(f"Withdrew {fmt_money(amount)} successfully!")
    info(f"Remaining Balance: {fmt_money(account['balance'])}")
    input(clr("\n  Press Enter to continue...", Color.CYAN))

def apply_interest(data: dict, username: str):
    """Bonus Feature: Apply monthly interest to the account."""
    account = data[username]
    banner()
    print(clr(f"\n  📈  APPLY MONTHLY INTEREST  —  {account['name']}\n", Color.MAGENTA + Color.BOLD))
    separator()

    interest = round(account["balance"] * INTEREST_RATE, 2)
    info(f"Current Balance    : {fmt_money(account['balance'])}")
    info(f"Interest Rate      : {clr(f'{INTEREST_RATE*100:.0f}%', Color.YELLOW)} per month")
    info(f"Interest Earned    : {fmt_money(interest)}")
    separator()

    confirm = get_input("Apply interest to your account? (yes/no)").lower()
    if confirm == "yes":
        account["balance"] += interest
        add_transaction(account, "📈  Interest", interest, f"{INTEREST_RATE*100:.0f}% monthly interest")
        save_data(data)
        success(f"Interest of {fmt_money(interest)} applied!")
        info(f"New Balance: {fmt_money(account['balance'])}")
    else:
        info("Interest not applied.")

    input(clr("\n  Press Enter to continue...", Color.CYAN))

def transfer(data: dict, username: str):
    """Bonus Feature: Transfer money to another account."""
    account = data[username]
    banner()
    print(clr(f"\n  🔁  TRANSFER FUNDS  —  {account['name']}\n", Color.MAGENTA + Color.BOLD))
    separator()
    info(f"Current Balance: {fmt_money(account['balance'])}")
    separator()

    recipient = get_input("Enter recipient's username")
    if recipient == username:
        error("You cannot transfer to yourself.")
        input(clr("\n  Press Enter to continue...", Color.CYAN))
        return

    if recipient not in data:
        error(f"Account '{recipient}' not found.")
        input(clr("\n  Press Enter to continue...", Color.CYAN))
        return

    try:
        amount = float(get_input("Enter transfer amount (₹)"))
    except ValueError:
        error("Invalid amount.")
        input(clr("\n  Press Enter to continue...", Color.CYAN))
        return

    if amount <= 0:
        error("Amount must be positive.")
        input(clr("\n  Press Enter to continue...", Color.CYAN))
        return

    if account["balance"] - amount < MIN_BALANCE:
        error(f"Insufficient funds! Must maintain a minimum balance of {fmt_money(MIN_BALANCE)}.")
        input(clr("\n  Press Enter to continue...", Color.CYAN))
        return

    recipient_name = data[recipient]["name"]
    print(clr(f"\n  Sending {fmt_money(amount)} to {clr(recipient_name, Color.WHITE + Color.BOLD)}...", Color.YELLOW))
    confirm = get_input("Confirm transfer? (yes/no)").lower()

    if confirm == "yes":
        account["balance"] -= amount
        data[recipient]["balance"] += amount
        add_transaction(account, "🔁  Transfer OUT", amount, f"To: {recipient_name}")
        add_transaction(data[recipient], "🔁  Transfer IN", amount, f"From: {account['name']}")
        save_data(data)
        success(f"Transferred {fmt_money(amount)} to {clr(recipient_name, Color.WHITE + Color.BOLD)}!")
        info(f"Your New Balance: {fmt_money(account['balance'])}")
    else:
        info("Transfer cancelled.")

    input(clr("\n  Press Enter to continue...", Color.CYAN))

def view_balance(data: dict, username: str):
    account = data[username]
    banner()
    print(clr(f"\n  📊  ACCOUNT DASHBOARD  —  {account['name']}\n", Color.MAGENTA + Color.BOLD))
    separator("═")
    print(clr(f"  👤  Account Holder : ", Color.WHITE) + clr(account["name"], Color.YELLOW + Color.BOLD))
    print(clr(f"  🆔  Username       : ", Color.WHITE) + clr(username, Color.CYAN))
    print(clr(f"  📅  Member Since   : ", Color.WHITE) + clr(account["created"], Color.CYAN))
    print(clr(f"  💰  Balance        : ", Color.WHITE) + fmt_money(account["balance"]))
    print(clr(f"  📋  Transactions   : ", Color.WHITE) + clr(str(len(account["transactions"])), Color.CYAN))
    separator("═")
    input(clr("\n  Press Enter to continue...", Color.CYAN))

def view_history(data: dict, username: str, last_n: int = 0):
    account = data[username]
    txs = account["transactions"]
    banner()
    title = "MINI STATEMENT (Last 5)" if last_n else "FULL TRANSACTION HISTORY"
    print(clr(f"\n  📜  {title}  —  {account['name']}\n", Color.MAGENTA + Color.BOLD))
    separator()

    display_txs = txs[-last_n:] if last_n else txs
    if not display_txs:
        info("No transactions yet.")
    else:
        for i, tx in enumerate(reversed(display_txs), 1):
            print(clr(f"  #{i:02d}", Color.CYAN) + f"  {tx['type']}")
            print(f"       Amount  : {fmt_money(tx['amount'])}")
            print(f"       Balance : {fmt_money(tx['balance_after'])}")
            if tx.get("note"):
                print(f"       Note    : {clr(tx['note'], Color.YELLOW)}")
            print(f"       Time    : {clr(tx['time'], Color.WHITE)}")
            separator("·")

    input(clr("\n  Press Enter to continue...", Color.CYAN))

# ─── Menus ────────────────────────────────────────────────
def account_menu(data: dict, username: str):
    while True:
        banner()
        account = data[username]
        print(clr(f"\n  👋  Hello, {account['name']}!", Color.GREEN + Color.BOLD))
        print(clr(f"  💰  Balance: {fmt_money(account['balance'])}\n", Color.WHITE))
        separator()
        print(clr("""
  [1]  💰  Deposit Money
  [2]  💸  Withdraw Money
  [3]  🔁  Transfer Money          (Bonus)
  [4]  📈  Apply Monthly Interest  (Bonus)
  [5]  📊  Account Dashboard
  [6]  📜  Full Transaction History
  [7]  🗒️   Mini Statement (Last 5)
  [0]  🚪  Logout
""", Color.WHITE))
        separator()

        choice = get_input("Choose an option")

        if   choice == "1": deposit(data, username)
        elif choice == "2": withdraw(data, username)
        elif choice == "3": transfer(data, username)
        elif choice == "4": apply_interest(data, username)
        elif choice == "5": view_balance(data, username)
        elif choice == "6": view_history(data, username)
        elif choice == "7": view_history(data, username, last_n=5)
        elif choice == "0":
            info("Logging out... Goodbye! 👋")
            break
        else:
            error("Invalid option. Please try again.")
            input(clr("\n  Press Enter to continue...", Color.CYAN))

def main_menu():
    data = load_data()
    while True:
        banner()
        print(clr("""
  [1]  🆕  Create New Account
  [2]  🔐  Login to Account
  [0]  ❌  Exit
""", Color.WHITE))
        separator()

        choice = get_input("Choose an option")

        if choice == "1":
            create_account(data)
            data = load_data()   # reload after save

        elif choice == "2":
            username, _ = login(data)
            if username:
                data = load_data()   # reload fresh
                account_menu(data, username)
                data = load_data()   # reload after changes

        elif choice == "0":
            banner()
            print(clr("\n  Thank you for banking with Python Bank! 🏦\n", Color.CYAN + Color.BOLD))
            break

        else:
            error("Invalid option. Please try again.")
            input(clr("\n  Press Enter to continue...", Color.CYAN))

# ─── Entry Point ──────────────────────────────────────────
if __name__ == "__main__":
    main_menu()
