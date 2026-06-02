(function () {
  'use strict';

  const { tabs } = EDUCATION_DATA;
  const defaultHiddenTabIds = ['python', 'dashboard', 'schedule', 'project'];
  const hiddenTabIds = getHiddenTabIds();
  let visibleTabs = getVisibleTabs();

  const tabNavInner = document.getElementById('tabNavInner');
  const mainContent = document.getElementById('mainContent');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  let activeTab = visibleTabs[0]?.id;

  const BRAND_ICON = {
    python: 'assets/icons/python.svg',
    vscode: 'assets/icons/vscode.svg',
    chatgpt: 'assets/icons/chatgpt.svg',
    gemini: 'assets/icons/gemini.png',
    claude: 'assets/icons/claude.png',
    codex: 'assets/icons/codex.svg',
    cursor: 'assets/icons/cursor.svg',
    antigravity: 'assets/icons/antigravity.svg',
    genspark: 'assets/icons/genspark.png'
  };

  function init() {
    renderTabs();
    renderPanels();
    bindHashNavigation();
    activateTabFromHash();
    showEmbeddedBrowserHint();
  }

  function isEmbeddedPreview() {
    return window.self !== window.top || /Electron/i.test(navigator.userAgent);
  }

  function externalLinkAttrs() {
    return ' target="_blank" rel="noopener noreferrer"';
  }

  function linkAttrs(url) {
    if (!url || url.startsWith('/') || url.startsWith('./') || url.startsWith(location.origin)) {
      return '';
    }
    return externalLinkAttrs();
  }

  function showEmbeddedBrowserHint() {
    if (!isEmbeddedPreview() || document.getElementById('embeddedHint')) return;

    const hint = document.createElement('div');
    hint.id = 'embeddedHint';
    hint.className = 'embedded-hint';
    hint.innerHTML = `
      <span class="material-icons-round">open_in_browser</span>
      <span>VS Code/Cursor 안에서는 <strong>Ctrl+클릭</strong>으로 Chrome·Edge에서 열리거나,
      <a class="external-link" href="${location.href}">이 페이지를 브라우저에서 열기</a></span>
    `;
    document.body.insertBefore(hint, document.body.firstChild);
  }

  function renderTabs() {
    tabNavInner.innerHTML = visibleTabs.map(tab => `
      <button class="tab-btn${tab.id === activeTab ? ' active' : ''}"
              data-tab="${tab.id}"
              type="button">${tab.label}</button>
    `).join('');

    tabNavInner.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
  }

  function renderPanels() {
    mainContent.innerHTML = visibleTabs.map(tab => `
      <div class="tab-panel${tab.id === activeTab ? ' active' : ''}" id="panel-${tab.id}">
        ${(tab.topic || tab.title || tab.description) ? `
        <div class="panel-header">
          ${tab.topic ? `<span class="panel-topic">${tab.topic}</span>` : ''}
          ${tab.title ? `<h2>${tab.title}</h2>` : ''}
          ${tab.description ? `<p class="panel-desc">${tab.description}</p>` : ''}
        </div>` : ''}
        ${tab.sections.map(renderSection).join('')}
      </div>
    `).join('');

    bindCopyButtons();
    bindCodeToggle();
    bindPromptEditors();
    bindTabActions();
    bindExcelUpload();
  }

  function renderSection(section) {
    switch (section.type) {
      case 'excel-upload': return renderExcelUploadSection(section);
      case 'action': return renderActionSection(section);
      case 'files': return renderFilesSection(section);
      case 'tools': return renderToolsSection(section);
      case 'install': return renderInstallSection(section);
      case 'alert': return renderAlertSection(section);
      case 'tip': return renderTipSection(section);
      case 'note': return renderNoteSection(section);
      case 'prompts': return renderPromptsSection(section);
      case 'vba-lab': return renderVbaLabSection(section);
      case 'docs': return renderDocsSection(section);
      case 'workflow': return renderWorkflowSection(section);
      case 'app-links': return renderAppLinksSection(section);
      case 'image': return renderImageSection(section);
      case 'embed': return renderEmbedSection(section);
      default: return '';
    }
  }

  function renderExcelUploadSection(section) {
    return `<div class="section">
      ${sectionTitle(section, section.icon)}
      ${section.description ? `<p class="panel-desc" style="margin-bottom:16px">${section.description}</p>` : ''}
      <div class="excel-upload-box">
        <div class="excel-upload-top">
          <label class="btn btn-primary btn-sm excel-upload-trigger" for="excelUploadInput">
            <span class="material-icons-round">upload_file</span>엑셀 파일 업로드
          </label>
          <input id="excelUploadInput" class="excel-upload-input" type="file" accept=".xlsx,.xls,.xlsm" />
          <div class="excel-upload-file" id="excelUploadFileName">선택된 파일 없음</div>
        </div>
        <div class="excel-upload-result hidden" id="excelUploadResult">
          <div class="excel-upload-meta" id="excelUploadMeta"></div>
          <div class="excel-upload-columns">
            <h4>컬럼 정보</h4>
            <div class="excel-column-list" id="excelColumnList"></div>
          </div>
        </div>
      </div>
    </div>`;
  }

  function sectionTitle(section, icon) {
    const titleContent = typeof section === 'string'
      ? section
      : (section.titleHtml || escapeHtml(section.title));
    return `<h3 class="section-title">
      <span class="material-icons-round">${icon || 'article'}</span>
      ${titleContent}
    </h3>`;
  }

  function renderFilesSection(section) {
    return `<div class="section">
      ${sectionTitle(section, section.icon)}
      <div class="file-grid">
        ${section.files.map(f => `
          <div class="file-card">
            <div class="file-card-icon ${f.icon}">
              <span class="material-icons-round">${fileIcon(f.icon)}</span>
            </div>
            <h4>${f.name}</h4>
            <p>${f.description}</p>
            <div class="file-card-actions">
              ${f.url ? `<a class="btn btn-primary btn-sm external-link" href="${f.url}"${externalLinkAttrs()}>
                <span class="material-icons-round">cloud_download</span>${f.urlLabel || '다운로드'}
              </a>` : ''}
              ${f.path ? `<a class="btn btn-outline btn-sm" href="${f.path}" download>
                <span class="material-icons-round">download</span>파일 다운로드
              </a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
  }

  function fileIcon(type) {
    const map = { drive: 'cloud', excel: 'table_chart', pdf: 'picture_as_pdf', csv: 'grid_on', bat: 'terminal', local: 'insert_drive_file' };
    return map[type] || 'insert_drive_file';
  }

  function renderToolsSection(section) {
    return `<div class="section">
      ${sectionTitle(section, section.icon)}
      <div class="tool-grid">
        ${section.tools.map(t => `
          <div class="tool-card">
            <div class="tool-card-header">
              <div class="tool-logo ${t.logo}">${t.logo === 'gemini' ? 'G' : t.logo === 'python' ? 'Py' : 'Cu'}</div>
              <h4>${t.name}</h4>
            </div>
            <p>${t.description}</p>
            <ul>${t.items.map(i => `<li>${i}</li>`).join('')}</ul>
          </div>
        `).join('')}
      </div>
    </div>`;
  }

  function renderInstallSection(section) {
    return `<div class="section">
      ${sectionTitle(section, section.icon)}
      ${section.note ? `<p class="panel-desc" style="margin-bottom:16px">${section.note}</p>` : ''}
      <div class="install-steps">
        ${section.steps.map((s, i) => `
          <div class="install-step">
            <div class="step-num">${i + 1}</div>
            <div>
              <h4>${s.title}</h4>
              <p>${s.desc}</p>
              ${s.link ? `<a class="btn btn-outline btn-sm external-link" href="${s.link}"${externalLinkAttrs()} style="margin-top:8px">
                <span class="material-icons-round">open_in_new</span>${s.linkLabel}
              </a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
      ${renderCodeBlock('PowerShell / CMD', section.code)}
    </div>`;
  }

  function renderAlertSection(section) {
    return `<div class="section">
      <div class="alert-box ${section.variant || ''}">
        <h4><span class="material-icons-round">${section.icon || 'info'}</span>${section.title}</h4>
        <ul>${section.items.map(i => `<li>${i}</li>`).join('')}</ul>
      </div>
    </div>`;
  }

  function renderTipSection(section) {
    return `<div class="section">
      ${sectionTitle(section, section.icon)}
      <div class="tip-box">
        <ol>${section.items.map(i => `<li>${formatTipText(i)}</li>`).join('')}</ol>
      </div>
    </div>`;
  }

  function renderNoteSection(section) {
    return `<div class="section">
      <div class="tip-box">${section.text}</div>
    </div>`;
  }

  function renderActionSection(section) {
    return `<div class="section">
      <div class="tab-action-bar">
        <button class="btn btn-outline btn-sm tab-action-btn" data-action="${section.action}" type="button">${section.label}</button>
      </div>
    </div>`;
  }

  function renderPromptsSection(section) {
    return `<div class="section">
      ${section.title ? sectionTitle(section, section.icon) : ''}
      ${section.hint ? `<div class="prompt-copy-hint">☞ 프롬프트 복사해서 Codex 채팅창에 붙여넣기</div>` : ''}
      <div class="prompt-list">
        ${section.prompts.map((p, i) => renderPromptCard(p, `${section.title}-${i}`)).join('')}
      </div>
    </div>`;
  }

  function renderPromptCard(prompt, id) {
    const toolLabel = { gemini: 'Gemini', cursor: 'Cursor', both: 'Cursor + Gemini', vba: 'VBA Prompt' };
    const editableActions = prompt.editable ? `
      <div class="prompt-header-actions">
        <button class="btn btn-ghost btn-sm prompt-edit-btn" data-prompt-id="${id}" type="button">편집</button>
        <button class="btn btn-ghost btn-sm prompt-save-btn hidden" data-prompt-id="${id}" type="button">저장</button>
        <button class="btn btn-ghost btn-sm prompt-cancel-btn hidden" data-prompt-id="${id}" type="button">취소</button>
      </div>
    ` : '';
    return `<div class="prompt-card">
      <div class="prompt-card-header">
        <span class="prompt-label">${prompt.label}</span>
        ${prompt.editable ? editableActions : (prompt.tool ? `<span class="prompt-tool ${prompt.tool}">${toolLabel[prompt.tool] || prompt.tool}</span>` : '')}
      </div>
      ${prompt.fileRef ? `<div class="prompt-file-ref">업로드 파일: <code>${prompt.fileRef}</code></div>` : ''}
      <div class="prompt-body-row">
        <div class="prompt-body" id="prompt-${id}" data-original-text="${escapeHtml(prompt.text)}">${formatPromptText(getStoredPromptText(id, prompt.text))}</div>
        ${prompt.editable ? `<textarea class="prompt-editor hidden" id="editor-${id}">${escapeHtml(getStoredPromptText(id, prompt.text))}</textarea>` : ''}
        <button class="btn btn-primary btn-sm copy-btn" data-copy="prompt-${id}" type="button">
          <span class="material-icons-round">content_copy</span>프롬프트 복사
        </button>
      </div>
    </div>`;
  }

  function getPromptStorageKey(id) {
    return `prompt-edit:${id}`;
  }

  function getStoredPromptText(id, fallback) {
    try {
      return localStorage.getItem(getPromptStorageKey(id)) || fallback;
    } catch {
      return fallback;
    }
  }

  function bindPromptEditors() {
    document.querySelectorAll('.prompt-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => togglePromptEditor(btn.dataset.promptId, true));
    });

    document.querySelectorAll('.prompt-cancel-btn').forEach(btn => {
      btn.addEventListener('click', () => resetPromptEditor(btn.dataset.promptId));
    });

    document.querySelectorAll('.prompt-save-btn').forEach(btn => {
      btn.addEventListener('click', () => savePromptEditor(btn.dataset.promptId));
    });
  }

  function bindTabActions() {
    document.querySelectorAll('.tab-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.action === 'hide-dashboard-tab') {
          hideTab('seoul-dashboard');
          return;
        }
        if (btn.dataset.action === 'open-dashboard-tab') {
          if (visibleTabs.some(tab => tab.id === 'seoul-dashboard')) {
            switchTab('seoul-dashboard');
            showToast('대시보드 탭으로 이동했습니다');
          } else {
            showToast('대시보드 탭이 현재 숨겨져 있습니다');
          }
        }
      });
    });
  }

  function bindExcelUpload() {
    const input = document.getElementById('excelUploadInput');
    if (!input) return;

    input.addEventListener('change', async event => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const fileName = document.getElementById('excelUploadFileName');
      const result = document.getElementById('excelUploadResult');
      const meta = document.getElementById('excelUploadMeta');
      const columns = document.getElementById('excelColumnList');

      if (fileName) fileName.textContent = file.name;
      if (result) result.classList.remove('hidden');
      if (meta) meta.innerHTML = '<div class="excel-empty-text">불러오는 중...</div>';
      if (columns) columns.innerHTML = '';

      try {
        if (!window.XLSX) {
          throw new Error('엑셀 라이브러리를 불러오지 못했습니다.');
        }

        const buffer = await file.arrayBuffer();
        const workbook = window.XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const rows = window.XLSX.utils.sheet_to_json(sheet, { defval: '' });
        const headerRows = window.XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        const headers = rows.length
          ? Object.keys(rows[0])
          : (headerRows[0] || []).filter(Boolean);

        const profile = {
          fileName: file.name,
          sheetName: firstSheetName,
          rowCount: rows.length,
          columnCount: headers.length,
          columns: headers
        };

        try {
          localStorage.setItem('dashboard-upload-profile', JSON.stringify(profile));
        } catch {}

        if (meta) {
          meta.innerHTML = `
            <div class="excel-meta-card"><span>파일명</span><strong>${escapeHtml(profile.fileName)}</strong></div>
            <div class="excel-meta-card"><span>시트명</span><strong>${escapeHtml(profile.sheetName)}</strong></div>
            <div class="excel-meta-card"><span>데이터 건수</span><strong>${profile.rowCount.toLocaleString()}건</strong></div>
            <div class="excel-meta-card"><span>컬럼 수</span><strong>${profile.columnCount}개</strong></div>
          `;
        }

        if (columns) {
          columns.innerHTML = profile.columns.length
            ? profile.columns.map(column => `<span class="excel-column-chip">${escapeHtml(column)}</span>`).join('')
            : '<span class="excel-empty-text">컬럼 정보를 찾지 못했습니다.</span>';
        }
      } catch (error) {
        if (meta) {
          meta.innerHTML = `<div class="excel-empty-text">${escapeHtml(error.message || '엑셀 파일을 읽지 못했습니다.')}</div>`;
        }
      }
    });
  }

  function getHiddenTabIds() {
    const ids = new Set(defaultHiddenTabIds);
    try {
      const stored = JSON.parse(localStorage.getItem('hidden-tab-ids') || '[]');
      stored.forEach(id => ids.add(id));
    } catch {}
    return ids;
  }

  function getVisibleTabs() {
    return tabs.filter(tab => !hiddenTabIds.has(tab.id));
  }

  function saveHiddenTabIds() {
    try {
      localStorage.setItem('hidden-tab-ids', JSON.stringify([...hiddenTabIds].filter(id => !defaultHiddenTabIds.includes(id))));
    } catch {}
  }

  function hideTab(tabId) {
    hiddenTabIds.add(tabId);
    saveHiddenTabIds();
    visibleTabs = getVisibleTabs();
    if (activeTab === tabId) {
      activeTab = visibleTabs[0]?.id;
    }
    renderTabs();
    renderPanels();
    switchTab(activeTab);
    showToast('대시보드 탭이 삭제되었습니다');
  }

  function togglePromptEditor(id, editing) {
    const body = document.getElementById(`prompt-${id}`);
    const editor = document.getElementById(`editor-${id}`);
    const editBtn = document.querySelector(`.prompt-edit-btn[data-prompt-id="${id}"]`);
    const saveBtn = document.querySelector(`.prompt-save-btn[data-prompt-id="${id}"]`);
    const cancelBtn = document.querySelector(`.prompt-cancel-btn[data-prompt-id="${id}"]`);
    if (!body || !editor || !editBtn || !saveBtn || !cancelBtn) return;

    body.classList.toggle('hidden', editing);
    editor.classList.toggle('hidden', !editing);
    editBtn.classList.toggle('hidden', editing);
    saveBtn.classList.toggle('hidden', !editing);
    cancelBtn.classList.toggle('hidden', !editing);

    if (editing) {
      editor.focus();
      editor.setSelectionRange(editor.value.length, editor.value.length);
    }
  }

  function resetPromptEditor(id) {
    const body = document.getElementById(`prompt-${id}`);
    const editor = document.getElementById(`editor-${id}`);
    if (!body || !editor) return;

    editor.value = body.textContent || '';
    togglePromptEditor(id, false);
  }

  function savePromptEditor(id) {
    const body = document.getElementById(`prompt-${id}`);
    const editor = document.getElementById(`editor-${id}`);
    if (!body || !editor) return;

    const value = editor.value;
    body.innerHTML = formatPromptText(value);
    try {
      localStorage.setItem(getPromptStorageKey(id), value);
    } catch {}
    togglePromptEditor(id, false);
    showToast('프롬프트가 수정되었습니다');
  }

  function renderVbaLabSection(section) {
    const id = section.title.replace(/\s/g, '-');
    return `<div class="section">
      ${sectionTitle(section, section.icon)}
      ${section.fileRef ? `<p class="panel-desc" style="margin-bottom:12px">사용 파일: <code>${section.fileRef}</code></p>` : ''}
      ${renderPromptCard({ label: 'VBA 코드 생성 프롬프트', tool: 'vba', text: section.prompt }, `vba-prompt-${id}`)}
      ${renderCodeBlock('결과 VBA', section.code, section.codeCollapsed)}
    </div>`;
  }

  function renderDocsSection(section) {
    return `<div class="section">
      ${sectionTitle(section, section.icon)}
      <div class="doc-grid">
        ${section.docs.map(d => `
          <div class="doc-card">
            <h4>${d.name}</h4>
            <p>${d.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>`;
  }

  function renderWorkflowSection(section) {
    return `<div class="section">
      ${sectionTitle(section, section.icon)}
      <div class="workflow">
        ${section.steps.map(s => `<div class="workflow-step"><p>${s}</p></div>`).join('')}
      </div>
    </div>`;
  }

  function appLinkGridClass(section) {
    const n = section.items.length;
    const cols = section.gridColumns ?? (n === 4 ? 4 : n === 3 ? 3 : n === 2 ? 2 : null);
    return cols ? `app-link-grid app-link-grid--cols-${cols}` : 'app-link-grid';
  }

  function renderImageSection(section) {
    const images = section.images || [{ src: section.src, alt: section.alt }];
    const compactClass = section.compact ? ' guide-image--compact' : '';
    return `<div class="section">
      ${section.title ? sectionTitle(section, section.icon) : ''}
      <div class="guide-image-list">
        ${images.map(img => `
          <figure class="guide-image${compactClass}">
            <img src="${img.src}" alt="${escapeHtml(img.alt || section.title || '')}" loading="lazy">
          </figure>
        `).join('')}
      </div>
    </div>`;
  }

  function renderEmbedSection(section) {
    return `<div class="section">
      ${section.title ? sectionTitle(section, section.icon) : ''}
      ${section.description ? `<p class="panel-desc" style="margin-bottom:16px">${section.description}</p>` : ''}
      <div class="embed-frame-wrap">
        <iframe class="embed-frame" src="${section.src}" title="${escapeHtml(section.title || '임베드 콘텐츠')}"></iframe>
      </div>
    </div>`;
  }

  function renderAppLinksSection(section) {
    return `<div class="section">
      ${sectionTitle(section, section.icon)}
      ${section.summary ? `<p class="section-summary${section.summaryVariant ? ` section-summary--${section.summaryVariant}` : ''}">${section.summary}</p>` : ''}
      <div class="${appLinkGridClass(section)}">
        ${section.items.map(item => `
          <div class="app-link-card">
            <div class="brand-icon brand-${item.brand}">
              <img src="${BRAND_ICON[item.brand]}" alt="${item.name} 로고" width="48" height="48">
            </div>
            <h4>${item.name}</h4>
            ${item.description ? `<p>${item.description}</p>` : ''}
            <a class="btn btn-brand btn-brand-${item.brand} btn-sm external-link" href="${item.url}"${linkAttrs(item.url)}>
              <span class="material-icons-round">${item.urlLabel.includes('다운로드') || item.urlLabel.includes('Download') ? 'download' : 'open_in_new'}</span>
              ${item.urlLabel}
            </a>
          </div>
        `).join('')}
      </div>
    </div>`;
  }

  function renderCodeBlock(label, code, collapsed) {
    const id = 'code-' + Math.random().toString(36).slice(2, 8);
    return `<div class="code-block${collapsed ? ' collapsed' : ''}" id="block-${id}">
      <div class="code-block-header">
        <span>${label}</span>
        <div>
          ${collapsed ? `<button class="btn btn-ghost btn-sm toggle-code-btn" data-target="block-${id}" type="button">
            <span class="material-icons-round">visibility</span>전체 보기
          </button>` : ''}
          <button class="btn btn-ghost btn-sm copy-btn" data-copy-text="${encodeURIComponent(code)}" type="button">
            <span class="material-icons-round">content_copy</span>복사
          </button>
        </div>
      </div>
      <pre><code>${escapeHtml(code)}</code></pre>
    </div>`;
  }

  function switchTab(tabId) {
    activeTab = tabId;
    history.replaceState(null, '', `#${tabId}`);

    tabNavInner.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    mainContent.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `panel-${tabId}`);
    });

    const activeBtn = tabNavInner.querySelector(`[data-tab="${tabId}"]`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  function bindHashNavigation() {
    window.addEventListener('hashchange', activateTabFromHash);
  }

  function activateTabFromHash() {
    const hash = location.hash.replace('#', '');
    if (hash && visibleTabs.some(t => t.id === hash)) {
      switchTab(hash);
    }
  }

  function bindCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        let text;
        if (btn.dataset.copy) {
          const el = document.getElementById(btn.dataset.copy);
          text = el ? el.textContent : '';
        } else if (btn.dataset.copyText) {
          text = decodeURIComponent(btn.dataset.copyText);
        }
        if (text) {
          await copyToClipboard(text);
          showToast('클립보드에 복사되었습니다');
        }
      });
    });
  }

  function bindCodeToggle() {
    document.querySelectorAll('.toggle-code-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const block = document.getElementById(btn.dataset.target);
        if (block) {
          block.classList.remove('collapsed');
          btn.style.display = 'none';
        }
      });
    });
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  }

  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatPromptText(str) {
    return escapeHtml(str).replace(/\[\[([^\]]+)\]\]/g, '<span class="prompt-em">$1</span>');
  }

  function formatTipText(str) {
    return formatPromptText(str).replace(
      /&lt;img class=&quot;tip-inline-icon&quot; src=&quot;([^&]+)&quot; alt=&quot;([^&]*)&quot;&gt;/g,
      (_, src, alt) => `<img class="tip-inline-icon" src="${src}" alt="${alt}">`
    );
  }

  init();
})();
