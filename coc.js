const townHalls = [
    { level: 1, image: "th1.jpg", description: "Basic Town Hall. Unlocks basic buildings and troops." },
    { level: 2, image: "th2.jpg", description: "New defenses and upgrades are available." },
    { level: 3, image: "th3.jpg", description: "Unlocks Clan Castle, enabling clan membership." },
    { level: 4, image: "th4.jpg", description: "Introduces Air Defense and advanced troops." },
    { level: 5, image: "th5.jpg", description: "Unlocks Wizard Tower and other upgrades." },
    { level: 6, image: "th6.jpg", description: "Unlocks Healer troop and Air Sweeper defense." },
    { level: 7, image: "th7.jpg", description: "Unlocks Dark Elixir and Barbarian King." },
    { level: 8, image: "th8.jpg", description: "Unlocks new Dark Troops and powerful defenses." },
    { level: 9, image: "th9.jpg", description: "Adds Archer Queen and X-Bows for defense." },
    { level: 10, image: "th10.jpg", description: "Unlocks Inferno Towers and advanced troops." },
    { level: 11, image: "th11.jpg", description: "Unlocks Eagle Artillery and the Grand Warden." },
    { level: 12, image: "th12.jpg", description: "Giga Tesla is introduced in the Town Hall." },
    { level: 13, image: "th13.jpg", description: "Giga Inferno and Scattershot defenses added." },
    { level: 14, image: "th14.jpg", description: "Unlocks Pets and more advanced upgrades." },
    { level: 15, image: "th15.jpg", description: "Advanced defenses and powerful upgrades." },
    { level: 16, image: "th16.jpg", description: "Coming Soon! Exciting new features await." },
    { level: 17, image: "th17.jpg", description: "Latest Town Hall with the most powerful upgrades." }
];

const townhallGrid = document.getElementById("townhallGrid");
const modal = document.getElementById("modal");
const townhallTitle = document.getElementById("townhallTitle");
const townhallDescription = document.getElementById("townhallDescription");

function openModal(title, description) {
    townhallTitle.textContent = title;
    townhallDescription.innerHTML = description;
    modal.classList.add("active");
}

function closeModal() {
    modal.classList.remove("active");
}

// Dynamically add town hall cards to the grid
townHalls.forEach(th => {
    const townhallCard = document.createElement("div");
    townhallCard.className = "townhall";
    townhallCard.innerHTML = `<img src="${th.image}" alt="Town Hall ${th.level}" />`;
    townhallCard.onclick = () => openModal(`Town Hall ${th.level}`, th.description);
    townhallGrid.appendChild(townhallCard);
});
