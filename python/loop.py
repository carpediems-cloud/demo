def main():
    # 1. A simple for loop printing numbers 1 to 5
    print("--- 1. Simple For Loop ---")
    for i in range(1, 6):
        print(f"Number: {i}")

    # 2. Looping over a list of strings
    print("\n--- 2. Looping over a List ---")
    fruits = ["apple", "banana", "cherry"]
    for fruit in fruits:
        print(f"Fruit: {fruit}")

    # 3. A while loop with a condition
    print("\n--- 3. While Loop ---")
    count = 3
    while count > 0:
        print(f"Countdown: {count}")
        count -= 1

    # 4. List comprehension (a concise loop)
    print("\n--- 4. List Comprehension ---")
    squares = [x**2 for x in range(1, 6)]
    print(f"Squares of 1 to 5: {squares}")

if __name__ == "__main__":
    main()
