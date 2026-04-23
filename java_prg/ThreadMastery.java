import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.util.concurrent.locks.*;

// ============================================================
//  ThreadMastery.java
//  A complete guide to Java Threads & Multithreading
//
//  Concepts Covered:
//   1. Creating threads (Thread class & Runnable interface)
//   2. Thread life cycle (New -> Runnable -> Running -> Dead)
//   3. Thread sleep, join, yield
//   4. Thread priority
//   5. Daemon threads
//   6. Synchronization (race condition fix)
//   7. Inter-thread communication (wait / notify)
//   8. Producer-Consumer problem
//   9. Lock (ReentrantLock)
//  10. AtomicInteger (lock-free thread safety)
//  11. ExecutorService & Thread Pools
//  12. Callable & Future (return value from thread)
// ============================================================

public class ThreadMastery {

    // -------------------------------------------------------
    // UTILITY — separator lines for readable output
    // -------------------------------------------------------
    static void heading(String title) {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("  " + title);
        System.out.println("=".repeat(60));
    }

    static void pause(int ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }

    // =====================================================
    //  CONCEPT 1 — Creating Threads
    //  Method A: Extend Thread class
    // =====================================================
    static class MyThread extends Thread {
        private String name;
        MyThread(String name) { this.name = name; }

        @Override
        public void run() {
            // run() is the heart of a thread — code inside executes concurrently
            for (int i = 1; i <= 3; i++) {
                System.out.println("  [Thread class] " + name + " -> step " + i);
                pause(200);
            }
        }
    }

    // =====================================================
    //  CONCEPT 1 — Creating Threads
    //  Method B: Implement Runnable interface (preferred!)
    //  Preferred because Java allows only single inheritance;
    //  using Runnable lets your class extend something else.
    // =====================================================
    static class MyRunnable implements Runnable {
        private String name;
        MyRunnable(String name) { this.name = name; }

        @Override
        public void run() {
            for (int i = 1; i <= 3; i++) {
                System.out.println("  [Runnable]     " + name + " -> step " + i);
                pause(200);
            }
        }
    }

    // =====================================================
    //  CONCEPT 4 — Thread Priority
    //  Priority range: Thread.MIN_PRIORITY (1) to MAX_PRIORITY (10)
    //  Default is NORM_PRIORITY (5)
    // =====================================================
    static class PriorityTask extends Thread {
        PriorityTask(String name, int priority) {
            super(name);
            setPriority(priority);  // set priority BEFORE starting
        }
        @Override
        public void run() {
            System.out.println("  Priority " + getPriority() + " thread [" + getName() + "] running");
        }
    }

    // =====================================================
    //  CONCEPT 5 — Daemon Thread
    //  A daemon thread runs in background and dies automatically
    //  when all non-daemon (user) threads finish.
    //  Example use: garbage collector, auto-save feature
    // =====================================================
    static class DaemonWorker extends Thread {
        @Override
        public void run() {
            while (true) {
                System.out.println("  [Daemon] Background heartbeat...");
                pause(500);
            }
        }
    }

    // =====================================================
    //  CONCEPT 6 — Synchronization / Race Condition
    //  WITHOUT sync: multiple threads modify shared data — chaos!
    //  WITH sync:    only one thread at a time enters the method.
    // =====================================================
    static class BankAccount {
        private int balance = 1000;

        // BAD — no synchronization (causes race condition)
        void withdrawUnsafe(int amount, String threadName) {
            if (balance >= amount) {         // check
                pause(10);                   // simulate delay (another thread sneaks in!)
                balance -= amount;           // act
                System.out.println("  [UNSAFE]  " + threadName + " withdrew " + amount + " | Balance: " + balance);
            } else {
                System.out.println("  [UNSAFE]  " + threadName + " — insufficient funds (balance=" + balance + ")");
            }
        }

        // GOOD — synchronized ensures only one thread at a time
        synchronized void withdrawSafe(int amount, String threadName) {
            if (balance >= amount) {
                pause(10);
                balance -= amount;
                System.out.println("  [SAFE]    " + threadName + " withdrew " + amount + " | Balance: " + balance);
            } else {
                System.out.println("  [SAFE]    " + threadName + " — insufficient funds (balance=" + balance + ")");
            }
        }

        void resetBalance() { balance = 1000; }
        int getBalance()    { return balance; }
    }

    // =====================================================
    //  CONCEPT 7 & 8 — Inter-Thread Communication
    //  Producer-Consumer pattern using wait() & notify()
    //
    //  wait()   → thread releases lock and waits until notified
    //  notify() → wakes up one waiting thread
    //  Both must be called inside synchronized block!
    // =====================================================
    static class SharedBuffer {
        private int data;
        private boolean hasData = false;   // flag

