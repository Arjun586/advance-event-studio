
const state = {
    theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    filter: 'all',
    drag: null,
    taskId: 4
};

const root = document.documentElement;
const playground = document.getElementById('playground');
const taskList = document.getElementById('taskList');
const toolbar = document.getElementById('toolbar');
const logNode = document.getElementById('log');
const form = document.getElementById('taskForm');
const titleInput = document.getElementById('taskTitle');
const metaInput = document.getElementById('taskMeta');
const statusInput = document.getElementById('taskStatus');
const taskCount = document.getElementById('taskCount');
const pointerPosition = document.getElementById('pointerPosition');
const activeFilter = document.getElementById('activeFilter');
const themeToggle = document.getElementById('themeToggle');
const clearLogBtn = document.getElementById('clearLogBtn');
const titleHint = document.getElementById('titleHint');

root.setAttribute('data-theme', state.theme);

function logEvent(type, detail) {
    const item = document.createElement('div');
    item.className = 'log-item';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    item.innerHTML = `<strong>${type}</strong> · ${detail} <span style="color:var(--color-text-muted)">${time}</span>`;
    logNode.prepend(item);
    while (logNode.children.length > 12) logNode.lastElementChild.remove();
}

function updateMetrics() {
    const cards = [...taskList.querySelectorAll('.task-card')];
    const visible = cards.filter(card => !card.hidden).length;
    taskCount.textContent = String(visible);
    activeFilter.textContent = state.filter;
}

function applyFilter(filter) {
    state.filter = filter;
    toolbar.querySelectorAll('.chip').forEach(btn => {
        btn.setAttribute('aria-pressed', String(btn.dataset.filter === filter));
    });
    taskList.querySelectorAll('.task-card').forEach(card => {
        card.hidden = !(filter === 'all' || card.dataset.status === filter);
    });
    updateMetrics();
    logEvent('delegated click', `Filter switched to ${filter}`);
}

function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', state.theme);
    logEvent('keyboard/ui event', `Theme changed to ${state.theme}`);
}

toolbar.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    applyFilter(button.dataset.filter);
});

playground.addEventListener('pointermove', (event) => {
    const rect = playground.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    playground.style.setProperty('--pointer-x', `${x}%`);
    playground.style.setProperty('--pointer-y', `${y}%`);
    pointerPosition.textContent = `${Math.round(event.clientX)}, ${Math.round(event.clientY)}`;
}, { passive: true });

taskList.addEventListener('pointerdown', (event) => {
    const card = event.target.closest('.task-card');
    if (!card) return;
    state.drag = { id: card.dataset.id, startY: event.clientY, card };
    card.classList.add('dragging');
    card.setPointerCapture(event.pointerId);
    logEvent('pointerdown', `Started dragging "${card.querySelector('.task-title').textContent}"`);
});

taskList.addEventListener('pointerup', (event) => {
    const card = event.target.closest('.task-card');
    if (!card || !state.drag) return;
    card.classList.remove('dragging');
    try { card.releasePointerCapture(event.pointerId); } catch { }
    state.drag = null;
    logEvent('pointerup', `Dropped "${card.querySelector('.task-title').textContent}"`);
});

taskList.addEventListener('pointermove', (event) => {
    if (!state.drag) return;
    const draggingCard = state.drag.card;
    const afterElement = [...taskList.querySelectorAll('.task-card:not(.dragging):not([hidden])')]
        .find(card => event.clientY < card.getBoundingClientRect().top + card.offsetHeight / 2);
    if (!afterElement) {
        taskList.appendChild(draggingCard);
    } else {
        taskList.insertBefore(draggingCard, afterElement);
    }
});

form.addEventListener('input', (event) => {
    if (event.target === titleInput) {
        const length = titleInput.value.trim().length;
        if (length < 4) {
            titleHint.textContent = `Need ${4 - length} more character(s).`;
            titleHint.style.color = 'var(--color-warning)';
        } else {
            titleHint.textContent = 'Looks good. Ready to submit.';
            titleHint.style.color = 'var(--color-success)';
        }
    }
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = titleInput.value.trim();
    const meta = metaInput.value.trim() || 'No meta info provided';
    const status = statusInput.value;
    if (title.length < 4) {
        titleHint.textContent = 'Title is too short.';
        titleHint.style.color = 'var(--color-error)';
        logEvent('submit blocked', 'Validation prevented form submission');
        titleInput.focus();
        return;
    }
    const article = document.createElement('article');
    article.className = 'task-card';
    article.dataset.status = status;
    article.dataset.id = String(state.taskId++);
    article.innerHTML = `
        <div class="drag-handle" title="Drag task" aria-hidden="true">⋮⋮</div>
        <div>
          <div class="task-title"></div>
          <div class="task-meta"></div>
        </div>
        <span class="status ${status}">${status}</span>
      `;
    article.querySelector('.task-title').textContent = title;
    article.querySelector('.task-meta').textContent = meta;
    taskList.prepend(article);
    form.reset();
    titleHint.textContent = '4-60 characters. Press / to focus here.';
    titleHint.style.color = 'var(--color-text-muted)';
    applyFilter(state.filter);
    logEvent('submit', `Created task "${title}"`);
});

document.addEventListener('keydown', (event) => {
    if (event.target.matches('input, textarea, select') && event.key !== '/') return;
    if (event.key.toLowerCase() === 'n') {
        event.preventDefault();
        titleInput.focus();
        logEvent('shortcut', 'Focused title input with N');
    }
    if (event.key === '/') {
        event.preventDefault();
        titleInput.focus();
        logEvent('shortcut', 'Focused title input with /');
    }
    if (event.key.toLowerCase() === 'd') {
        event.preventDefault();
        toggleTheme();
    }
    if (event.key.toLowerCase() === 'l') {
        event.preventDefault();
        logNode.innerHTML = '';
        logEvent('shortcut', 'Cleared interaction log');
    }
});

themeToggle.addEventListener('click', toggleTheme);
clearLogBtn.addEventListener('click', () => {
    logNode.innerHTML = '';
    logEvent('ui event', 'Cleared interaction log');
});

applyFilter('all');
updateMetrics();
logEvent('init', 'App booted with delegated, pointer, keyboard, and form events');
