const url = "http://localhost:3000/players";

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".position-buttons button");
  const sections = {
    Goalkeepers: "goalkeepers",
    Defenders: "defenders",
    Midfielders: "midfielders",
    Forwards: "forwards",
  };

  // Smooth scroll to section when button clicked
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = sections[button.textContent];
      if (id) {
        document.getElementById(id).scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Fetch player data from db.json
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const playerCards = document.querySelectorAll(".player");

      playerCards.forEach((card) => {
        const nameEl = card.querySelector("strong");
        if (!nameEl) return;

        const playerName = nameEl.textContent.trim();
        const matchedPlayer = data.find(
          (p) => p.name.toLowerCase() === playerName.toLowerCase()
        );
        if (!matchedPlayer) return;

        card.addEventListener("mouseenter", () => {
          // Remove any existing popup
          const oldPopup = card.querySelector(".stats-popup");
          if (oldPopup) oldPopup.remove();

          const stats = matchedPlayer.stats;
          const isGoalkeeper = matchedPlayer.position === "Goalkeeper";

          const statsHtml = `
            <div class="stats-popup">
              <div class="stat-block">
                <div class="label">BARÇA APPEARANCES</div>
                <div class="value">${stats.all_time.appearances}</div>
                <div class="season-label">2024/25 Season</div>
                <div class="season-value">${stats.season_2024_25.appearances}</div>
              </div>
              ${isGoalkeeper ? `
                <div class="stat-block">
                  <div class="label">BARÇA CLEAN SHEETS</div>
                  <div class="value">${stats.all_time.clean_sheets}</div>
                  <div class="season-label">2024/25 Season</div>
                  <div class="season-value">${stats.season_2024_25.clean_sheets}</div>
                </div>
                <div class="stat-block">
                  <div class="label">BARÇA SAVES</div>
                  <div class="value">${stats.all_time.saves}</div>
                  <div class="season-label">2024/25 Season</div>
                  <div class="season-value">${stats.season_2024_25.saves}</div>
                </div>
              ` : `
                <div class="stat-block">
                  <div class="label">BARÇA GOALS</div>
                  <div class="value">${stats.all_time.goals}</div>
                  <div class="season-label">2024/25 Season</div>
                  <div class="season-value">${stats.season_2024_25.goals}</div>
                </div>
                <div class="stat-block">
                  <div class="label">BARÇA ASSISTS</div>
                  <div class="value">${stats.all_time.assists}</div>
                  <div class="season-label">2024/25 Season</div>
                  <div class="season-value">${stats.season_2024_25.assists}</div>
                </div>
              `}
              <button class="add-favorite" data-player-id="${matchedPlayer.id}">Add to Favorites</button>
              <button class="edit-stats" data-player-id="${matchedPlayer.id}">Edit Stats</button>
              <button class="delete-player" data-player-id="${matchedPlayer.id}">Delete Player</button>
            </div>
          `;

          // Append new popup
          card.insertAdjacentHTML("beforeend", statsHtml);
        });

        // Optional: remove popup on mouseleave
        card.addEventListener("mouseleave", () => {
          const popup = card.querySelector(".stats-popup");
          if (popup) popup.remove();
        });
      });
    });
});
