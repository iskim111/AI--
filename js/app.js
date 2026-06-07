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
  let xlsxLoadPromise = null;

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
        ${tab.sections.map((section, index) => renderSection(section, `${tab.id}-${index}`)).join('')}
      </div>
    `).join('');

    bindCopyButtons();
    bindCodeToggle();
    bindPromptEditors();
    bindExcelUpload();
  }

  function renderSection(section, scopeId) {
    switch (section.type) {
      case 'excel-upload': return renderExcelUploadSection(section);
      case 'action': return renderActionSection(section);
      case 'files': return renderFilesSection(section);
      case 'tools': return renderToolsSection(section);
      case 'install': return renderInstallSection(section);
      case 'alert': return renderAlertSection(section);
      case 'tip': return renderTipSection(section);
      case 'note': return renderNoteSection(section);
      case 'prompts': return renderPromptsSection(section, scopeId);
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
      ${section.title ? sectionTitle(section, section.icon) : ''}
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

  function renderPromptsSection(section, scopeId) {
    const prompts = section.directEdit ? getProgramBuilderPromptList(scopeId, section) : section.prompts;
    return `<div class="section">
      ${(section.title || section.addable) ? `
      <div class="prompt-section-bar">
        ${section.title ? sectionTitle(section, section.icon) : '<div></div>'}
        ${section.addable ? `<button class="btn btn-outline btn-sm prompt-add-btn" data-scope-id="${scopeId}" type="button">+ 프롬프트 추가</button>` : ''}
      </div>` : ''}
      ${section.hint ? `<div class="prompt-copy-hint">☞ 프롬프트 복사해서 Codex 채팅창에 붙여넣기</div>` : ''}
      <div class="prompt-list${section.className ? ` ${section.className}` : ''}">
        ${prompts.map((p, i) => renderPromptCard(p, getPromptDomId(scopeId, p, i), {
          directEdit: !!section.directEdit,
          scopeId,
          prompt: p,
          resizable: !!section.resizable,
          sortable: !!section.sortable
        })).join('')}
      </div>
    </div>`;
  }

  function renderPromptCard(prompt, id, options = {}) {
    const toolLabel = { gemini: 'Gemini', cursor: 'Cursor', both: 'Cursor + Gemini', vba: 'VBA Prompt' };
    const directEdit = !!options.directEdit;
    const cardWidth = directEdit && options.resizable && prompt.width ? ` style="width:${prompt.width}px"` : '';
    const editableActions = prompt.editable ? `
      <div class="prompt-header-actions">
        <button class="btn btn-ghost btn-sm prompt-edit-btn" data-prompt-id="${id}" type="button">편집</button>
        <button class="btn btn-ghost btn-sm prompt-save-btn hidden" data-prompt-id="${id}" type="button">저장</button>
        <button class="btn btn-ghost btn-sm prompt-cancel-btn hidden" data-prompt-id="${id}" type="button">취소</button>
      </div>
    ` : '';
    const directActions = directEdit ? `
      <div class="prompt-header-actions">
        ${options.sortable ? `<button class="btn btn-ghost btn-sm prompt-delete-btn" data-scope-id="${options.scopeId}" data-prompt-uid="${prompt.uid}" type="button">삭제</button>` : ''}
        ${options.sortable ? `<button class="btn btn-ghost btn-sm prompt-collapse-btn hidden" data-scope-id="${options.scopeId}" data-prompt-uid="${prompt.uid}" type="button">축소</button>` : ''}
      </div>
    ` : '';
    return `<div class="prompt-card${directEdit && options.resizable ? ' prompt-card--resizable' : ''}${directEdit ? ' prompt-card--direct-edit' : ''}"${cardWidth} data-scope-id="${options.scopeId || ''}" data-prompt-uid="${prompt.uid || ''}">
      <div class="prompt-card-header"${directEdit ? ` data-expandable="${options.sortable ? 'true' : 'false'}" data-scope-id="${options.scopeId}" data-prompt-uid="${prompt.uid}"${options.sortable ? ' draggable="true"' : ''}` : ''}>
        ${directEdit
          ? `<input class="prompt-title-input" type="text" value="${escapeHtml(prompt.label)}" data-scope-id="${options.scopeId}" data-prompt-uid="${prompt.uid}" aria-label="프롬프트 제목">`
          : `<span class="prompt-label">${prompt.label}</span>`}
        ${directEdit ? directActions : (prompt.editable ? editableActions : (prompt.tool ? `<span class="prompt-tool ${prompt.tool}">${toolLabel[prompt.tool] || prompt.tool}</span>` : ''))}
      </div>
      ${prompt.fileRef ? `<div class="prompt-file-ref">업로드 파일: <code>${prompt.fileRef}</code></div>` : ''}
      <div class="prompt-body-row">
        ${directEdit
          ? `<textarea class="prompt-editor prompt-live-editor" id="prompt-input-${id}" data-prompt-id="${id}" placeholder="여기에 프롬프트를 바로 작성하세요.">${escapeHtml(getStoredPromptText(id, prompt.text))}</textarea>`
          : `<div class="prompt-body" id="prompt-${id}" data-original-text="${escapeHtml(prompt.text)}">${formatPromptText(getStoredPromptText(id, prompt.text))}</div>
        ${prompt.editable ? `<textarea class="prompt-editor hidden" id="editor-${id}">${escapeHtml(getStoredPromptText(id, prompt.text))}</textarea>` : ''}`
        }
        <button class="btn btn-primary btn-sm copy-btn" ${directEdit ? `data-copy-input="prompt-input-${id}"` : `data-copy="prompt-${id}"`} type="button">
          <span class="material-icons-round">content_copy</span>프롬프트 복사
        </button>
      </div>
      ${prompt.notePad ? `
      <div class="prompt-note-box">
        <label class="prompt-note-label" for="note-${id}">메모</label>
        <textarea class="prompt-note" id="note-${id}" data-note-id="${id}" placeholder="여기에 메모를 적으세요.">${escapeHtml(getStoredPromptNote(id, prompt.note || ''))}</textarea>
      </div>` : ''}
      ${directEdit && options.resizable ? `<div class="prompt-resize-handle" data-scope-id="${options.scopeId}" data-prompt-uid="${prompt.uid}" title="드래그해서 너비 조절"></div>` : ''}
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

  function getPromptNoteStorageKey(id) {
    return `prompt-note:${id}`;
  }

  function getStoredPromptNote(id, fallback = '') {
    try {
      return localStorage.getItem(getPromptNoteStorageKey(id)) || fallback;
    } catch {
      return fallback;
    }
  }

  function getProgramBuilderPromptListStorageKey(scopeId) {
    return `prompt-list:${scopeId}`;
  }

  function getProgramBuilderPromptListVersionKey(scopeId) {
    return `prompt-list-version:${scopeId}`;
  }

  function getProgramBuilderPromptList(scopeId, section) {
    const fallbackPrompts = section.prompts;
    const uniformWidth = section.uniformWidth || 220;
    const layoutVersion = section.layoutVersion || '';
    const resetStoredPromptsOnVersionChange = !!section.resetStoredPromptsOnVersionChange;
    const fallbackByUid = new Map(
      fallbackPrompts.map((prompt, index) => [prompt.uid || `prompts-${index}`, prompt])
    );
    let prompts = null;
    try {
      const stored = localStorage.getItem(getProgramBuilderPromptListStorageKey(scopeId));
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) {
          prompts = parsed;
        }
      }
    } catch {}
    if (!prompts) {
      prompts = fallbackPrompts.map((prompt, index) => ({
        uid: prompt.uid || `prompts-${index}`,
        label: prompt.label || `프롬프트 ${index + 1}`,
        width: prompt.width || uniformWidth,
        tool: prompt.tool || 'cursor',
        editable: true,
        text: prompt.text || '',
        notePad: prompt.notePad !== false,
        note: prompt.note || ''
      }));
    }

    let normalized = prompts.map((prompt, index) => ({
      uid: prompt.uid || `prompts-${index}`,
      label: prompt.label || fallbackByUid.get(prompt.uid || `prompts-${index}`)?.label || `프롬프트 ${index + 1}`,
      width: prompt.width || fallbackByUid.get(prompt.uid || `prompts-${index}`)?.width || uniformWidth,
      tool: prompt.tool || fallbackByUid.get(prompt.uid || `prompts-${index}`)?.tool || 'cursor',
      editable: true,
      text: prompt.text || fallbackByUid.get(prompt.uid || `prompts-${index}`)?.text || '',
      notePad: prompt.notePad !== false,
      note: prompt.note || fallbackByUid.get(prompt.uid || `prompts-${index}`)?.note || ''
    }));

    try {
      const storedVersion = localStorage.getItem(getProgramBuilderPromptListVersionKey(scopeId));
      if (layoutVersion && storedVersion !== layoutVersion) {
        if (resetStoredPromptsOnVersionChange || !prompts || !prompts.length) {
          normalized = fallbackPrompts.map((prompt, index) => ({
            uid: prompt.uid || `prompts-${index}`,
            label: prompt.label || `프롬프트 ${index + 1}`,
            width: prompt.width || uniformWidth,
            tool: prompt.tool || 'cursor',
            editable: true,
            text: prompt.text || '',
            notePad: prompt.notePad !== false,
            note: prompt.note || ''
          }));
        } else {
          const normalizedByUid = new Set(normalized.map(prompt => prompt.uid));
          fallbackPrompts.forEach((prompt, index) => {
            const uid = prompt.uid || `prompts-${index}`;
            if (!normalizedByUid.has(uid)) {
              normalized.push({
                uid,
                label: prompt.label || `프롬프트 ${normalized.length + 1}`,
                width: prompt.width || uniformWidth,
                tool: prompt.tool || 'cursor',
                editable: true,
                text: prompt.text || '',
                notePad: prompt.notePad !== false,
                note: prompt.note || ''
              });
            }
          });
        }
        localStorage.setItem(getProgramBuilderPromptListStorageKey(scopeId), JSON.stringify(normalized));
        localStorage.setItem(getProgramBuilderPromptListVersionKey(scopeId), layoutVersion);
      }
    } catch {}

    return normalized;
  }

  function saveProgramBuilderPromptList(scopeId, prompts) {
    try {
      localStorage.setItem(getProgramBuilderPromptListStorageKey(scopeId), JSON.stringify(prompts));
    } catch {}
  }

  function getPromptDomId(scopeId, prompt, index) {
    return `${scopeId || 'section'}-${prompt.uid || `prompts-${index}`}`;
  }

  function getSectionByScopeId(scopeId) {
    const lastHyphen = scopeId.lastIndexOf('-');
    if (lastHyphen < 0) return null;
    const tabId = scopeId.slice(0, lastHyphen);
    const sectionIndex = Number(scopeId.slice(lastHyphen + 1));
    const tab = tabs.find(item => item.id === tabId);
    if (!tab || !Number.isInteger(sectionIndex)) return null;
    return tab.sections[sectionIndex] || null;
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

    document.querySelectorAll('.prompt-note').forEach(note => {
      note.addEventListener('input', () => {
        try {
          localStorage.setItem(getPromptNoteStorageKey(note.dataset.noteId), note.value);
        } catch {}
      });
    });

    document.querySelectorAll('.prompt-live-editor').forEach(editor => {
      editor.addEventListener('input', () => {
        try {
          localStorage.setItem(getPromptStorageKey(editor.dataset.promptId), editor.value);
        } catch {}
        const card = editor.closest('.prompt-card');
        if (card?.dataset.scopeId && card?.dataset.promptUid) {
          updateDirectEditPrompt(card.dataset.scopeId, card.dataset.promptUid, { text: editor.value });
        }
      });
    });

    document.querySelectorAll('.prompt-title-input').forEach(input => {
      const haltHeaderEvents = event => {
        event.stopPropagation();
      };
      const header = input.closest('.prompt-card-header');
      const restoreDrag = () => {
        if (header?.dataset.expandable === 'true') {
          header.draggable = true;
        }
      };

      input.addEventListener('click', haltHeaderEvents);
      input.addEventListener('mousedown', event => {
        if (header) {
          header.draggable = false;
        }
        haltHeaderEvents(event);
      });
      input.addEventListener('dblclick', haltHeaderEvents);
      input.addEventListener('dragstart', haltHeaderEvents);
      input.addEventListener('mouseup', restoreDrag);
      input.addEventListener('blur', restoreDrag);
      input.addEventListener('input', () => {
        updateDirectEditPrompt(input.dataset.scopeId, input.dataset.promptUid, { label: input.value || '제목 없음' });
      });
    });

    document.querySelectorAll('.prompt-add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        addProgramBuilderPrompt(btn.dataset.scopeId);
      });
    });

    document.querySelectorAll('.prompt-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteProgramBuilderPrompt(btn.dataset.scopeId, btn.dataset.promptUid);
      });
    });

    document.querySelectorAll('.prompt-collapse-btn').forEach(btn => {
      btn.addEventListener('click', event => {
        event.stopPropagation();
        collapseProgramBuilderPrompt(btn.dataset.scopeId);
      });
    });

    document.querySelectorAll('.prompt-card-header[data-expandable="true"]').forEach(header => {
      header.addEventListener('dblclick', () => {
        expandProgramBuilderPrompt(header.dataset.scopeId, header.dataset.promptUid);
      });
    });

    bindProgramBuilderResize();
    bindProgramBuilderDragAndDrop();
  }

  function addProgramBuilderPrompt(scopeId) {
    const section = getSectionByScopeId(scopeId);
    if (!section) return;

    const prompts = getProgramBuilderPromptList(scopeId, section);
    const nextIndex = prompts.reduce((max, prompt) => {
      const match = String(prompt.uid || '').match(/prompts-(\d+)$/);
      return match ? Math.max(max, Number(match[1])) : max;
    }, -1) + 1;

    prompts.push({
      uid: `prompts-${nextIndex}`,
      label: `프롬프트 ${prompts.length + 1}`,
      width: section.uniformWidth || 220,
      tool: 'cursor',
      editable: true,
      text: '',
      notePad: true
    });

    saveProgramBuilderPromptList(scopeId, prompts);
    renderPanels();

    const newId = getPromptDomId(scopeId, prompts[prompts.length - 1], prompts.length - 1);
    const input = document.getElementById(`prompt-input-${newId}`);
    if (input) {
      input.focus();
    }
  }

  function deleteProgramBuilderPrompt(scopeId, promptUid) {
    const section = getSectionByScopeId(scopeId);
    if (!section) return;

    const prompts = getProgramBuilderPromptList(scopeId, section);
    if (prompts.length <= 1) return;

    const nextPrompts = prompts.filter(prompt => prompt.uid !== promptUid);

    prompts.forEach((prompt, index) => {
      if (prompt.uid === promptUid) {
        const promptId = getPromptDomId(scopeId, prompt, index);
        try {
          localStorage.removeItem(getPromptStorageKey(promptId));
          localStorage.removeItem(getPromptNoteStorageKey(promptId));
        } catch {}
      }
    });

    saveProgramBuilderPromptList(scopeId, nextPrompts);
    renderPanels();
  }

  function bindProgramBuilderResize() {
    document.querySelectorAll('.prompt-resize-handle').forEach(handle => {
      handle.addEventListener('mousedown', event => {
        event.preventDefault();
        const card = handle.closest('.prompt-card');
        if (!card) return;

        const startX = event.clientX;
        const startWidth = card.getBoundingClientRect().width;
        const scopeId = handle.dataset.scopeId;
        const promptUid = handle.dataset.promptUid;

        const onMove = moveEvent => {
          const nextWidth = Math.max(260, Math.min(1100, startWidth + (moveEvent.clientX - startX)));
          card.style.width = `${nextWidth}px`;
        };

        const onUp = () => {
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
          saveProgramBuilderPromptWidth(scopeId, promptUid, Math.round(card.getBoundingClientRect().width));
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
      });
    });
  }

  function saveProgramBuilderPromptWidth(scopeId, promptUid, width) {
    const section = getSectionByScopeId(scopeId);
    if (!section) return;
    const prompts = getProgramBuilderPromptList(scopeId, section).map(prompt =>
      prompt.uid === promptUid ? { ...prompt, width } : prompt
    );
    saveProgramBuilderPromptList(scopeId, prompts);
  }

  function bindProgramBuilderDragAndDrop() {
    document.querySelectorAll('.prompt-card-header[data-expandable="true"]').forEach(header => {
      header.addEventListener('dragstart', event => {
        const card = header.closest('.prompt-card');
        if (!card) return;
        card.classList.add('prompt-card--dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', JSON.stringify({
          scopeId: header.dataset.scopeId,
          promptUid: header.dataset.promptUid
        }));
      });

      header.addEventListener('dragend', () => {
        const card = header.closest('.prompt-card');
        if (card) {
          card.classList.remove('prompt-card--dragging');
        }
        document.querySelectorAll('.prompt-card--drag-over').forEach(el => el.classList.remove('prompt-card--drag-over'));
      });
    });

    document.querySelectorAll('.prompt-card[data-scope-id]').forEach(card => {
      card.addEventListener('dragend', () => {
        card.classList.remove('prompt-card--dragging');
        document.querySelectorAll('.prompt-card--drag-over').forEach(el => el.classList.remove('prompt-card--drag-over'));
      });

      card.addEventListener('dragover', event => {
        if (!card.dataset.scopeId) return;
        event.preventDefault();
        card.classList.add('prompt-card--drag-over');
      });

      card.addEventListener('dragleave', () => {
        card.classList.remove('prompt-card--drag-over');
      });

      card.addEventListener('drop', event => {
        event.preventDefault();
        card.classList.remove('prompt-card--drag-over');
        let payload;
        try {
          payload = JSON.parse(event.dataTransfer.getData('text/plain'));
        } catch {
          return;
        }
        if (!payload || payload.scopeId !== card.dataset.scopeId || payload.promptUid === card.dataset.promptUid) {
          return;
        }
        moveProgramBuilderPrompt(payload.scopeId, payload.promptUid, card.dataset.promptUid);
      });
    });
  }

  function moveProgramBuilderPrompt(scopeId, sourceUid, targetUid) {
    const section = getSectionByScopeId(scopeId);
    if (!section) return;

    const prompts = getProgramBuilderPromptList(scopeId, section);
    const sourceIndex = prompts.findIndex(prompt => prompt.uid === sourceUid);
    const targetIndex = prompts.findIndex(prompt => prompt.uid === targetUid);
    if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return;

    const nextPrompts = [...prompts];
    const [moved] = nextPrompts.splice(sourceIndex, 1);
    nextPrompts.splice(targetIndex, 0, moved);

    saveProgramBuilderPromptList(scopeId, nextPrompts);
    renderPanels();
  }

  function updateDirectEditPrompt(scopeId, promptUid, changes) {
    const section = getSectionByScopeId(scopeId);
    if (!section) return;

    const prompts = getProgramBuilderPromptList(scopeId, section).map(prompt =>
      prompt.uid === promptUid ? { ...prompt, ...changes } : prompt
    );
    saveProgramBuilderPromptList(scopeId, prompts);
  }

  function expandProgramBuilderPrompt(scopeId, promptUid) {
    const cards = document.querySelectorAll(`.prompt-card[data-scope-id="${scopeId}"]`);
    if (!cards.length) return;
    const list = cards[0].closest('.prompt-list');
    cards.forEach(card => {
      const isTarget = card.dataset.promptUid === promptUid;
      card.classList.toggle('prompt-card--expanded', isTarget);
      card.classList.toggle('hidden', !isTarget);
      const collapseBtn = card.querySelector('.prompt-collapse-btn');
      const deleteBtn = card.querySelector('.prompt-delete-btn');
      if (collapseBtn) collapseBtn.classList.toggle('hidden', !isTarget);
      if (deleteBtn) deleteBtn.classList.toggle('hidden', isTarget);
    });
    if (list) {
      list.classList.add('prompt-list--single');
    }
  }

  function collapseProgramBuilderPrompt(scopeId) {
    const cards = document.querySelectorAll(`.prompt-card[data-scope-id="${scopeId}"]`);
    if (!cards.length) return;
    const list = cards[0].closest('.prompt-list');
    cards.forEach(card => {
      card.classList.remove('prompt-card--expanded');
      card.classList.remove('hidden');
      const collapseBtn = card.querySelector('.prompt-collapse-btn');
      const deleteBtn = card.querySelector('.prompt-delete-btn');
      if (collapseBtn) collapseBtn.classList.add('hidden');
      if (deleteBtn) deleteBtn.classList.remove('hidden');
    });
    if (list) {
      list.classList.remove('prompt-list--single');
    }
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
        const xlsx = await ensureXlsx();

        const buffer = await file.arrayBuffer();
        const workbook = xlsx.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
        const headerRows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });
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

  function ensureXlsx() {
    if (window.XLSX) return Promise.resolve(window.XLSX);
    if (xlsxLoadPromise) return xlsxLoadPromise;

    xlsxLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      script.async = true;
      script.onload = () => {
        if (window.XLSX) {
          resolve(window.XLSX);
        } else {
          reject(new Error('엑셀 라이브러리를 초기화하지 못했습니다.'));
        }
      };
      script.onerror = () => {
        reject(new Error('엑셀 라이브러리를 내려받지 못했습니다. 인터넷 연결을 확인해 주세요.'));
      };
      document.head.appendChild(script);
    }).catch(error => {
      xlsxLoadPromise = null;
      throw error;
    });

    return xlsxLoadPromise;
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

  function togglePromptEditor(id, editing) {
    const body = document.getElementById(`prompt-${id}`);
    const editor = document.getElementById(`editor-${id}`);
    const editBtn = document.querySelector(`.prompt-edit-btn[data-prompt-id="${id}"]`);
    const saveBtn = document.querySelector(`.prompt-save-btn[data-prompt-id="${id}"]`);
    const cancelBtn = document.querySelector(`.prompt-cancel-btn[data-prompt-id="${id}"]`);
    const row = body ? body.closest('.prompt-body-row') : null;
    const copyBtn = row ? row.querySelector('.copy-btn') : null;
    if (!body || !editor || !editBtn || !saveBtn || !cancelBtn) return;

    body.classList.toggle('hidden', editing);
    editor.classList.toggle('hidden', !editing);
    editBtn.classList.toggle('hidden', editing);
    saveBtn.classList.toggle('hidden', !editing);
    cancelBtn.classList.toggle('hidden', !editing);
    if (row) row.classList.toggle('editing', editing);
    if (copyBtn) copyBtn.classList.toggle('hidden', editing);

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
      ${section.supplement ? `
        <div class="app-link-supplement">
          ${section.supplement.image ? `
            <img
              class="app-link-supplement-image"
              src="${section.supplement.image.src}"
              alt="${escapeHtml(section.supplement.image.alt || '')}"
              loading="lazy"
            >
          ` : ''}
          ${section.supplement.text ? `<p class="app-link-supplement-text">${section.supplement.text}</p>` : ''}
        </div>
      ` : ''}
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
        } else if (btn.dataset.copyInput) {
          const input = document.getElementById(btn.dataset.copyInput);
          text = input ? input.value : '';
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
