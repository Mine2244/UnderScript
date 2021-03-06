[
  {
    name: 'Disable rainbow chat',
    key: 'chatRainbowDisabled',
    category: 'Chat',
  },
  {
    name: 'Disable chat sounds',
    key: 'chatSoundsDisabled',
    category: 'Chat',
  },
  {
    name: 'Disable chat avatars',
    key: 'chatAvatarsDisabled',
    category: 'Chat',
  },
  {
    name: 'Disable shiny card animation',
    key: 'gameShinyDisabled',
    category: 'Game',
  },
  {
    name: 'Disable game music',
    key: 'gameMusicDisabled',
    category: 'Game',
  },
  {
    name: 'Disable game sounds',
    key: 'gameSoundsDisabled',
    category: 'Game',
  },
  {
    name: 'Disable profile skins',
    key: 'profileSkinsDisabled',
    category: 'Game',
  },
].forEach((setting) => {
  const {name, key, category} = setting;
  const refresh = category === 'Game' ? () => onPage('Game') || onPage('gameSpectating') : undefined;
  settings.register({
    name, key, category, refresh,
    page: 'game',
    remove: true,
  });
});

settings.setDisplayName('Undercards', 'game');
