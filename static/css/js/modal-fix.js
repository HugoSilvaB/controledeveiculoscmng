// modal-fix.js
// Abre modais manualmente, move modal para <body>, evita instâncias duplicadas
// e aguarda a imagem do modal carregar antes de mostrar (evita "pula" de tamanho).

document.addEventListener('click', function (e) {
  const img = e.target.closest('.img-miniatura[data-modal]');
  if (!img) return;
  e.preventDefault();

  const selector = img.getAttribute('data-modal');
  if (!selector) return;
  const modalEl = document.querySelector(selector);
  if (!modalEl) return;

  console.log('[modal-fix] click detected on', selector, 'at', new Date().toISOString());

  // Move modal para body (evita problemas de posicionamento quando há transforms)
  if (modalEl.parentElement !== document.body) {
    document.body.appendChild(modalEl);
    console.log('[modal-fix] moved modal to body:', selector);
  }

  // Fecha modais já abertos para evitar sobreposição/efeitos indesejados
  document.querySelectorAll('.modal.show').forEach(function (m) {
    try {
      const inst = bootstrap.Modal.getInstance(m);
      if (inst) {
        inst.hide();
        console.log('[modal-fix] hid existing modal instance');
      }
    } catch (err) { /* ignore */ }
  });

  // Debounce simples para evitar cliques muito rápidos
  if (window.modalFixLock) {
    console.log('[modal-fix] click ignored (lock)');
    return;
  }
  window.modalFixLock = true;
  setTimeout(function () { window.modalFixLock = false; }, 500);

  const imgInModal = modalEl.querySelector('img');

  const showModalNow = () => {
    try {
      const modalInstance = new bootstrap.Modal(modalEl, {});
      modalInstance.show();
      console.log('[modal-fix] modal shown:', selector);
    } catch (err) {
      console.error('[modal-fix] erro ao mostrar modal:', err);
    }
  };

  if (imgInModal) {
    // Se imagem já carregada, mostra imediatamente
    if (imgInModal.complete && imgInModal.naturalWidth && imgInModal.naturalWidth > 0) {
      showModalNow();
      return;
    }

    // Caso contrário, aguarda o evento load/error antes de mostrar
    const onLoad = () => {
      imgInModal.removeEventListener('load', onLoad);
      imgInModal.removeEventListener('error', onError);
      showModalNow();
    };
    const onError = () => {
      imgInModal.removeEventListener('load', onLoad);
      imgInModal.removeEventListener('error', onError);
      console.warn('[modal-fix] imagem do modal falhou ao carregar, mostrando o modal mesmo assim:', selector);
      showModalNow();
    };

    // Usa { once: true } para garantir que o listener seja removido automaticamente
    imgInModal.addEventListener('load', onLoad, { once: true });
    imgInModal.addEventListener('error', onError, { once: true });

    // Em alguns casos a propriedade complete muda após breve tempo; re-check rápido
    setTimeout(() => {
      if (imgInModal.complete && imgInModal.naturalWidth && imgInModal.naturalWidth > 0) {
        // remove listeners e mostra
        try { imgInModal.removeEventListener('load', onLoad); } catch (_) {}
        try { imgInModal.removeEventListener('error', onError); } catch (_) {}
        showModalNow();
      }
    }, 150);
  } else {
    // Sem imagem dentro do modal, mostra normalmente
    showModalNow();
  }
});