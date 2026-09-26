const assert = require("assert");
const { add, subtract, getStatus } = require("../src/app");

console.log("Running unit tests...");

try {
  // Test 1: Addition
  assert.strictEqual(add(2, 3), 5, "Addition test failed: 2 + 3 should equal 5");
  console.log("✓ Test 1 Passed: add(2, 3) === 5");

  // Test 2: Subtraction
  assert.strictEqual(subtract(10, 4), 6, "Subtraction test failed: 10 - 4 should equal 6");
  console.log("✓ Test 2 Passed: subtract(10, 4) === 6");

  // Test 3: Status Check
  const status = getStatus();
  assert.strictEqual(status.status, "OK", "Status check test failed");
  console.log("✓ Test 3 Passed: getStatus() returned OK");

  console.log("\nAll tests passed successfully!");
  process.exit(0);
} catch (error) {
  console.error("\n❌ Test Suite Failed:");
  console.error(error.message);
  process.exit(1);
}
