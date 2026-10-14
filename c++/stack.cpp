/*
 * Stack Data Structure
 * --------------------
 * A Last-In, First-Out (LIFO) linear data structure.
 * Think of a stack of plates — you always add/remove from the top.
 *
 * Supported operations (all O(1)):
 *   push   - add element to the top
 *   pop    - remove element from the top
 *   peek   - view top element without removing
 *   isEmpty - check if stack is empty
 *   size   - number of elements
 *
 * Two implementations shown:
 *   1. ArrayStack  — backed by a fixed-size array
 *   2. LinkedStack — backed by a dynamic linked list (no size limit)
 *
 * Real-world use case:
 *   Balanced Bracket Checker — uses a stack to validate (), [], {}
 */

#include <iostream>
#include <string>
using namespace std;

// ══════════════════════════════════════════════════════════════════════════════
// 1. Array-Based Stack
// ══════════════════════════════════════════════════════════════════════════════
class ArrayStack {
private:
    static const int MAX = 100;
    int arr[MAX];
    int top;

public:
    ArrayStack() : top(-1) {}

    bool isEmpty() const { return top == -1; }
    bool isFull()  const { return top == MAX - 1; }
    int  size()    const { return top + 1; }

    void push(int val) {
        if (isFull()) {
            cout << "  [ArrayStack] Overflow! Cannot push " << val << endl;
            return;
        }
        arr[++top] = val;
    }

    int pop() {
        if (isEmpty()) {
            cout << "  [ArrayStack] Underflow! Stack is empty." << endl;
            return -1;
        }
        return arr[top--];
    }

    int peek() const {
        if (isEmpty()) {
            cout << "  [ArrayStack] Stack is empty." << endl;
            return -1;
        }
        return arr[top];
    }

    void display() const {
        if (isEmpty()) { cout << "  (empty)" << endl; return; }
        cout << "  TOP --> ";
        for (int i = top; i >= 0; i--) {
            cout << "[" << arr[i] << "]";
            if (i > 0) cout << " | ";
        }
        cout << " <-- BOTTOM" << endl;
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// 2. Linked List-Based Stack (no fixed size limit)
// ══════════════════════════════════════════════════════════════════════════════
struct StackNode {
    int data;
    StackNode* next;
    StackNode(int val) : data(val), next(nullptr) {}
};

class LinkedStack {
private:
    StackNode* top;
    int count;

public:
    LinkedStack() : top(nullptr), count(0) {}

    ~LinkedStack() {
        while (!isEmpty()) pop();
    }

    bool isEmpty() const { return top == nullptr; }
    int  size()    const { return count; }

    void push(int val) {
        StackNode* node = new StackNode(val);
        node->next = top;
        top = node;
        count++;
    }

    int pop() {
        if (isEmpty()) {
            cout << "  [LinkedStack] Underflow! Stack is empty." << endl;
            return -1;
        }
        int val = top->data;
        StackNode* temp = top;
        top = top->next;
        delete temp;
        count--;
        return val;
    }

    int peek() const {
        if (isEmpty()) {
            cout << "  [LinkedStack] Stack is empty." << endl;
            return -1;
        }
        return top->data;
    }

    void display() const {
        if (isEmpty()) { cout << "  (empty)" << endl; return; }
        cout << "  TOP --> ";
        StackNode* curr = top;
        while (curr) {
            cout << "[" << curr->data << "]";
            if (curr->next) cout << " | ";
            curr = curr->next;
        }
        cout << " <-- BOTTOM" << endl;
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// Real-world use: Balanced Bracket Checker
// ══════════════════════════════════════════════════════════════════════════════
bool isBalanced(const string& expr) {
    LinkedStack s;

    for (char ch : expr) {
        // Push opening brackets
        if (ch == '(' || ch == '[' || ch == '{') {
            s.push(ch);
        }
        // Match closing brackets
        else if (ch == ')' || ch == ']' || ch == '}') {
            if (s.isEmpty()) return false;

            char top = (char)s.pop();

            if ((ch == ')' && top != '(') ||
                (ch == ']' && top != '[') ||
                (ch == '}' && top != '{')) {
                return false;
            }
        }
    }

    return s.isEmpty(); // valid only if nothing left unmatched
}

// ══════════════════════════════════════════════════════════════════════════════
// Driver
// ══════════════════════════════════════════════════════════════════════════════
int main() {
    // ── Array Stack demo ────────────────────────────────────────────────────
    cout << "=== Array Stack ===" << endl;
    ArrayStack aStack;

    aStack.push(10);
    aStack.push(20);
    aStack.push(30);
    aStack.push(40);
    cout << "After pushing 10, 20, 30, 40:" << endl;
    aStack.display();

    cout << "Peek:  " << aStack.peek() << endl;
    cout << "Pop:   " << aStack.pop()  << endl;
    cout << "Pop:   " << aStack.pop()  << endl;
    cout << "After 2 pops:" << endl;
    aStack.display();

    // ── Linked Stack demo ────────────────────────────────────────────────────
    cout << endl << "=== Linked Stack ===" << endl;
    LinkedStack lStack;

    lStack.push(100);
    lStack.push(200);
    lStack.push(300);
    cout << "After pushing 100, 200, 300:" << endl;
    lStack.display();

    cout << "Size:  " << lStack.size() << endl;
    cout << "Pop:   " << lStack.pop()  << endl;
    cout << "After 1 pop:" << endl;
    lStack.display();

    // ── Balanced Bracket Checker ─────────────────────────────────────────────
    cout << endl << "=== Balanced Bracket Checker ===" << endl;

    string tests[] = {
        "({[]})",
        "((()))",
        "{[()]}",
        "({[}])",
        "(((",
        "",
        "{a + (b * [c - d])}"
    };

    for (const string& t : tests) {
        cout << "  \"" << t << "\" --> "
             << (isBalanced(t) ? "BALANCED" : "NOT balanced") << endl;
    }

    return 0;
}
