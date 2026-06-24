import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url');
    const filename = req.nextUrl.searchParams.get('filename') || 'image.jpg';

    if (!url) return new NextResponse('Missing URL', { status: 400 });

    const response = await fetch(url);
    const blob = await response.blob();

    return new NextResponse(blob, {
        headers: {
            'Content-Type': blob.type,
            'Content-Disposition': `attachment; filename="${filename}"`,
        },
    });
}