// Simple Application Logic

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function getStatus() {
  return {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  add,
  subtract,
  getStatus
};

// If run directly via Node, output status
if (require.main === module) {
  console.log("App running. System Status:", getStatus());
}
