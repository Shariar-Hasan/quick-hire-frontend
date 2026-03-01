import { Key } from "@/constants/key.constant";
import { NextResponse } from "next/server"

export const GET = async (request: Request) => {
    // Clear the authentication cookie by setting it to an empty value and expiring it immediately
    const url = process.env.NODE_ENV === 'development' ? "http://localhost:3000/login" : 'pore dibo ekhnae';
    const res = NextResponse.redirect(url);
    res.cookies.delete(Key.TOKEN);

    return res;
}