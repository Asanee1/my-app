import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';

export async function POST(req) {
    try {
        await connectMongoDB();
        const { email } = await req.json();
        const user = await User.findOne({ email }).select("_id");
        console.log("User: ", user);

        if (user) {
            return NextResponse.json({ userExists: true }, { status: 200 });
        } else {
            return NextResponse.json({ userExists: false }, { status: 200 });
        }

    } catch(error) {
        console.error("Error checking user:", error);
        return NextResponse.json({ message: "An error occurred while checking the user." }, { status: 500 });
    }
}
