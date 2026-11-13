/**
 * Developer's Dashboard - Phase 1
 * Main dashboard logic with tool navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = '☀️ Light Mode';
    }

    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.textContent = '🌙 Dark Mode';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.textContent = '☀️ Light Mode';
        }
    });

    // Open Tool Navigation
    const openToolButtons = document.querySelectorAll('.open-tool');

    openToolButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const toolName = e.currentTarget.closest('.tool-card').dataset.tool;
            window.location.href = `tools/${toolName}.html`;
        });
    });

    console.log('🚀 Developer Dashboard initialized!');
    console.log('Theme:', currentTheme);
});