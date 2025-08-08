document.addEventListener("DOMContentLoaded", () => {
    const gameList = document.getElementById("game-list");
    const modal = document.getElementById("modal");
    const gameTitle = document.getElementById("game-title");
    const gameDescription = document.getElementById("game-description");
    const screenshotsDiv = document.getElementById("screenshots");
    const platformSelect = document.getElementById("platform-select");
    const downloadBtn = document.getElementById("download-btn");

    let allGames = [];

    fetch(`games.json?version=${new Date().getTime()}`, { cache: "no-store" })
        .then(res => res.json())
        .then(data => {
            allGames = data;
            renderGames(data);
        });

    function renderGames(games) {
        gameList.innerHTML = "";
        games.forEach((game, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <img src="${game.cover}" alt="${game.title}">
                <div class="card-content">
                    <h3>${game.title}</h3>
                    <p>${game.shortDescription || game.description.slice(0, 60) + "..."}</p>
                    <div class="author">Издатель: ${game.author || "Неизвестен"}</div>
                    <div class="tags">
                        ${Object.keys(game.platforms).map(p => `<span class="tag">${p}</span>`).join("")}
                    </div>
                </div>
            `;
            card.addEventListener("click", () => openModal(game));
            gameList.appendChild(card);
        });
    }

    function openModal(game) {
        gameTitle.textContent = game.title;
        gameDescription.textContent = game.description;
        screenshotsDiv.innerHTML = game.screenshots.map(src => `<img src="${src}">`).join("");

        platformSelect.innerHTML = "";
        Object.keys(game.platforms).forEach(platform => {
            let option = document.createElement("option");
            option.value = platform;
            option.textContent = platform;
            platformSelect.appendChild(option);
        });

        updateDownloadBtn(game);
        platformSelect.onchange = () => updateDownloadBtn(game);

        modal.style.display = "flex";
    }

    function updateDownloadBtn(game) {
        const selectedPlatform = platformSelect.value;
        if (game.platforms[selectedPlatform]) {
            downloadBtn.href = game.platforms[selectedPlatform];
            downloadBtn.style.display = "inline-block";
        } else {
            downloadBtn.style.display = "none";
        }
    }

    document.getElementById("closeModal").addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", e => {
        if (e.target === modal) modal.style.display = "none";
    });

    // Поиск и фильтр
    document.getElementById("search").addEventListener("input", filterGames);
    document.getElementById("platform-filter").addEventListener("change", filterGames);

    function filterGames() {
        const searchText = document.getElementById("search").value.toLowerCase();
        const selectedPlatform = document.getElementById("platform-filter").value;
        const filtered = allGames.filter(game => {
            const matchesSearch = game.title.toLowerCase().includes(searchText);
            const matchesPlatform = selectedPlatform ? Object.keys(game.platforms).includes(selectedPlatform) : true;
            return matchesSearch && matchesPlatform;
        });
        renderGames(filtered);
    }
});

