const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Prometheus metrics
 */
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request latency",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 3, 5]
});

/**
 * Simulated database call
 */
function fakeDatabaseQuery() {
  return new Promise((resolve, reject) => {
    const delay = Math.floor(Math.random() * 3000); // 0–3s latency
    const shouldFail = Math.random() < 0.15; // 15% failure rate

    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Database timeout"));
      } else {
        resolve({ delay });
      }
    }, delay);
  });
}

/**
 * Health endpoint
 */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

/**
 * DB endpoint with artificial latency
 */
app.get("/db", async (req, res) => {
  const end = httpRequestDuration.startTimer();

  try {
    const result = await fakeDatabaseQuery();
    console.log(
      `[INFO] DB query succeeded | latency=${result.delay}ms`
    );
    res.status(200).json({
      message: "DB query successful",
      latency_ms: result.delay
    });
    end({ method: "GET", route: "/db", status: 200 });
  } catch (error) {
    console.error(`[ERROR] ${error.message}`);
    res.status(504).json({
      error: "Database timeout"
    });
    end({ method: "GET", route: "/db", status: 504 });
  }
});

/**
 * Metrics endpoint
 */
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(PORT, () => {
  console.log(`🚀 App running on port ${PORT}`);
});

