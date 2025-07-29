import { NextRequest, NextResponse } from 'next/server';
import metaplexlib from "@/lib/metaplexlib";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, explorerLink, imageUrl, publicKey } = body;

        if (!name || !imageUrl || !publicKey) {
            return NextResponse.json(
                { message: "Bad request mint nft" },
                { status: 400 }
            );
        }

        const nftData = {
            name,
            explorerLink,
            imageUrl,
            publicKey,
        };

        const nftResponse = await metaplexlib.createNFT(nftData);
        return NextResponse.json(nftResponse);
    } catch (error) {
        console.error("error =>", error);
        return NextResponse.json(
            { message: "probably didnt get nameString" },
            { status: 500 }
        );
    }
}