/**
 * Implementation A — Iterative Loop
 * -----------------------------
 * Adds numbers from 1 to n using a simple for loop.
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
export function sum_to_n_a(n: number): number {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

/**
 * Implementation B — Mathematical Formula
 * -----------------------------
 * Uses the arithmetic series formula: n * (n + 1) / 2
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
export function sum_to_n_b(n: number): number {
    return (n * (n + 1)) / 2;
}

/**
 * Implementation C — Recursive Approach
 * -----------------------------
 * Uses recursion to add n to the sum of (n - 1).
 * Time Complexity: O(n)
 * Space Complexity: O(n) (due to recursion stack)
 */
export function sum_to_n_c(n: number): number {
    if (n <= 1) return n;
    return n + sum_to_n_c(n - 1);
}

// Example usage:s
const testValue = 5;
console.log(`sum_to_n_a(${testValue}) =`, sum_to_n_a(testValue));
console.log(`sum_to_n_b(${testValue}) =`, sum_to_n_b(testValue));
console.log(`sum_to_n_c(${testValue}) =`, sum_to_n_c(testValue));