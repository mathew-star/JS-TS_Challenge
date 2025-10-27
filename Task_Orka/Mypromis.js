// We'll implementA:
class MyPromise {
  // Constructor with executor
  // State management (pending, fulfilled, rejected)
  // .then(), .catch(), .finally()
  // Microtask queue simulation
  // Chaining with proper value/error propagation
}

// Then build static methods:
MyPromise.resolve()
MyPromise.reject()
MyPromise.all()      // Fails fast
MyPromise.race()     // First to settle
MyPromise.allSettled() // Wait for all
MyPromise.any()      // First to fulfill
