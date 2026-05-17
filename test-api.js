// Simple test script to verify serverless functions work
const http = require("http");

const options = {
  hostname: "astha-backend-alpha.vercel.app",
  port: 80,
  path: "/api/test",
  method: "GET",
  headers: {
    Accept: "application/json",
  },
};

console.log("Testing backend API...");
console.log("URL: https://astha-backend-alpha.vercel.app/api/test\n");

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log("Headers:", res.headers);

  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log("\nResponse:", data);

    if (res.statusCode === 200) {
      console.log("\n✅ Backend is working!");
    } else {
      console.log("\n❌ Backend returned an error");
    }
  });
});

req.on("error", (e) => {
  console.error("❌ Request error:", e.message);
  console.log("\nPossible issues:");
  console.log("1. Backend not deployed yet");
  console.log("2. API functions not in the correct location");
  console.log("3. Vercel deployment failed");
});

req.end();
