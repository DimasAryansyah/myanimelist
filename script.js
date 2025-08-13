let animeList = [];
let currentCategory = "home";
const API_URL = "http://localhost:3000/anime"; // URL backend

// 🔹 Ambil data anime dari server
async function loadAnime() {
  const res = await fetch(API_URL);
  animeList = await res.json();
  showCategory(currentCategory);
}

// 🔹 Simpan anime baru
async function saveAnime(anime) {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(anime),
  });
  loadAnime();
}

// 🔹 Update anime
async function updateAnime(anime) {
  await fetch(`${API_URL}/${anime.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(anime),
  });
  loadAnime();
}

// 🔹 Hapus anime
async function deleteAnime(id) {
  Swal.fire({
    title: "Yakin?",
    text: "Anime ini akan dihapus permanen!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      Swal.fire("Dihapus!", "Anime berhasil dihapus.", "success");
      loadAnime();
    }
  });
}

function openModal(isEdit = false) {
  document.getElementById("animeModal").style.display = "block";
  if (!isEdit) {
    document.getElementById("animeForm").reset();
    document.getElementById("animeId").value = "";
    document.getElementById("formTitle").innerText = "Add Anime";
  }
}

function closeModal() {
  document.getElementById("animeModal").style.display = "none";
}

document.getElementById("animeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const newId =
    animeList.length === 0 ? 1 : Math.max(...animeList.map((a) => a.id)) + 1;
  const anime = {
    id: String(document.getElementById("animeId").value) || newId,
    judul: document.getElementById("judul").value,
    type: document.getElementById("type").value,
    tahun: document.getElementById("tahun").value,
    status: document.getElementById("status").value,
    episode: document.getElementById("episode").value,
    rating: parseFloat(document.getElementById("rating").value),
    sinopsis: document.getElementById("sinopsis").value,
    gambar: document.getElementById("gambar").value,
  };

  if (document.getElementById("animeId").value) {
    updateAnime(anime);
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Anime berhasil diperbarui",
      timer: 2000,
      showConfirmButton: false,
    });
  } else {
    saveAnime(anime);
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Anime berhasil ditambahkan",
      timer: 2000,
      showConfirmButton: false,
    });
  }

  closeModal();
});

function showCategory(category) {
  currentCategory = category;
  let filtered = animeList;

  if (category === "home") {
    filtered = [...animeList].sort((a, b) => b.rating - a.rating);
  } else if (category === "Watching") {
    filtered = animeList.filter((a) => a.status === "Watching");
  } else if (category === "Plan to Watch") {
    filtered = animeList.filter((a) => a.status === "Plan to Watch");
  } else if (category === "Complete") {
    filtered = animeList.filter((a) => a.status === "Complete");
  }

  renderAnime(filtered);
}

function renderAnime(list) {
  const container = document.getElementById("animeList");
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = "<p>Tidak ada anime</p>";
    return;
  }
  list.forEach((a) => {
    const card = document.createElement("div");
    card.className = "anime-card";
    card.innerHTML = `
    <img src="${a.gambar}" alt="${a.judul}" onclick="viewDetail(${a.id})">
    <div class="title-overlay">${a.judul}</div>
    `;
    container.appendChild(card);
  });
}

function viewDetail(id) {
  window.location.href = `detail.html?id=${id}`;
}

function editAnime(id) {
  const anime = animeList.find((a) => a.id == id);
  document.getElementById("animeId").value = anime.id;
  document.getElementById("judul").value = anime.judul;
  document.getElementById("type").value = anime.type;
  document.getElementById("tahun").value = anime.tahun;
  document.getElementById("status").value = anime.status;
  document.getElementById("episode").value = anime.episode;
  document.getElementById("rating").value = anime.rating;
  document.getElementById("sinopsis").value = anime.sinopsis;
  document.getElementById("gambar").value = anime.gambar;
  document.getElementById("formTitle").innerText = "Edit Anime";
  openModal(true);
}

function applyFilter() {
  const value = document.getElementById("filterSelect").value;
  let filtered = [...animeList];
  if (value === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (value === "az") {
    filtered.sort((a, b) => a.judul.localeCompare(b.judul));
  } else if (value === "tv") {
    filtered = filtered.filter((a) => a.type === "TV");
  } else if (value === "movie") {
    filtered = filtered.filter((a) => a.type === "Movie");
  } else if (value === "ova") {
    filtered = filtered.filter((a) => a.type === "OVA");
  } else if (value === "ona") {
    filtered = filtered.filter((a) => a.type === "ONA");
  } else if (value === "special") {
    filtered = filtered.filter((a) => a.type === "Special");
  } else if (value === "tahun") {
    filtered.sort((a, b) => {
      const yearA = parseInt((a.tahun.match(/\d{4}/) || [0])[0]);
      const yearB = parseInt((b.tahun.match(/\d{4}/) || [0])[0]);
      return yearA - yearB; // dari paling lama ke terbaru
    });
  } else if (value === "watching") {
    filtered = filtered.filter((a) => a.status.toLowerCase() === "watching");
  } else if (value === "plan to watch") {
    filtered = filtered.filter(
      (a) => a.status.toLowerCase() === "plan to watch"
    );
  } else if (value === "complete") {
    filtered = filtered.filter((a) => a.status.toLowerCase() === "complete");
  }
  renderAnime(filtered);
}

function searchAnime() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const filtered = animeList.filter((a) =>
    a.judul.toLowerCase().includes(keyword)
  );
  renderAnime(filtered);
}

// Klik area gelap tutup modal
window.onclick = function (event) {
  const modal = document.getElementById("animeModal");
  if (event.target === modal) {
    closeModal();
  }
};

// 🔹 Load awal
loadAnime();
