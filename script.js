// app state and sample task data
const state = {
    theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    activeFilter: 'All',
    tasks: [
        {
        id: 1,
        type: 'UI',
        title: 'Build board toolbar',
        description: 'Create filter chips and a clean header layout for the board.',
        completed: false,
        },
        {
        id: 2,
        type: 'API',
        title: 'Connect tasks endpoint',
        description: 'Prepare the frontend structure for future fetch integration.',
        completed: false,
        },
        {
        id: 3,
        type: 'Bug',
        title: 'Fix mobile spacing',
        description: 'Check padding and stacked layout on smaller screens.',
        completed: false,
        },
        {
        id: 4,
        type: 'UI',
        title: 'Add empty state style',
        description: 'Design a polished fallback when there are no tasks.',
        completed: false,
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
const completedTasksText = document.getElementById('completedTasksText');

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
// return tasks based on the current filter
function getFilteredTasks() {
    if (state.activeFilter === 'All') {
        return state.tasks;
    }

    if (state.activeFilter === 'Active') {
        return state.tasks.filter((task) => !task.completed);
    }

    if (state.activeFilter === 'Completed') {
        return state.tasks.filter((task) => task.completed);
    }

    return state.tasks;
}

// draw the task cards on the page
function renderTasks() {
    const filteredTasks = getFilteredTasks();

    selectedFilterText.textContent = state.activeFilter;
    totalTasksText.textContent = state.tasks.length;
    const completedCount = state.tasks.filter((task) => task.completed).length;
    completedTasksText.textContent = completedCount;

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
            <article class="task-card ${task.completed ? 'task-done' : ''}">
                <button class="delete-btn" data-id="${task.id}" type="button">×</button>
                <button class="complete-btn" data-id="${task.id}" type="button">
                    ${task.completed ? 'Undo' : 'Done'}
                </button>
                <button class="edit-btn" data-id="${task.id}" type="button">Edit</button>
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


// remove a task when delete button is clicked
taskGrid.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.delete-btn');

    if (!deleteButton) {
        return;
    }

    const taskId = Number(deleteButton.dataset.id);

    state.tasks = state.tasks.filter((task) => task.id !== taskId);
    renderTasks();
});

// edit task title when edit button is clicked
taskGrid.addEventListener('click', (event) => {
    const editButton = event.target.closest('.edit-btn');

    if (!editButton) {
        return;
    }

    const taskId = Number(editButton.dataset.id);
    const taskToEdit = state.tasks.find((task) => task.id === taskId);

    if (!taskToEdit) {
        return;
    }

    const newTitle = prompt('Edit task title:', taskToEdit.title);

    if (!newTitle || !newTitle.trim()) {
        return;
    }

    state.tasks = state.tasks.map((task) => {
        if (task.id === taskId) {
        return { ...task, title: newTitle.trim() };
        }

        return task;
    });

    renderTasks();
});

// toggle completed state when done button is clicked
taskGrid.addEventListener('click', (event) => {
    const completeButton = event.target.closest('.complete-btn');

    if (!completeButton) {
        return;
    }

    const taskId = Number(completeButton.dataset.id);

    state.tasks = state.tasks.map((task) => {
        if (task.id === taskId) {
        return { ...task, completed: !task.completed };
        }

        return task;
    });

    renderTasks();
});

// show tasks on the first page load
renderTasks();