import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "30s", target: 10 }, // Ramp-up to 10 users over 30 seconds
    { duration: "1m", target: 50 }, // Stay at 50 users for 1 minute
    { duration: "30s", target: 0 }, // Ramp-down to 0 users
  ],
};

export default function () {
  let res = http.get("https://boss1dairy.vercel.app/"); // Update URL if needed
  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 500ms": (r) => r.timings.duration < 500,
  });
  sleep(1); // Wait 1 second between iterations
}
