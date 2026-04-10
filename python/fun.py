import random

def play_hangman():
    words = ['python', 'developer', 'algorithm', 'software', 'programming', 'debugging', 'variable', 'function']
    word = random.choice(words).upper()
    word_letters = set(word)
    alphabet = set(chr(i) for i in range(65, 91))
    used_letters = set()

    lives = 6

    print("=======================")
    print("  Welcome to Hangman!  ")
    print("=======================")

    while len(word_letters) > 0 and lives > 0:
        print(f"\nYou have {lives} lives left.")
        print("Used letters: ", ' '.join(sorted(used_letters)))
        
        # Display current state of the word
        word_list = [letter if letter in used_letters else '_' for letter in word]
        print("Current word: ", ' '.join(word_list))

        user_letter = input("\nGuess a letter: ").upper()
        
        if user_letter in alphabet - used_letters:
            used_letters.add(user_letter)
            if user_letter in word_letters:
                word_letters.remove(user_letter)
                print("✅ Good guess!")
            else:
                lives = lives - 1
                print("❌ Letter is not in the word.")

        elif user_letter in used_letters:
            print("⚠️ You have already used that letter. Try again.")
        else:
            print("⚠️ Invalid character. Please enter a letter.")

    print("\n" + "="*23)
    if lives == 0:
        print(f"💀 You died, sorry. The word was {word}")
    else:
        print(f"🎉 YAY! You guessed the word {word} !!")
    print("="*23)

if __name__ == '__main__':
    play_hangman()
