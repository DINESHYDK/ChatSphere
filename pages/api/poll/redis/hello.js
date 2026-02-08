import { NextResponse } from "next/server";
import { createClient } from "redis";
import client from "@/config/redis";

export default async function GET(req, res) {
  const res1 = await client.set("name", "Vissy");
  const name = await client.get("name");
  return res.status(200).send(name);
  // const res1 = await client.zAdd("racer_scores", { score: 10, value: "Norem" });

  // const res2 = await client.zAdd("racer_scores", {
  //   score: 12,
  //   value: "Castilla",
  // });

  // const res3 = await client.zAdd("racer_scores", [
  //   { score: 8, value: "Sam-Bodden" },
  //   { score: 10, value: "Royce" },
  //   { score: 6, value: "Ford" },
  //   { score: 14, value: "Prickett" },
  //   { score: 12, value: "Castilla" },
  // ]);

  // const result = await client.zRange("racer_scores", 0, -1);
  // const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
  // return res.status(200).send(ip);
}
