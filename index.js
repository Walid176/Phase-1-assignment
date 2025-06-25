const baseURL = "http://localhost:3000/players";

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".position-buttons button");
  const sections = {
    Goalkeepers: "goalkeepers",
    Defenders: "defenders",
    Midfielders: "midfielders",
    Forwards: "forwards",
    "Coaching Staff": "coaching-staff",
  };

  // click button to scroll
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = sections[button.textContent];
      if (id) document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    });
  });

  // stats
  const allPlayers = document.querySelectorAll(".player");
  allPlayers.forEach((player) => {
    player.addEventListener("mouseenter", () => {
      const stats = player.querySelector(".stats");
      if (stats) stats.style.display = "block";
    });
    player.addEventListener("mouseleave", () => {
      const stats = player.querySelector(".stats");
      if (stats) stats.style.display = "none";
    });
  });

  // player search
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    allPlayers.forEach((player) => {
      const name = player.querySelector("strong")?.textContent.toLowerCase();
      player.style.display = name.includes(term) ? "block" : "none";
    });
  });
});
