const url = "http://localhost:3000/players";

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".position-buttons button");
  const sections = {
    Goalkeepers: "goalkeepers",
    Defenders: "defenders",
    Midfielders: "midfielders",
    Forwards: "forwards",
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = sections[button.textContent];
      if (id) {
        document.getElementById(id).scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  let openPopupCard = null;

  document.addEventListener("click", (e) => {
    if (openPopupCard && !openPopupCard.contains(e.target)) {
      const popup = openPopupCard.querySelector(".stats-popup");
      if (popup) popup.remove();
      openPopupCard = null;
    }
  });

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

        // Add star container for favorites
        const star = document.createElement("div");
        star.className = "favorite-star";
        star.textContent = "★";
        star.style.cssText = `
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 20px;
          color: gold;
          display: none;
        `;
        card.style.position = "relative";
        card.appendChild(star);

        // Attach click event for popup
        card.addEventListener("click", (e) => {
          e.stopPropagation();

          const existingPopup = card.querySelector(".stats-popup");
          if (existingPopup) {
            existingPopup.remove();
            openPopupCard = null;
            return;
          }

          if (openPopupCard) {
            const oldPopup = openPopupCard.querySelector(".stats-popup");
            if (oldPopup) oldPopup.remove();
            openPopupCard = null;
          }

          const stats = matchedPlayer.stats;
          const isGK = matchedPlayer.position === "Goalkeeper";

          const html = `
            <div class="stats-popup">
              <div class="stat-block">
                <div class="label">BARÇA APPEARANCES</div>
                <div class="value">${stats.all_time.appearances}</div>
                <div class="season-label">2024/25 Season</div>
                <div class="season-value">${stats.season_2024_25.appearances}</div>
              </div>
              <div class="stat-block">
                <div class="label">BARÇA ${isGK ? "CLEAN SHEETS" : "GOALS"}</div>
                <div class="value">${isGK ? stats.all_time.clean_sheets : stats.all_time.goals}</div>
                <div class="season-label">2024/25 Season</div>
                <div class="season-value">${isGK ? stats.season_2024_25.clean_sheets : stats.season_2024_25.goals}</div>
              </div>
              <div class="stat-block">
                <div class="label">BARÇA ${isGK ? "SAVES" : "ASSISTS"}</div>
                <div class="value">${isGK ? stats.all_time.saves : stats.all_time.assists}</div>
                <div class="season-label">2024/25 Season</div>
                <div class="season-value">${isGK ? stats.season_2024_25.saves : stats.season_2024_25.assists}</div>
              </div>
              <button class="add-favorite" data-player-id="${matchedPlayer.id}">Add to Favorites</button>
              <button class="edit-stats" data-player-id="${matchedPlayer.id}">Edit Stats</button>
              <button class="delete-player" data-player-id="${matchedPlayer.id}">Delete Player</button>
            </div>
          `;

          card.insertAdjacentHTML("beforeend", html);
          openPopupCard = card;

          // Add button functionality
          const popup = card.querySelector(".stats-popup");

          // ADD TO FAVORITES
          popup.querySelector(".add-favorite").addEventListener("click", (e) => {
            e.stopPropagation();
            const isVisible = star.style.display === "block";
            star.style.display = isVisible ? "none" : "block";
          });

          // DELETE PLAYER
          popup.querySelector(".delete-player").addEventListener("click", (e) => {
            e.stopPropagation();
            card.remove();
          });

          // EDIT STATS
          popup.querySelector(".edit-stats").addEventListener("click", (e) => {
            e.stopPropagation();

            const newAppearances = prompt("New total appearances:", stats.all_time.appearances);
            const newGoalsOrCleanSheets = prompt(
              `New total ${isGK ? "clean sheets" : "goals"}:`,
              isGK ? stats.all_time.clean_sheets : stats.all_time.goals
            );
            const newAssistsOrSaves = prompt(
              `New total ${isGK ? "saves" : "assists"}:`,
              isGK ? stats.all_time.saves : stats.all_time.assists
            );

            if (newAppearances && newGoalsOrCleanSheets && newAssistsOrSaves) {
              // Update stats
              stats.all_time.appearances = Number(newAppearances);
              if (isGK) {
                stats.all_time.clean_sheets = Number(newGoalsOrCleanSheets);
                stats.all_time.saves = Number(newAssistsOrSaves);
              } else {
                stats.all_time.goals = Number(newGoalsOrCleanSheets);
                stats.all_time.assists = Number(newAssistsOrSaves);
              }

              // Refresh popup
              popup.remove();
              openPopupCard = null;
              card.click(); // re-open
            }
          });
        });
      });
    });
});
