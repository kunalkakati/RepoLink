import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 1. Extracting searchParams automatically makes this route dynamic
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing ID parameter" },
      { status: 400 },
    );
  }
  const baseUrl = process.env.API_BASE_URL;
  const rapidApiUrl = `${baseUrl}/movies/${id}`;

  try {
    const response = await fetch(rapidApiUrl, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY as string,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST as string,
      },
      // 2. This prevents the native fetch from caching the external RapidAPI response
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "External API request failed" },
        { status: response.status },
      );
    }

    const data = await response.json();
    const samples = Array.isArray(data.samples)
      ? data.samples.map((sample: { src?: string; thumbnail?: string }) => ({
          ...sample,
          thumbnail: sample.src || sample.thumbnail,
        }))
      : data.samples;

    return NextResponse.json({
      ...data,
      img: data.samples?.[0]?.src || data.img,
      samples,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
