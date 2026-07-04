document.addEventListener('DOMContentLoaded', () => {
    const tabSites = document.getElementById('tab-sites');
    const tabCategories = document.getElementById('tab-categories');
    const viewSites = document.getElementById('view-sites');
    const viewCategories = document.getElementById('view-categories');

    const sitesGrid = document.getElementById('sites-grid');
    const siteTemplate = document.getElementById('site-item-template');
    const formSite = document.getElementById('form-site');
    const siteNameInput = document.getElementById('site-name-input');
    const siteUrlInput = document.getElementById('site-url-input');
    const siteCategorySelect = document.getElementById('site-category-select');

    const categoriesListContainer = document.getElementById('categories-list-container');
    const categoryTemplate = document.getElementById('category-item-template');
    const formCategory = document.getElementById('form-category');
    const categoryNameInput = document.getElementById('category-name-input');

    function switchView(hash) {
        const isCat = hash === '#categories';
        viewSites.classList.toggle('hidden', isCat);
        viewCategories.classList.toggle('hidden', !isCat);
        isCat ? loadCategories() : loadSites();
    }

    tabSites.addEventListener('click', () => {
        window.location.hash = 'sites';
    });

    tabCategories.addEventListener('click', () => {
        window.location.hash = 'categories';
    });

    window.addEventListener('hashchange', () => {
        switchView(window.location.hash);
    });

    switchView(window.location.hash);

    function loadSites() {
        const items = sitesGrid.querySelectorAll('.site-card');
        items.forEach(el => el.remove());

        fetch('/api/sites')
            .then(res => res.json())
            .then(data => {
                data.forEach(site => {
                    const clone = siteTemplate.cloneNode(true);
                    clone.removeAttribute('id');
                    clone.classList.remove('hidden');

                    clone.querySelector('.site-name').textContent = site.name;
                    clone.querySelector('.site-category-badge').textContent = site.category_name;
                    clone.querySelector('.site-url').href = site.url;

                    clone.querySelector('.btn-delete-site').addEventListener('click', () => {
                        if (confirm(`¿Eliminar el sitio "${site.name}"?`)) {
                            deleteSite(site.id);
                        }
                    });

                    sitesGrid.appendChild(clone);
                });

                loadCategoriesDropdown();
            });
    }

    function loadCategoriesDropdown() {
        siteCategorySelect.innerHTML = '<option value="" disabled selected>Seleccionar...</option>';
        
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                data.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.id;
                    option.textContent = cat.name;
                    siteCategorySelect.appendChild(option);
                });
            });
    }

    function deleteSite(id) {
        fetch(`/api/sites/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => loadSites());
    }

    formSite.addEventListener('submit', (e) => {
        e.preventDefault();

        fetch('/api/sites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: siteNameInput.value.trim(),
                url: siteUrlInput.value.trim(),
                category_id: siteCategorySelect.value
            })
        })
        .then(res => res.json())
        .then(() => {
            formSite.reset();
            loadSites();
        });
    });

    function loadCategories() {
        categoriesListContainer.innerHTML = '';

        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                data.forEach(cat => {
                    const clone = categoryTemplate.cloneNode(true);
                    clone.removeAttribute('id');
                    clone.classList.remove('hidden');

                    clone.querySelector('.category-name').textContent = cat.name;

                    clone.querySelector('.btn-delete-category').addEventListener('click', () => {
                        if (confirm(`¿Eliminar la categoría "${cat.name}"?`)) {
                            deleteCategory(cat.id);
                        }
                    });

                    categoriesListContainer.appendChild(clone);
                });
            });
    }

    function deleteCategory(id) {
        fetch(`/api/categories/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    loadCategories();
                } else {
                    alert(data.message || 'La categoría está en uso por uno o más sitios.');
                }
            });
    }

    formCategory.addEventListener('submit', (e) => {
        e.preventDefault();

        fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: categoryNameInput.value.trim() })
        })
        .then(res => res.json())
        .then(() => {
            formCategory.reset();
            loadCategories();
        });
    });
});
