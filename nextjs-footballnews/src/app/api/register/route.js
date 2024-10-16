import { NextResponse } from 'next/server'
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import bcrypt from 'bcryptjs'

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();
        await connectMongoDB();

        // ตรวจสอบว่ามีอีเมลซ้ำหรือไม่
        const existingUser = await User.findOne({ email }).select("_id");
        if (existingUser) {
            return NextResponse.json({ message: "Email is already registered." }, { status: 409 }); // ส่งสถานะ 409 Conflict
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword });

        return NextResponse.json({ message: "User registered." }, { status: 201 });

    } catch(error) {
        console.error("Error registering user:", error);
        return NextResponse.json({ message: "An error occurred while registering the user." }, { status: 500 });
    }
}
