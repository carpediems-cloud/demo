/*
 * Bubble Sort Algorithm
 * ---------------------
 * Repeatedly steps through the list, compares adjacent elements,
 * and swaps them if they are in the wrong order.
 *
 * Time Complexity:
 *   Best:    O(n)   - already sorted
 *   Average: O(n^2)
 *   Worst:   O(n^2)
 * Space Complexity: O(1)
 */

#include <iostream>
#include <vector>

using namespace std;

// Print all elements in the array
void printArray(const vector<int>& arr) {
    for (int i = 0; i < arr.size(); i++) {
        cout << arr[i];
        if (i < arr.size() - 1) cout << " -> ";
    }
    cout << endl;
}

// Perform bubble sort and show each pass
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    bool swapped;

    for (int pass = 0; pass < n - 1; pass++) {
        swapped = false;

        for (int j = 0; j < n - pass - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }

        cout << "Pass " << pass + 1 << ": ";
        printArray(arr);

        // Early exit if no swaps occurred (already sorted)
        if (!swapped) {
            cout << "Array already sorted — stopping early." << endl;
            break;
        }
    }
}

int main() {
    vector<int> data = {64, 34, 25, 12, 22, 11, 90};

    cout << "=== Bubble Sort ===" << endl;
    cout << "Original: ";
    printArray(data);
    cout << endl;

    bubbleSort(data);

    cout << endl;
    cout << "Sorted:   ";
    printArray(data);

    return 0;
}
