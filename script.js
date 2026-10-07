const MASTER_NAME = "Master";
const MASTER_PASSWORD = "9797979797";
const USERS_KEY = "ogv_users";
const SESSION_KEY = "ogv_session";

const games = [
  { title: "Stabfish.io", platforms: "Browser", desc: "Fast multiplayer .io fish-eating arena. Play officially at the real site.", tags: ["multiplayer", "browser"], categories: ["action"], external: "https://stabfish.io" },
  { title: "Baldur's Gate 3", platforms: "PC • PS5 • Xbox", desc: "Deep D&D CRPG with massive reactivity and 100+ hour campaigns. Fully offline single-player.", tags: ["rpg"], categories: ["rpg"] },
  { title: "Elden Ring", platforms: "PC • PS4/5 • Xbox", desc: "Open-world soulsborne. Explore and fight completely offline.", tags: ["rpg", "action"], categories: ["rpg", "action"] },
  { title: "Stardew Valley", platforms: "PC • Console • Mobile", desc: "Cozy farming RPG. Hundreds of hours offline.", tags: ["cozy"], categories: ["cozy"] },
  { title: "The Witcher 3: Wild Hunt", platforms: "PC • Console", desc: "Epic open-world RPG. Fully offline after install.", tags: ["rpg"], categories: ["rpg"] },
  { title: "Red Dead Redemption 2", platforms: "PC • Console", desc: "Cinematic Western. Story mode works fully offline.", tags: ["rpg", "action"], categories: ["rpg", "action"] },
  { title: "Hades / Hades 2", platforms: "PC • Switch • Console", desc: "Top-tier roguelike action. Infinite offline runs.", tags: ["action"], categories: ["action"] },
  { title: "Balatro", platforms: "PC • Mobile • Console", desc: "Poker roguelike deckbuilder. Fully offline.", tags: ["strategy"], categories: ["strategy"] },
  { title: "Slay the Spire", platforms: "PC • Mobile • Console", desc: "Deckbuilding roguelike. Perfect offline sessions.", tags: ["strategy"], categories: ["strategy"] },
  { title: "Dead Cells", platforms: "PC • Mobile • Console", desc: "Fluid metroidvania roguelike. Excellent offline.", tags: ["action"], categories: ["action"] },
  { title: "Hollow Knight", platforms: "PC • Console", desc: "Beautiful challenging metroidvania. Pure offline.", tags: ["action"], categories: ["action"] },
  { title: "Terraria", platforms: "PC • Mobile • Console", desc: "2D sandbox adventure. Solo offline is excellent.", tags: ["sandbox"], categories: ["sandbox"] },
  { title: "Minecraft (local worlds)", platforms: "PC • Mobile • Console", desc: "Create and play local worlds forever offline.", tags: ["sandbox"], categories: ["sandbox"] },
  { title: "Subnautica", platforms: "PC • Console", desc: "Underwater survival exploration. Fully offline.", tags: ["sandbox"], categories: ["sandbox"] },
  { title: "Vampire Survivors", platforms: "PC • Mobile • Console", desc: "Addictive auto-shooter. Zero online requirement.", tags: ["action"], categories: ["action"] },
  { title: "Celeste", platforms: "PC • Console", desc: "Precise platformer with heart. Fully offline.", tags: ["action"], categories: ["action"] },
  { title: "Disco Elysium", platforms: "PC • Console", desc: "Narrative RPG masterpiece. Pure offline.", tags: ["rpg"], categories: ["rpg"] },
  { title: "Outer Wilds", platforms: "PC • Console", desc: "Time-loop space mystery. Best played offline.", tags: ["sandbox"], categories: ["sandbox"] },
  { title: "Bloons TD 6", platforms: "PC • Mobile", desc: "Deep tower defense. Great offline strategy.", tags: ["strategy"], categories: ["strategy"] },
  { title: "GTA V (Story Mode)", platforms: "PC • Console", desc: "Massive open-world. Single-player works offline.", tags: ["action", "sandbox"], categories: ["action", "sandbox"] },
  { title: "Undertale", platforms: "PC • Console", desc: "Legendary indie RPG. Fully offline.", tags: ["rpg"], categories: ["rpg"] },
  { title: "Cuphead", platforms: "PC • Console", desc: "Run-and-gun with local co-op. Fully offline.", tags: ["action"], categories: ["action"] },
  { title: "Mini Metro", platforms: "PC • Mobile • Console", desc: "Elegant subway design puzzle. Fully offline.", tags: ["strategy"], categories: ["strategy"] },
  { title: "The Room series", platforms: "PC • Mobile", desc: "Atmospheric 3D puzzle boxes. Completely offline.", tags: ["strategy"], categories: ["strategy"] }
];

