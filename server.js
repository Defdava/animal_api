import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

export const app = express(); // ekspor untuk vercel
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

  if (error) return res.status(400).json({ error });
  res.json(data);
});

// GET by ID
app.get("/hewan/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("hewan")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error });
  res.json(data);
});

// POST tambah hewan
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

  if (error) return res.status(400).json({ error });
  res.status(201).json({ message: "Berhasil ditambahkan", data });
});

// PATCH update
app.patch("/hewan/:id", async (req, res) => {
  const { id } = req.params;
  const b = req.body;

  const updateData = {
    name: b.nama_hewan,
    origin: b.asal_hewan,
    condition: b.kondisi_hewan,
    short_description: b.deskripsi_singkat,
    long_description: b.deskripsi_detail,
    image_url: b.gambar_url,
  };

  Object.keys(updateData).forEach((k) => updateData[k] === undefined && delete updateData[k]);

  const { data, error } = await supabase
    .from("hewan")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) return res.status(400).json({ error });
  res.json({ message: "Berhasil update", data });
});

// DELETE
app.delete("/hewan/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("hewan")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json({ error });
  res.json({ message: "Berhasil dihapus" });
});

// LOCAL ONLY
if (process.env.LOCAL === "true") {
  app.listen(process.env.PORT, () => {
    console.log("🔥 Lokal jalan di http://localhost:" + process.env.PORT);
  });
}
