import { Clerk } from "@clerk/clerk-sdk-node";

const clerkClient = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });


export const getUser = async  (req, res) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.userId);

    if (currentUser.publicMetadata.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: not an admin" });
    }

    const users = await clerkClient.users.getUserList({ limit: 50 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

