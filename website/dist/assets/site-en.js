(() => {
  'use strict';
  const products = window.SamhoProducts || [];
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const byId = id => products.find(p => p.id === id);
  function syncLanguageLinks() {
    $$('[data-language-href]').forEach(link => {
      link.href = link.dataset.languageHref + location.search + location.hash;
    });
  }
  syncLanguageLinks();
  addEventListener('hashchange', syncLanguageLinks);
  addEventListener('popstate', syncLanguageLinks);
  $$('[data-language-href]').forEach(link => link.addEventListener('click', syncLanguageLinks));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let statusTimer;
  function announce(message) {
    const el = $('#status');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => el.classList.remove('show'), 4500);
  }
  const origins = new WeakMap();
  function openDialog(dialog) {
    origins.set(dialog, document.activeElement);
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
  $$('dialog').forEach(dialog => {
    dialog.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      $('.menu-toggle')?.setAttribute('aria-expanded', 'false');
      origins.get(dialog)?.focus({preventScroll:true});
    });
    dialog.addEventListener('click', e => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    });
  });
  $('.menu-toggle')?.addEventListener('click', () => {
    openDialog($('#mobile-menu'));
    $('.menu-toggle').setAttribute('aria-expanded','true');
  });

  // Keep old bookmarked entry points useful after separating the pages.
  if (location.pathname === "/en/") {
    const oldRoutes = { '#contact':"/en/contact/", '#finder':"/en/products/", '#support':"/en/contact/#support" };
    if (oldRoutes[location.hash]) location.replace(oldRoutes[location.hash]);
  }

  if ($('#catalog-list')) {
    const params = new URLSearchParams(location.search);
    let group = ['cage','shield','raceway'].includes(params.get('group')) ? params.get('group') : 'all';
    const selected = new Set();
    try {
      const saved = JSON.parse(sessionStorage.getItem('samho-compare') || '[]');
      if (Array.isArray(saved)) saved.filter(id=>byId(id)).slice(0,3).forEach(id=>selected.add(id));
    } catch { /* Browsing works with unavailable or malformed storage. */ }
    function refreshSelection() {
      $$('[data-compare]').forEach(input => input.checked = selected.has(input.dataset.compare));
      $('#compare-count').textContent = `Compare specs ${selected.size} / 3`;
      $('#compare-open').disabled = selected.size < 2;
      $('#compare-reset').disabled = selected.size === 0;
      try { sessionStorage.setItem('samho-compare', JSON.stringify([...selected])); } catch {}
    }
    function filter() {
      const query = $('#product-search').value.trim().toLocaleLowerCase();
      let count = 0;
      $$('.product-row').forEach(row => {
        const p = byId(row.dataset.product);
        const match = (group === 'all' || p.group === group) && [p.title,p.english,p.application,p.short,p.keyword].join(' ').toLocaleLowerCase().includes(query);
        row.hidden = !match;
        if (match) count++;
      });
      $$('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === group)));
      $('#result-count').textContent = `${count} ${count === 1 ? 'product' : 'products'}`;
      $('#empty-results').hidden = count > 0;
    }
    $$('[data-filter]').forEach(b => b.addEventListener('click', () => {
      group = b.dataset.filter;
      const next = new URL(location.href);
      if (group === 'all') next.searchParams.delete('group'); else next.searchParams.set('group',group);
      history.replaceState(null,'',next.pathname+next.search+next.hash);
      syncLanguageLinks();
      filter();
    }));
    $('#product-search').addEventListener('input', filter);
    $('#reset-search').addEventListener('click', () => {
      $('#product-search').value = '';
      $('[data-filter="all"]').click();
      $('#product-search').focus();
    });
    $$('[data-compare]').forEach(input => input.addEventListener('change', () => {
      if (input.checked && selected.size >= 3) {
        input.checked = false;
        announce("Compare up to 3 products. Clear one of your selections first.");
        return;
      }
      if (input.checked) selected.add(input.dataset.compare); else selected.delete(input.dataset.compare);
      refreshSelection();
    }));
    $('#compare-reset').addEventListener('click', () => { selected.clear(); refreshSelection(); });
    const el = (tag,text) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; return node; };
    $('#compare-open').addEventListener('click', () => {
      const chosen = [...selected].map(byId).filter(Boolean);
      if (chosen.length < 2) return;
      const scroll = el('div'); scroll.className = 'table-scroll'; scroll.tabIndex = 0;
      scroll.setAttribute('role','region'); scroll.setAttribute('aria-label',"Product comparison table. Scroll horizontally on smaller screens.");
      const table = el('table'), head = el('thead'), body = el('tbody'), header = el('tr');
      ["Specification", ...chosen.map(p=>p.title)].forEach(t => { const th=el('th',t); th.scope='col'; header.append(th); });
      head.append(header);
      [["Application",'application'],["Production O.D.",'size']].forEach(([title,key]) => {
        const row=el('tr'), th=el('th',title); th.scope='row'; row.append(th);
        chosen.forEach(p=>row.append(el('td',p[key]))); body.append(row);
      });
      const row=el('tr'), th=el('th',"Manufacturing inquiries"); th.scope='row'; row.append(th);
      chosen.forEach(p=>{const td=el('td'),a=el('a',"Inquire about this product ↗");a.href="/en/contact/?product="+encodeURIComponent(p.id);a.className='text-link';td.append(a);row.append(td);});
      body.append(row);table.append(head,body);scroll.append(table);
      $('#compare-content').replaceChildren(scroll);openDialog($('#compare-dialog'));
    });
    filter();refreshSelection();
  }

  const form = $('#inquiry-form');
  if (form) {
    $('#generate-inquiry').disabled = false;
    const params = new URLSearchParams(location.search);
    const selected = byId(params.get('product'));
    if (selected) $('#product').value = selected.id;
    if (['product','new','production'].includes(params.get('type'))) $('#inquiry-type').value = params.get('type');
    const output = $('#inquiry-output'), text = $('#inquiry-text');
    const invalidate = () => { output.hidden = true; text.value=''; $('#form-error').textContent=''; $('#output-status').textContent=''; };
    const fileInput = $('#drawing-files'), fileList = $('#drawing-file-list');
    const dropzone = $('#drawing-dropzone'), drawingLink = $('#drawing-link');
    const attachmentStatus = $('#attachment-status');
    let drawingFiles = [];
    const fileSize = size => size < 1024 * 1024 ? `${Math.ceil(size / 1024)} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`;
    function renderFiles() {
      fileList.replaceChildren();
      fileList.hidden = drawingFiles.length === 0;
      drawingFiles.forEach((file, index) => {
        const row = document.createElement('li'), label = document.createElement('span');
        label.className = 'file-label'; label.textContent = file.name;
        const size = document.createElement('span'); size.className = 'file-size'; size.textContent = fileSize(file.size); label.append(size);
        const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = "Remove";
        remove.setAttribute('aria-label', `Remove ${file.name}`);
        remove.addEventListener('click', () => {
          drawingFiles.splice(index, 1); renderFiles(); invalidate();
          attachmentStatus.dataset.error = 'false';
          attachmentStatus.textContent = `File removed. ${drawingFiles.length} ${drawingFiles.length === 1 ? 'file' : 'files'} selected.`;
          fileInput.focus();
        });
        row.append(label, remove); fileList.append(row);
      });
    }
    function addFiles(files) {
      const errors = [];
      for (const file of files) {
        if (drawingFiles.some(f => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified)) continue;
        if (file.size > 20 * 1024 * 1024) { errors.push(`${file.name}: Choose a file no larger than 20 MB.`); continue; }
        if (drawingFiles.length >= 5) { errors.push("Select up to 5 files."); break; }
        drawingFiles.push(file);
      }
      fileInput.value = ''; renderFiles(); invalidate();
      attachmentStatus.dataset.error = String(errors.length > 0);
      attachmentStatus.textContent = errors.length ? errors.join(' ') : `${drawingFiles.length} ${drawingFiles.length === 1 ? 'file' : 'files'} selected. Not submitted yet.`;
    }
    fileInput.addEventListener('change', () => addFiles(fileInput.files));
    dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('is-dragging'); });
    dropzone.addEventListener('dragleave', e => { if (!dropzone.contains(e.relatedTarget)) dropzone.classList.remove('is-dragging'); });
    dropzone.addEventListener('drop', e => { e.preventDefault(); dropzone.classList.remove('is-dragging'); addFiles(e.dataTransfer.files); });
    drawingLink.addEventListener('input', () => {
      const value = drawingLink.value.trim();
      let valid = !value;
      try { const url = new URL(value); valid = ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password; } catch {}
      drawingLink.setCustomValidity(valid ? '' : "Enter a drawing share link starting with http:// or https://.");
    });
    form.addEventListener('invalid', e => { const details=e.target.closest('details'); if(details) details.open=true; }, true);
    form.addEventListener('input', invalidate);
    form.addEventListener('change', invalidate);
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const fields=Object.fromEntries(new FormData(form));
      for (const key of ['company','reply','message']) {
        if (!String(fields[key]).trim()) {
          $('#form-error').textContent="Complete all required fields.";
          form.elements[key].focus();return;
        }
      }
      const product=byId(fields.product);
      const types={product:"Product & specification inquiry",new:"New component development",production:"Series production & supply"};
      const lines=["Samho Engineering | Manufacturing Inquiry","Prepared on: "+new Date().toLocaleDateString("en-GB"),'',"[Product]",product?.title||fields.customProduct.trim()||"Product not yet specified"];
      if (product && fields.customProduct.trim()) lines.push("Additional part number / product: "+fields.customProduct.trim());
      lines.push('',"[Contact information]","Company / contact person: "+fields.company.trim(),"Reply contact: "+fields.reply.trim(),"Inquiry type: "+types[fields.type],'',"[Inquiry details]",fields.message.trim());
      const extra=[['spec',"Outside diameter & specifications"],['drawing',"Drawing number & revision"],['quantity',"Required quantity (pcs)"],['annual',"Estimated annual quantity (pcs)"],['due',"Preferred delivery date"]].filter(([key])=>String(fields[key]||'').trim());
      if (extra.length) lines.push('',"[Additional specifications]",...extra.map(([key,label])=>label+': '+fields[key].trim()));
      if (drawingFiles.length || fields.drawingLink.trim()) {
        lines.push('', "[Drawing information]");
        if (fields.drawingLink.trim()) lines.push("Drawing share link: " + fields.drawingLink.trim());
        if (drawingFiles.length) {
          lines.push("Files to attach separately:", ...drawingFiles.map(file => `- ${file.name.replace(/[\\r\\n]/g, ' ')} (${fileSize(file.size)})`));
          lines.push("Note: This inquiry records filenames only. Attach the original files separately to your email.");
        }
      }
      lines.push('',"Note: This document prepares your consultation. It has not been sent to the company or submitted.","Note: Manufacturing feasibility, detailed specifications, supply quantities and delivery schedules require further discussion.");
      text.value=lines.join("\\n");output.hidden=false;
      $('#output-heading').focus({preventScroll:true});output.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
    });
    $('#copy-inquiry').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(text.value);
        $('#output-status').textContent="Inquiry copied. Not submitted yet.";
      } catch {
        text.focus();text.select();
        $('#output-status').textContent="Automatic copying is unavailable. Copy the selected text manually or save it as a TXT file.";
      }
    });
    $('#save-inquiry').addEventListener('click', () => {
      if (!text.value) return;
      const url=URL.createObjectURL(new Blob(['\uFEFF'+text.value],{type:'text/plain;charset=utf-8'}));
      const a=document.createElement('a');a.href=url;a.download="Samho_Manufacturing_Inquiry.txt";document.body.append(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      $('#output-status').textContent="Inquiry download started. Not submitted yet.";
    });
  }

  // Touch cards navigate directly; only pointer hover or keyboard focus previews photos.
  const productionPreview = $('[data-production-preview]');
  if (productionPreview) {
    let hoveredPlant = '', focusedPlant = '';
    const updatePlantPreview = () => {
      const key = hoveredPlant || focusedPlant;
      if (key) productionPreview.dataset.plantPreview = key;
      else delete productionPreview.dataset.plantPreview;
    };
    productionPreview.querySelectorAll('.plant-preview-link').forEach(card => {
      card.addEventListener('pointerenter', event => {
        if (event.pointerType === 'touch') return;
        hoveredPlant = card.dataset.plant; updatePlantPreview();
      });
      card.addEventListener('pointerleave', () => { hoveredPlant = ''; updatePlantPreview(); });
      card.addEventListener('focus', () => {
        focusedPlant = card.matches(':focus-visible') ? card.dataset.plant : '';
        updatePlantPreview();
      });
      card.addEventListener('blur', () => { focusedPlant = ''; updatePlantPreview(); });
      card.addEventListener('click', () => {
        hoveredPlant = ''; focusedPlant = ''; updatePlantPreview();
      });
    });
  }
})();
