const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = "./anime.json";

// Fungsi helper baca data
function readData(callback) {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return callback(err);
    let jsonData = {};
    try {
      jsonData = JSON.parse(data || "{}");
    } catch {
      jsonData = {};
    }
    if (!jsonData.anime) jsonData.anime = [];
    callback(null, jsonData);
  });
}

// Ambil semua anime
app.get("/anime", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Gagal membaca data" });

    let jsonData = JSON.parse(data || "{}");
    let animeList = jsonData.anime || [];

    res.json(animeList);
  });
});

// Ambil anime berdasarkan id
app.get("/anime/:id", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Gagal membaca data" });

    let jsonData = JSON.parse(data || "{}");
    let animeList = jsonData.anime || [];

    console.log("Anime List:", animeList);
    console.log("Mencari id:", req.params.id, "tipe:", typeof req.params.id);

    const anime = animeList.find((a) => {
      console.log(
        `Bandingkan a.id (${a.id}, tipe ${typeof a.id}) dengan req.params.id (${
          req.params.id
        }, tipe ${typeof req.params.id})`
      );
      return a.id == req.params.id;
    });

    if (!anime) return res.status(404).json({ error: "Anime tidak ditemukan" });
    res.json(anime);
  });
});

// Tambah anime
app.post("/anime", (req, res) => {
  readData((err, jsonData) => {
    if (err) return res.status(500).json({ error: "Gagal membaca data" });

    // Tambahkan data baru ke array anime
    jsonData.anime.push(req.body);

    fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Gagal menyimpan data" });
      res.json({ message: "Anime berhasil ditambahkan" });
    });
  });
});

// Update anime
app.put("/anime/:id", (req, res) => {
  readData((err, jsonData) => {
    if (err) return res.status(500).json({ error: "Gagal membaca data" });

    jsonData.anime = jsonData.anime.map((a) =>
      a.id == req.params.id ? req.body : a
    );

    fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Gagal menyimpan data" });
      res.json({ message: "Anime berhasil diperbarui" });
    });
  });
});

// Hapus anime
app.delete("/anime/:id", (req, res) => {
  readData((err, jsonData) => {
    if (err) return res.status(500).json({ error: "Gagal membaca data" });

    jsonData.anime = jsonData.anime.filter((a) => a.id != req.params.id);

    fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Gagal menyimpan data" });
      res.json({ message: "Anime berhasil dihapus" });
    });
  });
});

app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});
