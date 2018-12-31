const menu = (() => {
  let initialized, menuOpen, wrapper, body, cooked, toast;
  const buttons = [];

  function init() {
    if (initialized || initialized === false) return initialized;
    // jQuery must be initialized by now
    if (typeof jQuery === 'undefined') return initialized = false;
    style.add(
      '.menu-backdrop { display: none; position: fixed; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: #000; background-color: rgba(0,0,0,0.4); z-index: 1010; }',
      '.menu-backdrop { display: none; position: fixed; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: #000; background-color: rgba(0,0,0,0.4); z-index: 1010; }',
      '.menu-close { float: right; color: #aaa; font-size: 28px; font-weight: bold; margin: -5px; }',
      '.menu-close:hover, .menu-close:focus { color: #FFF; text-decoration: none; cursor: pointer; }',
      '.menu-content { color: #fff; margin: 4% auto; padding: 0; border: 2px solid #888; width: 280px; background: #000 url(../images/backgrounds/2.png) center 632px; }',
      '.menu-content > * { padding: 2px 16px; }',
      '.menu-content a { color: #fff; }',
      '.menu-header { text-align: center; font-size: 30px; }',
      '.menu-footer img { height: 16px; vertical-align: middle; }',
      '.menu-body { background-color: rgba(0,0,0,0.6); min-height: 250px; }',
      '.menu-body ul { list-style: none; padding: 0; }',
      '.menu-body li { list-style-type: none; border: 1px solid #fff; width: 80%; text-align: center; margin: 5px auto; opacity: 1; }',
      '.menu-body li:hover, .menu-body li:focus { text-decoration: underline; opacity: 0.4; }',
    );
    body = $('<div class="menu-body">');
    wrapper = $('<div class="menu-backdrop" tabindex="-1">')
      .append($('<div class="menu-content">')
      .attr({
        role: 'Menu',
      })
      .append(
        `<div class="menu-header"><span class="menu-close right">&times;</span>MENU</div>`,
        body,
        `<div class="menu-footer"><a href="https://git.io/fxysg" target="_blank">UnderScript</a> v${GM_info.script.version} <a href="https://discord.gg/D8DFvrU" target="_blank"><img id="usdiscord" src="images/social/discord.png" alt="discord"></a></div>`
      )).on('click', (e) => {
        if (e.target === wrapper[0]) {
          close();
        }
      });
    $('body').append(wrapper);
    $('span.menu-close').on('click', close);
    return initialized = true;
  }
  function open() {
    if (menuOpen || !init()) return;
    // Generate buttons
    if (!cooked) {
      body.html(''); // Clear current buttons
      buttons.forEach((data) => {
        const button = $('<li>');
        button.attr({
          role: 'button',
          tabindex: 0,
        });
        if (data.url) {
          // Make text a url
        } else {
          button.text(data.text);
        }
        if (typeof data.action === 'function') {
          function callable(e)  {
            if (typeof data.enabled !== 'function' || data.enabled()) {
              const result = data.action(e);
              if (result !== undefined ? result : data.close) {
                close();
              }
            } else {
              button.blur();
            }
          }
          button.on('click', callable)
            .on('keydown', (e) => {
              if (e.which !== 32 && e.which !== 13) return;
              e.preventDefault();
              callable(e);
            }).css({
              cursor: 'pointer', 
            });
        }
        if (data.note) {
          if (typeof data.note === 'function') {
            button.on('mouseenter focus', (e) => {
              const note = data.note();
              if (note) {
                hover.show(note)(e);
              }
            }).on('mouseleave blur', hover.hide);
          } else if (typeof data.note === 'string') {
            button.on('mouseenter focus', hover.show(data.note))
              .on('mouseleave blur', hover.hide);
          }
        }
        body.append(button);
      });
      cooked = true;
    }
    wrapper.css({ display: 'block' }).focus();
    menuOpen = true;
    if (toast) {
      toast.close('opened');
    }
  }
  function close() {
    if (!menuOpen) return;
    wrapper.css({ display: '' });
    menuOpen = false;
  }
  function isOpen() {
    return menuOpen;
  }
  function addButton(button = {}) {
    if (!button || !button.text) return fn.debug('Menu: Missing button information');
    cooked = false;
    const { text, action, url, note, enabled } = button;
    const close = button.keep !== true;
    const safeButton = {
      text, action, url, close, note, enabled
    };
    if (button.top) {
      buttons.splice(0, 0, safeButton);
    } else {
      buttons.push(safeButton);
    }
  }

  eventManager.on('UnderScript:loaded', () => {
    toast = fn.infoToast({
      text: 'UnderScript has a menu, press ESC to open it!',
      onClose: (reason) => {
        toast = null;
        return reason !== 'opened';
      },
    }, 'underscript.notice.menu', '1');
  });

  return {
    open, close, isOpen, addButton,
  };
})();
