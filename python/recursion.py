def countdown(n):
    """Prints a countdown from n to 1 recursively."""
    if n <= 0:
        print("Blast off!")
        return
    print(n)
    countdown(n - 1)


def factorial(n):
    """Calculates the factorial of n recursively (n!)."""
    if n <= 1:
        return 1
    return n * factorial(n - 1)


def fibonacci(n):
    """Calculates the nth Fibonacci number recursively."""
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    return fibonacci(n - 1) + fibonacci(n - 2)


def recursive_sum(numbers):
    """Calculates the sum of a list of numbers recursively."""
    if not numbers:
        return 0
    return numbers[0] + recursive_sum(numbers[1:])


def main():
    # 1. Simple countdown (recursion with side effects)
    print("--- 1. Countdown Demo ---")
    countdown(5)

    # 2. Factorial calculation
    print("\n--- 2. Factorial Demo ---")
    num = 5
    print(f"Factorial of {num} is: {factorial(num)}")

    # 3. Fibonacci sequence
    print("\n--- 3. Fibonacci Demo ---")
    fib_terms = 8
    print(f"First {fib_terms} Fibonacci numbers:")
    fib_sequence = [fibonacci(i) for i in range(fib_terms)]
    print(fib_sequence)

    # 4. Summing a list recursively
    print("\n--- 4. Recursive Sum Demo ---")
    nums = [1, 2, 3, 4, 5]
    print(f"Sum of {nums} is: {recursive_sum(nums)}")


if __name__ == "__main__":
    main()
