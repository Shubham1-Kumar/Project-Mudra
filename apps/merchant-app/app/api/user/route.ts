import { NextResponse } from "next/server";
import client from "@repo/db/client"
export const GET = async () => {
  const randomValue = Math.random();
  await client.user.create({
    data: {
      email: `${randomValue}asd@example.com`,
      name: "Test User",
      number: `${randomValue}`,
      password: "securePassword123"+ randomValue
    }
  });
  return NextResponse.json({
    message: "hi there"
  });
};
