import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    // Starts with Bearer and takes everything from the right
    if (token.startsWith("Bearer ")) {
      token.slice(7, token.length).trimLeft();
    }

    // checking token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
