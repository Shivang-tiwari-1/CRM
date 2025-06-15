exports.corsOptions = {
  origin: ["http://192.168.0.113:8000", "http://localhost:8000"],
  credentials: true,
  optionsSuccessStatus: 200,
};

exports.cookie_options = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
};