function isMasterName(name) {
  return name.trim().toLowerCase() === MASTER_NAME.toLowerCase();
}

function listUsers() {
  try {
    const parsed = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function setSession(session) {
  if (!session) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

const gate = document.getElementById("gate");
const app = document.getElementById("app");
const form = document.getElementById("gate-form");
const usernameInput = document.getElementById("username");
const passwordWrap = document.getElementById("password-wrap");
const passwordInput = document.getElementById("password");
const errorEl = document.getElementById("gate-error");
const who = document.getElementById("who");
const admin = document.getElementById("admin");
const userList = document.getElementById("user-list");
const toggleUsers = document.getElementById("toggle-users");
const grid = document.getElementById("games-grid");
const buttons = document.querySelectorAll(".filter-btn");

usernameInput.addEventListener("input", () => {
  passwordWrap.classList.toggle("hidden", !isMasterName(usernameInput.value));
  errorEl.hidden = true;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = usernameInput.value.trim();
  if (!name) return showError("Enter a username.");

  if (isMasterName(name)) {
    if (passwordInput.value !== MASTER_PASSWORD) {
      return showError("Incorrect password. You cannot sign in.");
    }
    setSession({ username: MASTER_NAME, isMaster: true });
    openApp();
    return;
  }

  const users = listUsers();
  if (users.some((u) => u.username.toLowerCase() === name.toLowerCase())) {
    return showError("That username is taken. Choose a different one.");
  }

  users.push({ username: name, createdAt: Date.now() });
  saveUsers(users);
  setSession({ username: name, isMaster: false });
  openApp();
});

document.getElementById("sign-out").addEventListener("click", () => {
  setSession(null);
  app.hidden = true;
  gate.hidden = false;
  usernameInput.value = "";
  passwordInput.value = "";
  passwordWrap.classList.add("hidden");
});

toggleUsers.addEventListener("click", () => {
  const hidden = admin.hidden;
  admin.hidden = !hidden;
  toggleUsers.textContent = hidden ? "Hide users" : "Show users";
});

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.hidden = false;
}

function renderUsers() {
  const users = listUsers();
  userList.innerHTML = users.length
    ? users.map((u) => `
        <li>
          <span>${u.username}</span>
          <button class="delete-btn" data-user="${u.username}">Delete</button>
        </li>
      `).join("")
    : "<li>No users yet.</li>";

  userList.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      saveUsers(listUsers().filter((u) => u.username !== btn.dataset.user));
      renderUsers();
    });
  });
}

function render(filter = "all") {
  grid.innerHTML = "";
  const filtered = filter === "all" ? games : games.filter((g) => g.categories.includes(filter));
  filtered.forEach((game) => {
    const card = document.createElement("article");
    card.className = "game-card";
    const titleHtml = game.external
      ? `<h2><a href="${game.external}" target="_blank" rel="noopener">${game.title} ↗</a></h2>`
      : `<h2>${game.title}</h2>`;
    card.innerHTML = `
      ${titleHtml}
      <div class="platforms">${game.platforms}</div>
      <p class="desc">${game.desc}</p>
      <div class="tags">${game.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
    `;
    grid.appendChild(card);
  });
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    render(btn.dataset.filter);
  });
});

function openApp() {
  const session = getSession();
  if (!session) return;
  gate.hidden = true;
  app.hidden = false;
  who.textContent = session.username;
  toggleUsers.hidden = !session.isMaster;
  admin.hidden = !session.isMaster;
  toggleUsers.textContent = "Hide users";
  if (session.isMaster) renderUsers();
  render();
}

if (getSession()) openApp();
