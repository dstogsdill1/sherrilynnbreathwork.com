import { NextResponse } from 'next/server';
import { getSiteContent } from '@/lib/content';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Note: Contentful's Delivery API is read-only.
  // Content updates should be done through the Contentful web interface
  // or by implementing the Management API.
  // For now, we return an error indicating this limitation.
  return NextResponse.json(
    { 
      error: "Content updates must be made through Contentful's web interface",
      message: "Visit https://app.contentful.com to edit content"
    }, 
    { status: 501 }
  );
}
