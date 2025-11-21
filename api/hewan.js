import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  const method = req.method;

  // GET semua hewan
  if (method === "GET") {
    const { data, error } = await supabase
      .from("hewan")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ error });
    return res.status(200).json(data);
  }

  // POST tambah hewan
  if (method === "POST") {
    const body = req.body;

    const payload = {
      name: body.nama_hewan,
      origin: body.asal_hewan,
      condition: body.kondisi_hewan,
      short_description: body.deskripsi_singkat,
      long_description: body.deskripsi_detail,
      image_url: body.gambar_url,
    };

    const { data, error } = await supabase
      .from("hewan")
      .insert(payload)
      .select();

    if (error) return res.status(400).json({ error });
    return res.status(201).json({ message: "Data berhasil ditambahkan", data });
  }

  res.status(405).json({ message: "Method not allowed" });
}
