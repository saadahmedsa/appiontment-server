import { Clerk } from "@clerk/clerk-sdk-node";

const clerkClient = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// Middleware to check authentication
export async function requireuser(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Missing token" });

    const session = await clerkClient.sessions.verifySession(token);
    if (!session) return res.status(401).json({ error: "Invalid session" });

    req.userId = session.userId;
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
