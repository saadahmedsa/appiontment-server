import "dotenv/config"
import { Clerk } from "@clerk/clerk-sdk-node";

const clerkClient = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });


export const getUser = async  (req, res) => {
  try {
    const users = await clerkClient.users.getUserList({ limit: 50 });
    
    // 4️⃣ Filter out admins
    const nonAdminUsers = users.filter(
      (user) => user.publicMetadata.role !== "admin"
    );
    res.json(nonAdminUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