        // Producer calls this to put data
        synchronized void produce(int value) throws InterruptedException {
            while (hasData) {
                wait();  // buffer full — wait for consumer to take
            }
            data = value;
            hasData = true;
            System.out.println("  [Producer] Produced: " + data);
            notify();  // wake up consumer
        }

        // Consumer calls this to read data
        synchronized int consume() throws InterruptedException {
            while (!hasData) {
                wait();  // no data yet — wait for producer
            }
            hasData = false;
            System.out.println("  [Consumer] Consumed: " + data);
            notify();  // wake up producer
            return data;
        }
    }

    static class Producer extends Thread {
        private SharedBuffer buffer;
        Producer(SharedBuffer b) { this.buffer = b; }

        @Override
        public void run() {
            for (int i = 1; i <= 5; i++) {
                try {
                    buffer.produce(i * 10);
                    pause(300);
                } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            }
        }
    }

    static class Consumer extends Thread {
        private SharedBuffer buffer;
        Consumer(SharedBuffer b) { this.buffer = b; }

        @Override
        public void run() {
            for (int i = 1; i <= 5; i++) {
                try {
                    buffer.consume();
                    pause(400);
                } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            }
        }
    }

    // =====================================================
    //  CONCEPT 9 — ReentrantLock
    //  More powerful than synchronized:
    //  - tryLock() — don't block forever
    //  - fairness  — threads get lock in order they asked
    //  - multiple conditions
    // =====================================================
    static class LockedCounter {
        private int count = 0;
        private final ReentrantLock lock = new ReentrantLock(true); // true = fair

        void increment(String name) {
            lock.lock();  // acquire lock
            try {
                count++;
                System.out.println("  [ReentrantLock] " + name + " incremented -> " + count);
            } finally {
                lock.unlock();  // ALWAYS unlock in finally block!
            }
        }

        int getCount() { return count; }
    }

    // =====================================================
    //  CONCEPT 10 — AtomicInteger
    //  Lock-free thread-safe integer using CPU-level
    //  compare-and-swap operations — faster than synchronized!
    // =====================================================
    static class AtomicCounter {
        private AtomicInteger count = new AtomicInteger(0);

        void increment() {
            count.incrementAndGet(); // atomic — no synchronized needed!
        }

        int getCount() { return count.get(); }
    }

    // =====================================================
    //  CONCEPT 12 — Callable & Future
    //  Unlike Runnable, Callable can RETURN a value
    //  and throw checked exceptions.
    //  Future holds the eventual result.
    // =====================================================
    static class SumTask implements Callable<Integer> {
        private int from, to;
        SumTask(int from, int to) { this.from = from; this.to = to; }

        @Override
        public Integer call() throws Exception {
            int sum = 0;
            for (int i = from; i <= to; i++) sum += i;
            System.out.println("  [Callable] Sum(" + from + ".." + to + ") = " + sum
                    + " | computed by " + Thread.currentThread().getName());
            return sum;
        }
    }


