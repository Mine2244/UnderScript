settings.register({
  name: 'Enable online friends',
  key: 'underscript.enable.onlinefriends',
  default: true,
});
eventManager.on(':loaded', () => {
  style.add(
    '.tippy-tooltip.undercards-theme { background-color: rgba(0,0,0,0.9); font-size: 13px; border: 1px solid #fff; }',
    `.tippy-popper[x-placement^='top'] .tippy-tooltip.undercards-theme .tippy-arrow { border-top-color: #fff; bottom: -9px; }`,
    `.tippy-popper[x-placement^='bottom'] .tippy-tooltip.undercards-theme .tippy-arrow { border-bottom-color: #fff; top: -9px; }`,
    `.tippy-popper[x-placement^='left'] .tippy-tooltip.undercards-theme .tippy-arrow { border-left-color: #fff; right: -9px; }`,
    `.tippy-popper[x-placement^='right'] .tippy-tooltip.undercards-theme .tippy-arrow { border-right-color: #fff; left: -9px; }`,
  );

  const el = document.querySelector('a span.nbFriends');
  if (el) {
    const target = el.parentElement;
    tippy(target, {
      content: `<div class="onlineFriends">(Loading)</div>${footer2}`,
      placement: 'top-start',
      arrow: true,
      theme: 'undercards',
      hideOnClick: false,
      a11y: false,
      performance: true,
      interactive: !!localStorage.getItem('debugging.showFriends'),
      showOnInit: !!localStorage.getItem('debugging.showFriends'),
      //lazy: false, // Instant placement
      distance: 0,
      onShow: () => settings.value('underscript.enable.onlinefriends'),
    });

    function updateTip() {
      target._tippy.popper.querySelector('.onlineFriends').innerHTML = selfFriends.filter(({online}) => online).map(({username}) => username).join('<br>') || 'None';
    }
    eventManager.on('Chat:getSelfInfos', updateTip);
    this.updateTip = updateTip;
  }
});
