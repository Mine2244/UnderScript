settings.register({
  name: 'Disable skin toasts',
  key: 'underscript.disable.skintoast',
  refresh: () => onPage(''),
  category: 'Home',
});

onPage('', function skins() {
  eventManager.on(':loaded', () => {
    if (settings.value('underscript.disable.skintoast')) return;
    $el.text.contains(document.querySelectorAll('p'), 'New skins').forEach((el) => {
      const title = el.textContent.trim();
      const images = [];
      const imageNames = [];
      el.querySelectorAll('img').forEach(({outerHTML, src}) => {
        images.push(outerHTML);
        imageNames.push(src.substring(src.lastIndexOf('/')+1, src.length - 4));
      });
      const key = `underscript.skins.dismiss.${imageNames.join(',')}`;
      el.remove();
      if (settings.value(key)) return;
      fn.dismissable({
        title, key,
        text: images.join('<br>'),
      });
    });
  });
});
