const url = "http://localhost:3000/players";
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".position-buttons button");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.textContent;
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    });
  });

  fetch(url)
    .then(res => res.json())
    .then(players => {
      const cards = document.querySelectorAll(".player");

      cards.forEach(card => {
        const name = card.querySelector("strong");
        if (!name) return;

        const player = players.find(p => p.name === name.textContent.trim());
        if (!player) return;

        const star = document.createElement("div");
        star.textContent = "★";
        star.style = "position:absolute;top:5px;right:5px;color:gold;font-size:18px;display:none;";
        card.style.position = "relative";
        card.appendChild(star);

        card.addEventListener("click", () => {
          const old = document.querySelector(".popup");
          if (old) old.remove();

          const popup = document.createElement("div");
          popup.className = "popup";
          popup.style = "background:white;border:1px solid gray;padding:10px;margin-top:10px;";

          const stats = player.stats.all_time;
          const isGK = player.position === "Goalkeeper";

          popup.innerHTML = `
            <p>Apps: ${stats.appearances}</p>
            <p>${isGK ? "Clean Sheets" : "Goals"}: ${isGK ? stats.clean_sheets : stats.goals}</p>
            <p>${isGK ? "Saves" : "Assists"}: ${isGK ? stats.saves : stats.assists}</p>
            <button class="fav">★</button>
            <button class="edit">Edit</button>
            <button class="del">Delete</button>
          `;

          card.appendChild(popup);

          popup.querySelector(".fav").onclick = (e) => {
            e.stopPropagation();
            star.style.display = star.style.display === "none" ? "block" : "none";
          };

          popup.querySelector(".del").onclick = (e) => {
            e.stopPropagation();
            card.remove();
          };

          popup.querySelector(".edit").onclick = (e) => {
            e.stopPropagation();
            const a = prompt("New appearances", stats.appearances);
            const b = prompt("New goals/clean sheets", isGK ? stats.clean_sheets : stats.goals);
            const c = prompt("New saves/assists", isGK ? stats.saves : stats.assists);
            if (a && b && c) {
              stats.appearances = +a;
              if (isGK) {
                stats.clean_sheets = +b;
                stats.saves = +c;
              } else {
                stats.goals = +b;
                stats.assists = +c;
              }
              popup.remove();
            }
          };
        });
      });
    });
});
