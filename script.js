// app state and sample task data
const state = {
    theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    activeFilter: 'All',
    tasks: [
        {
        id: 1,
        type: 'UI',
        title: 'Build board toolbar',
        description: 'Create filter chips and a clean header layout for the board.'
        },
        {
        id: 2,
        type: 'API',
        title: 'Connect tasks endpoint',
        description: 'Prepare the frontend structure for future fetch integration.'
        },
        {
        id: 3,
        type: 'Bug',
        title: 'Fix mobile spacing',
        description: 'Check padding and stacked layout on smaller screens.'
        },
        {
        id: 4,
        type: 'UI',
        title: 'Add empty state style',
        description: 'Design a polished fallback when there are no tasks.'
        }
    ]
};

// elements we need from the page
const taskGrid = document.getElementById('taskGrid');
const themeToggle = document.getElementById('themeToggle');
const selectedFilterText = document.getElementById('selectedFilterText');
const filterButtons = document.querySelectorAll('.chip');
const totalTasksText = document.getElementById('totalTasksText');
const taskForm = document.getElementById('taskForm');
const taskTitleInput = document.getElementById('taskTitle');
const taskTypeInput = document.getElementById('taskType');
const taskDescriptionInput = document.getElementById('taskDescription');

// apply the current theme when the page loads
document.documentElement.setAttribute('data-theme', state.theme);

// switch between light and dark theme
themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
});

// update the active filter when a chip is clicked
filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        state.activeFilter = button.dataset.filter;
        updateActiveChip();
        renderTasks();
    });
});

// highlight the selected filter chip
function updateActiveChip() {
    filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === state.activeFilter;
        button.classList.toggle('chip-active', isActive);
    });
}

// return tasks based on the current filter
function getFilteredTasks() {
    if (state.activeFilter === 'All') {
        return state.tasks;
    }

    return state.tasks.filter((task) => task.type === state.activeFilter);
}

// draw the task cards on the page
function renderTasks() {
    const filteredTasks = getFilteredTasks();

    selectedFilterText.textContent = state.activeFilter;
    totalTasksText.textContent = state.tasks.length;

    if (filteredTasks.length === 0) {
        taskGrid.innerHTML = `
        <div class="empty-box">
            <h3>No tasks found</h3>
            <p>Try another filter or create a new task.</p>
        </div>
        `;
        return;
    }

    taskGrid.innerHTML = filteredTasks
        .map((task) => {
        return `
            <article class="task-card">
            <span class="task-badge">${task.type}</span>
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            </article>
        `;
        })
        .join('');
}

// create a new task from the form
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = taskTitleInput.value.trim();
    const type = taskTypeInput.value;
    const description = taskDescriptionInput.value.trim();

    if (!title || !description) {
        alert('Please fill title and notes.');
        return;
    }

    const newTask = {
        id: Date.now(),
        type,
        title,
        description
    };

    state.tasks.unshift(newTask);
    state.activeFilter = 'All';

    taskForm.reset();
    updateActiveChip();
    renderTasks();
});

// show tasks on the first page load
renderTasks();