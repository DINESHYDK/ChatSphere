import client from "@/config/redis.js";
import fs from "fs";

export default async function GET(req, res) {
  fs.readFile(
    "/home/vishesh/chatsphere/redis-scripts/add-poll.lua",
    "utf-8",
    async (err, data) => {
      console.log("data is ", data);
      const result = await client.eval(data, {
        keys: ["my-hash"],
        arguments: ["5"],
      });
      return res.status(200).json({ result: result });
    },
  );

  // const res1 = await client.set("name", "Vissy");
  // const name = await client.g.et("name");
  // return res.status(200).send(name);
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
