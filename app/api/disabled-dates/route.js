import { prisma } from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get("listingId");
  const typeId = searchParams.get("typeId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!typeId || !startDate || !endDate) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const today = new Date();
    let searchStart = new Date(startDate);
    let searchEnd = new Date(endDate);

    // // Adjust search range (30 days before and after)
    // searchStart.setDate(searchStart.getDate() - 30);
    // if (searchStart < today) searchStart = today; // Ensure no past dates

    // searchEnd.setDate(searchEnd.getDate() + 30);

    // Fetch availability for the given typeId
    const availabilityRecords = await prisma.availability.findMany({
      where: {
        typeId,
        date: { gte: searchStart, lte: searchEnd },
      },
      select: { date: true, available: true },
    });

    // Fetch blocked dates for the listing
    const blockedDates = await prisma.blockedDate.findMany({
      where: {
        listingId,
        OR: [{ startDate: { lte: searchEnd }, endDate: { gte: searchStart } }],
      },
      select: { startDate: true, endDate: true },
    });

    const unavailableDates = new Set();

    // Add fully booked availability dates
    availabilityRecords.forEach(({ date, available }) => {
      if (!available) unavailableDates.add(date.toISOString().split("T")[0]); // Store as YYYY-MM-DD
    });

    // Add blocked date ranges
    blockedDates.forEach(({ startDate, endDate }) => {
      let currentDate = new Date(startDate);
      while (currentDate <= new Date(endDate)) {
        unavailableDates.add(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return NextResponse.json({ disabledDates: Array.from(unavailableDates) });
  } catch (error) {
    console.error("Error fetching disabled dates:", error);
    return NextResponse.json(
      { error: "Failed to fetch disabled dates" },
      { status: 500 }
    );
  }
}
