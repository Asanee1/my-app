import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcryptjs";

export async function PUT(req) {
  try {
    await connectMongoDB();

    const token = await getToken({ req });
    if (!token || !token.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.id;

    const { name, email, password } = await req.json();

    const updateData = { name, email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
