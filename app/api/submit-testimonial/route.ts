import { NextResponse } from "next/server";

// Contentful Management API endpoint
const CONTENTFUL_MANAGEMENT_API = "https://api.contentful.com";

export async function POST(req: Request) {
  try {
    const { name, role, message, rating } = await req.json();

    if (!name || !message || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const environmentId = process.env.CONTENTFUL_ENVIRONMENT || "master";

    if (!managementToken || !spaceId) {
      console.error("Contentful management credentials are missing");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create the entry in Contentful (draft status - not published)
    const entry = {
      fields: {
        name: { "en-US": name },
        role: { "en-US": role || "" },
        message: { "en-US": message },
        rating: { "en-US": parseInt(rating, 10) },
        approved: { "en-US": false },
      },
    };

    const response = await fetch(
      `${CONTENTFUL_MANAGEMENT_API}/spaces/${spaceId}/environments/${environmentId}/entries`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${managementToken}`,
          "Content-Type": "application/vnd.contentful.management.v1+json",
          "X-Contentful-Content-Type": "testimonial",
        },
        body: JSON.stringify(entry),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Contentful API error:", errorData);
      return NextResponse.json(
        { error: "Failed to submit testimonial" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
