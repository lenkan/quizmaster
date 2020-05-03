function renderPlayerListItem(player) {
  return `
  <div class="item">
    <img class="ui avatar image" src="/img/${player.avatarId}.svg">
    <div class="content">
      <div class="header">${player.name}</div>
      <div class="description">${player.joined}</div>
    </div>
  </div>
  `;
}

const playerList = document.getElementById("player-list");
const gameId = window.location.pathname.split("/").reverse()[0];

setInterval(async () => {
  try {
    const response = await fetch(`/api/games/${gameId}/players`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `${response.url} ${response.status} - ${response.statusText}`
      );
    }

    const players = await response.json();

    const html = players.map(renderPlayerListItem).join("\n");

    if (html !== playerList.innerHTML) {
      playerList.innerHTML = html;
    }
  } catch (error) {
    console.error(error);
  }
}, 1000);
