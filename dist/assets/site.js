(() => {
  'use strict';
  const products = window.SamhoProducts || [];
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const byId = id => products.find(p => p.id === id);
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
  if (location.pathname === '/') {
    const oldRoutes = { '#contact':'/contact/', '#finder':'/products/#finder', '#support':'/contact/#support' };
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
      $('#compare-count').textContent = `규격 비교 ${selected.size} / 3`;
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
      $('#result-count').textContent = `${count}개 제품`;
      $('#empty-results').hidden = count > 0;
    }
    $$('[data-filter]').forEach(b => b.addEventListener('click', () => {
      group = b.dataset.filter;
      const next = new URL(location.href);
      if (group === 'all') next.searchParams.delete('group'); else next.searchParams.set('group',group);
      history.replaceState(null,'',next.pathname+next.search+next.hash);
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
        announce('최대 3개 제품을 비교할 수 있습니다. 선택한 제품을 먼저 해제해 주세요.');
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
      scroll.setAttribute('role','region'); scroll.setAttribute('aria-label','제품 비교표, 작은 화면에서는 가로로 스크롤하세요');
      const table = el('table'), head = el('thead'), body = el('tbody'), header = el('tr');
      ['비교 항목', ...chosen.map(p=>p.title)].forEach(t => { const th=el('th',t); th.scope='col'; header.append(th); });
      head.append(header);
      [['적용 구분','application'],['생산 외경 (O.D.)','size'],['연간 생산능력','capacity']].forEach(([title,key]) => {
        const row=el('tr'), th=el('th',title); th.scope='row'; row.append(th);
        chosen.forEach(p=>row.append(el('td',p[key]))); body.append(row);
      });
      const row=el('tr'), th=el('th','제작 상담'); th.scope='row'; row.append(th);
      chosen.forEach(p=>{const td=el('td'),a=el('a','이 제품 문의 ↗');a.href='/contact/?product='+encodeURIComponent(p.id);a.className='text-link';td.append(a);row.append(td);});
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
    form.addEventListener('invalid', e => { const details=e.target.closest('details'); if(details) details.open=true; }, true);
    form.addEventListener('input', invalidate);
    form.addEventListener('change', invalidate);
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const fields=Object.fromEntries(new FormData(form));
      for (const key of ['company','reply','message']) {
        if (!String(fields[key]).trim()) {
          $('#form-error').textContent='필수 항목에 내용을 입력해 주세요.';
          form.elements[key].focus();return;
        }
      }
      const product=byId(fields.product);
      const types={product:'제품·규격 문의',new:'신규 제작 검토',production:'양산·공급 상담'};
      const lines=['삼호엔지니어링 | 제작 상담 요청서','작성일: '+new Date().toLocaleDateString('ko-KR'),'','[문의 제품]',product?.title||fields.customProduct.trim()||'제품 미정'];
      if (product && fields.customProduct.trim()) lines.push('추가 품번·제품명: '+fields.customProduct.trim());
      lines.push('','[상담 정보]','회사·담당자: '+fields.company.trim(),'회신 연락처: '+fields.reply.trim(),'문의 유형: '+types[fields.type],'','[문의 내용]',fields.message.trim());
      const extra=[['spec','외경·요구 사양'],['drawing','도면 번호·개정 정보'],['quantity','필요 수량 (개)'],['annual','연간 예상 물량 (개)'],['due','희망 납기']].filter(([key])=>String(fields[key]||'').trim());
      if (extra.length) lines.push('','[추가 사양]',...extra.map(([key,label])=>label+': '+fields[key].trim()));
      lines.push('','※ 상담 준비용 요청서입니다. 회사로 전송되거나 접수가 완료된 상태가 아닙니다.','※ 제작 가능 여부와 상세 사양, 공급 물량 및 납기는 별도 협의가 필요합니다.');
      text.value=lines.join('\n');output.hidden=false;
      $('#output-heading').focus({preventScroll:true});output.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
    });
    $('#copy-inquiry').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(text.value);
        $('#output-status').textContent='요청서 내용을 복사했습니다. 아직 전송되지 않았습니다.';
      } catch {
        text.focus();text.select();
        $('#output-status').textContent='자동 복사가 제한되어 있습니다. 선택된 내용을 직접 복사하거나 TXT 파일로 저장해 주세요.';
      }
    });
    $('#save-inquiry').addEventListener('click', () => {
      if (!text.value) return;
      const url=URL.createObjectURL(new Blob(['\uFEFF'+text.value],{type:'text/plain;charset=utf-8'}));
      const a=document.createElement('a');a.href=url;a.download='삼호엔지니어링_제작상담요청서.txt';document.body.append(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      $('#output-status').textContent='요청서 파일 저장을 시작했습니다. 아직 전송되지 않았습니다.';
    });
  }
})();
