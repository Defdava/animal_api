import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

export const app = express();
app.use(express.json());
app.use(cors());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// GET semua hewan
app.get("/hewan", async (req, res) => {
  const { data, error } = await supabase
    .from("hewan")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Tambah hewan
app.post("/hewan", async (req, res) => {
  const b = req.body;

  const payload = {
    name: b.nama_hewan,
    origin: b.asal_hewan,
    condition: b.kondisi_hewan,
    short_description: b.deskripsi_singkat,
    long_description: b.deskripsi_detail,
    image_url: b.gambar_url,
  };

  const { data, error } = await supabase
    .from("hewan")
    .insert(payload)
    .select();

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// LOCAL mode
if (process.env.LOCAL === "true") {
  app.listen(4700, () => {
    console.log("LOCAL: http://localhost:4700/hewan");
  });
}
