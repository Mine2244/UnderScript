[
  // underscript.disable.sound.bgm
  // underscript.disable.sound.gameStart
  // underscript.disable.sound.spectate.all
  // underscript.disable.sound.legendary
  // underscript.disable.sound.determination
  // underscript.disable.sound.spells
  // underscript.disable.sound.handFull
  // underscript.disable.sound.destroy
  // underscript.disable.sound.damage
  // underscript.disable.sound.heal
  // underscript.disable.sound.destroy.enemy
  // underscript.disable.sound.victory
  // underscript.disable.sound.spectate
  // underscript.enable.bgm.spectate (TODO)
  // underscript.enable.yourTurn (TODO)
  {
    name: '',
    key: '',
  }
].forEach((setting) => {
  // TODO: register settings
});

eventManager.on('GameStart', function soundManager() {
  const canDisableMusic = typeof musicEnabled === 'boolean';
  let disabledMusic = false;
  let disabledSound = false;

  // TODO: Play/Pause Mute/Unmute buttons

  function isMusicDisabled() {
    return !settings.value('gameMusicDisabled');
  }
  function disableMusic() {
    if (!canDisableMusic || !musicEnabled) return;
    debug('Disabled music', 'debugging.music');
    musicEnabled = false;
    disabledMusic = true;
  }
  function disableSound() {
    if (!soundEnabled) return;
    debug('Disabled sound', 'debugging.sound');
    soundEnabled = false;
    disabledSound = true;
  }
  function restoreAudio() {
    if (disabledMusic) {
      musicEnabled = true;
    }
    if (disabledSound) {
      soundEnabled = true;
    }
  }
  function stopAudio(audio) {
    if (!(audio instanceof Audio)) return;
    if (audio.readyState) return audio.pause();
    // the "proper" way to stop audio (before it starts)
    audio.addEventListener('playing', function () {
      audio.pause();
    });
  }
  function playMusic(src, opts = { volume: 0.2 }) {
    if (!opts.force && canDisableMusic ? !musicEnabled : isMusicDisabled()) return;
    music = new Audio(src);
    music.volume = opts.volume || 0.2;
    if (opts.repeat) {
      music.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
      }, false);
    }
    music.play();
  }

  eventManager.on('GameEvent', restoreAudio);
  eventManager.on('PlayingGame', function () {
    // Override toggleMusic?
  });
  eventManager.on('getGameStarted:before getReconnection:before', function disableBGM(data) {
    if (settings.value('underscript.disable.sound.bgm')) {
      disableMusic();
    }
  });
  eventManager.on('getGameStarted:before', function disableGameStart(data) {
    if (settings.value('underscript.disable.sound.gameStart')) {
      disableSound();
    }
  });
  eventManager.on('getAllGameInfos', function spectateBGM(data) {
    if (settings.value('underscript.disable.sound.spectate.all')) {
      // Disable all sounds for spectator games, and don't restore it
      soundEnabled = false;
    }
  });
  eventManager.on('getCardBoard:before', function disableLegendary(data) {
    const card = JSON.parse(data.card);
    const disableLegendary = card.rarity === 'LEGENDARY' && settings.value('underscript.disable.sound.legendary');
    const disableDT = card.rarity === 'DETERMINATION' && settings.value('underscript.disable.sound.determination');
    if (disableLegendary || disableDT) {
      disableSound();
    }
  });
  eventManager.on('getSpellPlayed:before', function disableSpells(data) {
    if (settings.value('underscript.disable.sound.spells')) {
      disableSound();
    }
  });
  eventManager.on('getCardDestroyedHandFull:before', function disableHandFull(data) {
    if (settings.value('underscript.disable.sound.handFull')) {
      setTimeout(disableSound, 1000);
    }
  });
  eventManager.on('getCardDestroyedHandFull', function restoreHandFull(data) {
    if (settings.value('underscript.disable.sound.handFull')) {
      setTimeout(restoreAudio, 1000);
    }
  });
  eventManager.on('getMonsterDestroyed:before getFakeDeath:before', function disableDestroy(data) {
    if (settings.value('underscript.disable.sound.destroy')) {
      disableSound();
    }
  });
  eventManager.on('getFakeDeath:before', function disableDestroyTimeout() {
    if (settings.value('underscript.disable.sound.destroy')) {
      setTimeout(disableSound, 1000);
    }
  });
  eventManager.on('getFakeDeath', function restoreDestroy() {
    if (settings.value('underscript.disable.sound.destroy')) {
      setTimeout(restoreAudio, 1000);
    }
  });
  eventManager.on('getUpdatePlayerHp:before', function disablePlayerHealth(data) {
    if (data.isDamage ? settings.value('underscript.disable.sound.damage') : settings.value('underscript.disable.sound.heal')) {
      disableSound();
    }
  });
  eventManager.on('getVictory:before', function preGame(data) {
    if (settings.value('underscript.disable.sound.destroy.enemy')) {
      setTimeout(disableSound, 750); // untested
      setTimeout(restoreAudio, 751); // untested
    }
    if (data.oldDivision === data.newDivision) {
      if (settings.value('underscript.disable.sound.rankup')) {
        setTimeout(disableMusic, 2750); // untested
      }
    }
  });
  eventManager.on('getDefeat:before', function preGame(data) {
    if (data.endType === 'Chara') { // Still technically in the game, even if the card doesn't support it
      // 'audio' 'hit'
      // timeout 750: music 'toomuch'
    } else {
      // timeout 750: 'audio' 'soulDeath'
    }
    // timeout 750 + 2200: music 'gameover' || 'toomuch'
    if (data.nbLevelPassed) {
      // interval, 5
      // 'audio' plays 'levelUp'
    }
    if (data.oldDivision !== data.newDivision && data.newDivision === 'LEGEND') {
      // timeout 750 + 2200: music 'dogsong'
    }
  });
  eventManager.on('getResult:before', function restoreSpectateMusic() {
    // getResult hasn't been canceled, music is disabled, we disable spectateMusic
    if (!this.canceled || isMusicDisabled() || settings.value('underscript.disable.sound.spectate')) return;
    // Play the music, because it got canceled >.>
    playMusic('musics/victory.ogg');
  });
  eventManager.on('getResult', function stopSpectateMusic() {
    // music is undefined, music is not disabled and we do not disable spectate music
    if (typeof music === 'undefined' || !isMusicDisabled() && !settings.value('underscript.disable.sound.spectate')) return;
    // if music != undefined && (isMusicDisabled || DisableFinish)
    stopAudio(music);
  });
});
