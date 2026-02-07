import jwt from 'jsonwebtoken';

export const authenticateVendor = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (decode.role !== 'vendor') {
            return res.status(403).json({ error: "Access denied. Vendor role required" });
        }
        req.user = decode;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ error: "Token expired" });
        } else {
            res.status(403).json({ error: "Invalid token" });
        }
    }
};
