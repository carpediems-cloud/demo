def greet(name):
    return f"Hello, {name}! Welcome to the demo repository."


def main():
    user_name = input("Enter your name: ").strip()
    if not user_name:
        user_name = "friend"

    print(greet(user_name))


if __name__ == "__main__":
    main()
