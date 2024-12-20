document.getElementById('sidebarToggle').addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    sidebar.classList.toggle('visible');
    content.classList.toggle('shifted');
});