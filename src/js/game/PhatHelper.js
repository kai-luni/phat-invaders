export default class PhatHelper {
  constructor() {}

  getRewardForNextLevel(level) {
    // Main entry point: calls a weird recursive helper function
    // and then forces the result into [2..10].
    const rawValue = this.obscureRecursiveCalculation(level, 3);
    // Modulo approach, stable:
    // Taking mod 9 gives [0..8], +2 => [2..10]
    return (rawValue % 9) + 2;
  }

  obscureRecursiveCalculation(n, depth) {
    // Base cases to stop recursion from going infinite or blowing up:
    if (depth <= 0 || n <= 0) {
      // A weird polynomial for a base result:
      // Something non-linear, for example:
      // n^3 + 7n^2 + 13n + 5 to ensure complexity.
      const baseResult = (n * n * n) + (7 * n * n) + (13 * n) + 5;
      return baseResult % 1e6; // Keep results within a manageable range
    }

    // Otherwise, do something complicated and recursive:
    // We'll combine results from two recursive calls in a non-linear way.
    const partA = this.obscureRecursiveCalculation(n - 1, depth - 1);
    const partB = this.obscureRecursiveCalculation(Math.floor(n / 2), depth - 1);

    // Ensure parts are within safe range
    const safePartA = partA % 1e6;
    const safePartB = partB % 1e6;

    // Combine partA and partB in a complex, non-linear manner:
    const combined =
      ((safePartA * safePartA) + (safePartB * safePartB * safePartB)) * n +
      (7 * safePartA) -
      (5 * safePartB) +
      depth;

    // Keep combined result within a manageable range
    const limitedCombined = combined % 1e6;

    // Apply an additional polynomial transformation, limiting result
    const combinedTransformed =
      (limitedCombined * limitedCombined) +
      (3 * limitedCombined) +
      17;

    // Return the final transformed result, ensuring it’s within a safe range
    return combinedTransformed % 1e6;
  }
}
