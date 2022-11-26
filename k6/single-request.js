import http from "k6/http";
import { sleep, check } from "k6";
import { Counter } from "k6/metrics";

// A simple counter for http requests

export const requests = new Counter("http_reqs");

// you can specify stages of your test (ramp up/down patterns) through the options object
// target is the number of VUs you are aiming for

export const options = {
  stages: [
    { target: 40, duration: "3s" }, // targets = VUs, from 0 to 20 VUs take 10sec
    { target: 15, duration: "2m" },
    { target: 0, duration: "25s" },
  ],
  //   thresholds: {
  //     http_reqs: ["count < 100"],
  //   },
};

export default function () {
  // our HTTP request, note that we are saving the response to res, which can be accessed later

  //   const res = http.get("http://test.k6.io"); // testing api by k6
  const res = http.get("http://localhost:8000/api/menu/items");

  //   sleep(1);

  const checkRes = check(res, {
    "status is 200": (r) => r.status === 200,

    "status is 403": (r) => r.status === 403,
    "status is 404": (r) => r.status === 404,
    "status is 429": (r) => r.status === 429,

    "status is 500": (r) => r.status === 500,
    "status is 503": (r) => r.status === 503,
    // "response body": (r) => r.body.indexOf("Feel free to browse") !== -1,
  });
}
