import "dotenv/config"
import multer from "multer";
import { Clerk, verifyToken } from "@clerk/clerk-sdk-node";

const clerkClient = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });


// Middleware to check authentication
export async function requireuser(req, res, next) {
  try {
     let token =  req.cookies.__session;


    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }
    

    // Verify Clerk token
    const decoded = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    req.userId = decoded.sub; // Clerk userId
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export const requireAdmin = async (req, res, next) => {
  try {
    const user = await clerkClient.users.getUser(req.userId); // 👈 comes from requireAuth

    if (user.publicMetadata.role !== "admin") {
      return res.status(403).json({ error: "Admins only" });
    }

    next();  // ✅ User is admin, pass to route
  } catch (err) {
    return res.status(403).json({ error: "Forbidden" });
  }
};




const storage = multer.memoryStorage(); // keep file in memory
export const upload = multer({ storage });
