
const state = {
    theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
};


document.documentElement.setAttribute('data-theme', state.theme);

// Wire up the toggle button
document.getElementById('themeToggle').addEventListener('click', () => {
    // Flip the theme
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
});

