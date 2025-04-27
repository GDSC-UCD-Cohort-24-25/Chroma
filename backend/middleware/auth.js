import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {   // authenticate user
    try {
       console.log(req.headers.cookie);  //debug
      // const accessToken = req.headers.authorization.split(" ")[1];
      const accessToken = req.cookies.accessToken;
      if (!accessToken) {
          return res.status(401).json({ success: false, message: "Access token missing" });
      }
      // jwt vertify with callback!!
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
          if (err) {
              return res.status(403).json({ success: false, message: "Invalid or expired token" });
          }
          // decoded = { user: { id: 'example_id' }, iat: 1631012345, exp: 1631015945 }
          // decoded.user = { id: 'example_id' }
          req.user = decoded.user; // Attach to req obj
          next();
      });
    } catch (error) {
      res.status(401).json({ success: false, message: "Not authorized to access this route" });
    }
  }