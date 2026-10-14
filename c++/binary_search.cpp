/*
 * Binary Search Algorithm
 * -----------------------
 * Efficiently finds a target value within a SORTED array
 * by repeatedly dividing the search interval in half.
 *
 * Time Complexity:
 *   Best:    O(1)      - target is the middle element
 *   Average: O(log n)
 *   Worst:   O(log n)
 * Space Complexity: O(1) iterative | O(log n) recursive
 */

#include <iostream>
#include <vector>

using namespace std;

// ── Iterative Binary Search ─────────────────────────────────────────────────
int binarySearchIterative(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    int step = 0;

    while (left <= right) {
        step++;
        int mid = left + (right - left) / 2; // avoids potential overflow vs (l+r)/2

        cout << "  Step " << step
             << " | range [" << left << ", " << right << "]"
             << " | mid=" << mid
             << " | arr[mid]=" << arr[mid] << endl;

        if (arr[mid] == target)
            return mid;
        else if (arr[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }

    return -1; // not found
}

// ── Recursive Binary Search ──────────────────────────────────────────────────
int binarySearchRecursive(const vector<int>& arr, int target, int left, int right) {
    if (left > right) return -1;

    int mid = left + (right - left) / 2;

    if (arr[mid] == target)     return mid;
    else if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, right);
    else                        return binarySearchRecursive(arr, target, left, mid - 1);
}

int main() {
    vector<int> sortedArr = {2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91};

    cout << "=== Binary Search ===" << endl;
    cout << "Array: ";
    for (int x : sortedArr) cout << x << " ";
    cout << endl << endl;

    // --- Iterative ---
    int target1 = 23;
    cout << "Searching for " << target1 << " (iterative):" << endl;
    int idx1 = binarySearchIterative(sortedArr, target1);
    if (idx1 != -1)
        cout << "  Found at index " << idx1 << endl;
    else
        cout << "  Not found." << endl;

    cout << endl;

    // --- Recursive ---
    int target2 = 99;
    cout << "Searching for " << target2 << " (recursive):" << endl;
    int idx2 = binarySearchRecursive(sortedArr, target2, 0, sortedArr.size() - 1);
    if (idx2 != -1)
        cout << "  Found at index " << idx2 << endl;
    else
        cout << "  Not found." << endl;

    return 0;
}
