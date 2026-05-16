module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  res.status(200).json({
    success: true,
    message: "Serverless function is working! 🚀",
    timestamp: new Date().toISOString(),
  });
};