    // =====================================================
    //  MAIN METHOD — Run all concepts in sequence
    // =====================================================
    public static void main(String[] args) throws Exception {

        // --------------------------------------------------
        //  CONCEPT 1 — Thread Creation
        // --------------------------------------------------
        heading("CONCEPT 1: Creating Threads (Two Ways)");

        // Way 1: Extend Thread
        MyThread t1 = new MyThread("Alpha");
        MyThread t2 = new MyThread("Beta");

        // Way 2: Implement Runnable (pass to Thread constructor)
        Thread t3 = new Thread(new MyRunnable("Gamma"));
        Thread t4 = new Thread(new MyRunnable("Delta"));

        // Way 3: Lambda (concise Runnable — modern Java)
        Thread t5 = new Thread(() -> {
            for (int i = 1; i <= 3; i++) {
                System.out.println("  [Lambda]       Epsilon -> step " + i);
                pause(200);
            }
        });

        t1.start(); t3.start(); t5.start();
        t1.join(); t3.join(); t5.join();  // wait for them before next example

        t2.start(); t4.start();
        t2.join(); t4.join();

        // --------------------------------------------------
        //  CONCEPT 2 — Thread Life Cycle
        // --------------------------------------------------
        heading("CONCEPT 2: Thread Life Cycle (States)");
        System.out.println("""
          NEW       -> Thread object created, start() not yet called
          RUNNABLE  -> start() called, eligible to run (may or may not be executing)
          RUNNING   -> Scheduler picked it; run() is executing
          BLOCKED   -> Waiting to acquire a monitor lock (synchronized)
          WAITING   -> Called wait() or join() with no timeout
          TIMED_WAITING -> Called sleep(ms), wait(ms), or join(ms)
          TERMINATED -> run() completed or exception thrown
        """);

        Thread demoThread = new Thread(() -> pause(100));
        System.out.println("  State after new    : " + demoThread.getState()); // NEW
        demoThread.start();
        System.out.println("  State after start(): " + demoThread.getState()); // RUNNABLE / TIMED_WAITING
        demoThread.join();
        System.out.println("  State after join() : " + demoThread.getState()); // TERMINATED

        // --------------------------------------------------
        //  CONCEPT 3 — sleep(), join(), yield()
        // --------------------------------------------------
        heading("CONCEPT 3: sleep() | join() | yield()");

        Thread sleepDemo = new Thread(() -> {
            System.out.println("  [sleep] Thread going to sleep for 300ms...");
            pause(300);
            System.out.println("  [sleep] Thread woke up!");
        });
        sleepDemo.start();
        sleepDemo.join(); // main waits here until sleepDemo finishes

        System.out.println("""
          sleep(ms)  -> Pause current thread for given milliseconds; releases CPU but NOT lock
          join()     -> Calling thread waits until the target thread finishes
          yield()    -> Hint to scheduler: 'I can pause, let others run' (not guaranteed)
        """);

        // --------------------------------------------------
        //  CONCEPT 4 — Thread Priority
        // --------------------------------------------------
        heading("CONCEPT 4: Thread Priority");

        PriorityTask low    = new PriorityTask("LowPriority",    Thread.MIN_PRIORITY);   // 1
        PriorityTask normal = new PriorityTask("NormalPriority", Thread.NORM_PRIORITY);  // 5
        PriorityTask high   = new PriorityTask("HighPriority",   Thread.MAX_PRIORITY);   // 10

        low.start(); normal.start(); high.start();
        low.join(); normal.join(); high.join();

        System.out.println("\n  NOTE: Priority is a HINT — the OS scheduler may not honor it strictly.");

        // --------------------------------------------------
        //  CONCEPT 5 — Daemon Thread
        // --------------------------------------------------
        heading("CONCEPT 5: Daemon Thread");

        DaemonWorker daemon = new DaemonWorker();
        daemon.setDaemon(true); // MUST call setDaemon(true) BEFORE start()
        daemon.start();

        System.out.println("  Daemon thread started. Main thread runs for 1.2 sec then exits...");
        pause(1200);
        // When main ends, daemon dies automatically — you'll see ~2 heartbeats
        System.out.println("  Main thread done. Daemon will now die silently.");

        // --------------------------------------------------
        //  CONCEPT 6 — Synchronization (Race Condition)
        // --------------------------------------------------
        heading("CONCEPT 6: Synchronization — Race Condition vs Safe");

        BankAccount account = new BankAccount();

        // --- UNSAFE ---
        System.out.println("\n  WITHOUT synchronization (race condition possible):");
        Thread u1 = new Thread(() -> account.withdrawUnsafe(700, "UserA"));
        Thread u2 = new Thread(() -> account.withdrawUnsafe(700, "UserB"));
        u1.start(); u2.start();
        u1.join();  u2.join();
        System.out.println("  Final unsafe balance: " + account.getBalance()
                + " (expected >= 0, but may be negative due to race!)");

        // --- SAFE ---
        account.resetBalance();
        System.out.println("\n  WITH synchronization (thread-safe):");
        Thread s1 = new Thread(() -> account.withdrawSafe(700, "UserA"));
        Thread s2 = new Thread(() -> account.withdrawSafe(700, "UserB"));
        s1.start(); s2.start();
        s1.join();  s2.join();
        System.out.println("  Final safe balance: " + account.getBalance()
                + " (always >= 0, second thread blocked correctly)");

        // --------------------------------------------------
        //  CONCEPT 7 & 8 — wait() / notify() + Producer-Consumer
        // --------------------------------------------------
        heading("CONCEPT 7 & 8: wait()/notify() — Producer-Consumer Pattern");

        SharedBuffer buffer = new SharedBuffer();
        Producer producer = new Producer(buffer);
        Consumer consumer = new Consumer(buffer);

        producer.start();
        consumer.start();
        producer.join();
        consumer.join();

        System.out.println("\n  KEY POINTS:");
        System.out.println("  - wait()   releases the lock and suspends the thread");
        System.out.println("  - notify() wakes one waiting thread (notifyAll() wakes all)");
        System.out.println("  - Both MUST be called inside a synchronized block!");

        // --------------------------------------------------
        //  CONCEPT 9 — ReentrantLock
        // --------------------------------------------------
        heading("CONCEPT 9: ReentrantLock");

        LockedCounter counter = new LockedCounter();
        Thread[] lockThreads = new Thread[5];
        for (int i = 0; i < 5; i++) {
            final String name = "T" + (i + 1);
            lockThreads[i] = new Thread(() -> counter.increment(name));
            lockThreads[i].start();
        }
        for (Thread t : lockThreads) t.join();
        System.out.println("  Final count (should be 5): " + counter.getCount());

        // --------------------------------------------------
        //  CONCEPT 10 — AtomicInteger
        // --------------------------------------------------
        heading("CONCEPT 10: AtomicInteger (Lock-Free Thread Safety)");

        AtomicCounter atomicCounter = new AtomicCounter();
        Thread[] atomicThreads = new Thread[1000];
        for (int i = 0; i < 1000; i++) {
            atomicThreads[i] = new Thread(atomicCounter::increment);
            atomicThreads[i].start();
        }
        for (Thread t : atomicThreads) t.join();
        System.out.println("  1000 threads each incremented once.");
        System.out.println("  Expected: 1000 | Actual: " + atomicCounter.getCount());

        // --------------------------------------------------
        //  CONCEPT 11 — ExecutorService & Thread Pool
        // --------------------------------------------------
        heading("CONCEPT 11: ExecutorService & Thread Pool");

        System.out.println("  Creating a Fixed Thread Pool with 3 threads for 6 tasks...\n");

        // fixedThreadPool(3) → only 3 threads; extra tasks QUEUE until a thread is free
        ExecutorService pool = Executors.newFixedThreadPool(3);

        for (int i = 1; i <= 6; i++) {
            final int taskId = i;
            pool.submit(() -> {
                System.out.println("  [Pool] Task-" + taskId
                        + " started by " + Thread.currentThread().getName());
                pause(400);
                System.out.println("  [Pool] Task-" + taskId + " done.");
            });
        }

        pool.shutdown();               // stop accepting new tasks
        pool.awaitTermination(10, TimeUnit.SECONDS); // wait for all tasks to finish

        System.out.println("\n  Thread Pool Types:");
        System.out.println("  newFixedThreadPool(n)   — fixed n threads");
        System.out.println("  newCachedThreadPool()   — grows/shrinks dynamically");
        System.out.println("  newSingleThreadExecutor()— exactly 1 thread");
        System.out.println("  newScheduledThreadPool()— runs tasks at fixed rate/delay");

        // --------------------------------------------------
        //  CONCEPT 12 — Callable & Future
        // --------------------------------------------------
        heading("CONCEPT 12: Callable & Future (Threads That Return Values)");

        ExecutorService executor = Executors.newFixedThreadPool(3);

        // Submit 3 Callable tasks
        Future<Integer> f1 = executor.submit(new SumTask(1,   100));
        Future<Integer> f2 = executor.submit(new SumTask(101, 200));
        Future<Integer> f3 = executor.submit(new SumTask(201, 300));

        // .get() blocks until the result is ready
        int total = f1.get() + f2.get() + f3.get();
        System.out.println("\n  Grand total sum(1..300) = " + total + " (expected 45150)");

        executor.shutdown();

        // --------------------------------------------------
        //  FINAL SUMMARY
        // --------------------------------------------------
        heading("THREAD CONCEPTS SUMMARY");
        System.out.println("""
          1.  Thread Creation    — extend Thread OR implement Runnable/Lambda
          2.  Life Cycle         — NEW → RUNNABLE → RUNNING → BLOCKED/WAITING → TERMINATED
          3.  sleep/join/yield   — control timing and order of threads
          4.  Priority           — hint to scheduler (MIN=1, NORM=5, MAX=10)
          5.  Daemon Thread      — background thread; dies when all user threads end
          6.  Synchronization    — 'synchronized' keyword prevents race conditions
          7.  wait/notify        — inter-thread signalling (must be in synchronized block)
          8.  Producer-Consumer  — classic multithreading design pattern
          9.  ReentrantLock      — flexible, powerful alternative to synchronized
          10. AtomicInteger      — lock-free, CPU-level thread-safe operations
          11. ExecutorService    — manage pools of threads efficiently
          12. Callable & Future  — threads that compute and return a value
        """);

        System.out.println("  All concepts demonstrated successfully!");
    }
}
