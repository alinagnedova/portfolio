(() => {
  const email = 'alinagnedova809@mail.ru';
  const dialog = document.createElement('dialog');
  dialog.className = 'email-dialog';
  dialog.setAttribute('aria-labelledby', 'email-title');
  dialog.innerHTML = `<button type="button" class="email-close" aria-label="Закрыть окно">×</button>
    <div class="email-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/></svg></div>
    <h2 id="email-title">Напишите мне</h2>
    <p>Обсудим вашу идею или проект</p>
    <label class="email-input-label" for="email-address">Моя почта</label>
    <input id="email-address" class="email-address" readonly value="${email}" spellcheck="false">
    <button class="email-copy" type="button">Скопировать почту</button>
    <p class="email-feedback" role="status" aria-live="polite"></p>
    <a class="email-open" href="mailto:${email}">Открыть почтовое приложение ↗</a>`;
  document.body.append(dialog);
  const address = dialog.querySelector('input');
  const copy = dialog.querySelector('.email-copy');
  const feedback = dialog.querySelector('.email-feedback');
  let previousFocus;
  function openDialog(event) {
    event.preventDefault();
    if (dialog.open) return;
    previousFocus = document.activeElement;
    feedback.textContent = '';
    copy.textContent = 'Скопировать почту';
    document.body.classList.add('email-modal-open');
    dialog.showModal();
    copy.focus();
  }
  document.querySelectorAll('a[href="mailto:' + email + '"]').forEach(link => {
    if (dialog.contains(link)) return;
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', openDialog);
  });
  dialog.querySelector('.email-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('email-modal-open');
    previousFocus?.focus();
  });
  address.addEventListener('click', () => address.select());
  copy.addEventListener('click', async () => {
    let copied = false;
    try {
      await navigator.clipboard.writeText(email);
      copied = true;
    } catch {
      address.focus();
      address.select();
      try { copied = document.execCommand('copy'); } catch {}
    }
    if (copied) {
      copy.textContent = 'Скопировано ✓';
      feedback.textContent = 'Адрес почты скопирован';
    } else {
      feedback.textContent = 'Выделите адрес и скопируйте его вручную';
      address.focus();
      address.select();
    }
  });
  const clock = document.querySelector('[data-live-clock]');
  if (clock) {
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      timeZone: 'Europe/Moscow', day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    const update = () => {
      const now = new Date();
      clock.textContent = formatter.format(now).replace(' г.', '');
      clock.dateTime = now.toISOString();
    };
    update();
    setInterval(update, 1000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
  }
})();
