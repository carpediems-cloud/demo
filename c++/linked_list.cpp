/*
 * Linked List (Singly)
 * --------------------
 * A linear data structure where each element (node) contains:
 *   - data  : the stored value
 *   - next  : a pointer to the next node
 *
 * Supported operations:
 *   insertFront   - O(1)
 *   insertBack    - O(n)
 *   deleteByValue - O(n)
 *   search        - O(n)
 *   reverse       - O(n)
 *   display       - O(n)
 */

#include <iostream>
using namespace std;

// ── Node structure ────────────────────────────────────────────────────────────
struct Node {
    int data;
    Node* next;

    Node(int val) : data(val), next(nullptr) {}
};

// ── Linked List class ─────────────────────────────────────────────────────────
class LinkedList {
private:
    Node* head;

public:
    LinkedList() : head(nullptr) {}

    // Destructor — free all heap memory
    ~LinkedList() {
        Node* curr = head;
        while (curr) {
            Node* temp = curr;
            curr = curr->next;
            delete temp;
        }
    }

    // Insert at the beginning — O(1)
    void insertFront(int val) {
        Node* newNode = new Node(val);
        newNode->next = head;
        head = newNode;
    }

    // Insert at the end — O(n)
    void insertBack(int val) {
        Node* newNode = new Node(val);
        if (!head) {
            head = newNode;
            return;
        }
        Node* curr = head;
        while (curr->next) curr = curr->next;
        curr->next = newNode;
    }

    // Delete first occurrence of a value — O(n)
    bool deleteByValue(int val) {
        if (!head) return false;

        if (head->data == val) {
            Node* temp = head;
            head = head->next;
            delete temp;
            return true;
        }

        Node* curr = head;
        while (curr->next && curr->next->data != val)
            curr = curr->next;

        if (!curr->next) return false; // value not found

        Node* temp = curr->next;
        curr->next = temp->next;
        delete temp;
        return true;
    }

    // Search for a value — returns index or -1 — O(n)
    int search(int val) const {
        Node* curr = head;
        int index = 0;
        while (curr) {
            if (curr->data == val) return index;
            curr = curr->next;
            index++;
        }
        return -1;
    }

    // Reverse the list in-place — O(n)
    void reverse() {
        Node* prev = nullptr;
        Node* curr = head;
        Node* next = nullptr;

        while (curr) {
            next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        head = prev;
    }

    // Print the list
    void display() const {
        if (!head) {
            cout << "(empty list)" << endl;
            return;
        }
        Node* curr = head;
        while (curr) {
            cout << "[" << curr->data << "]";
            if (curr->next) cout << " --> ";
            curr = curr->next;
        }
        cout << " --> nullptr" << endl;
    }
};

// ── Driver ────────────────────────────────────────────────────────────────────
int main() {
    LinkedList list;

    cout << "=== Singly Linked List ===" << endl << endl;

    // Build the list
    list.insertBack(10);
    list.insertBack(20);
    list.insertBack(30);
    list.insertFront(5);
    list.insertBack(40);

    cout << "Initial list:" << endl;
    list.display();

    // Search
    int target = 20;
    int idx = list.search(target);
    cout << "\nSearch " << target << ": "
         << (idx != -1 ? "found at index " + to_string(idx) : "not found")
         << endl;

    // Delete
    cout << "\nDelete 20:" << endl;
    list.deleteByValue(20);
    list.display();

    // Reverse
    cout << "\nReversed:" << endl;
    list.reverse();
    list.display();

    return 0;
}
