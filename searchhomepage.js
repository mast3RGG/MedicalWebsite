
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
});

function initSearch() {
    createSearchElements();
    
    const searchToggle = document.querySelector('[title="Search"]');
    
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    const searchClose = document.querySelector('.search-close');
    
    if (searchToggle) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(searchToggle)
            document.querySelector('.search-container').classList.toggle('active');
            if (document.querySelector('.search-container').classList.contains('active')) {
                searchInput.focus();
            }
        });
    }
    
    if (searchClose) {
        searchClose.addEventListener('click', function() {
            document.querySelector('.search-container').classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
            searchResults.classList.remove('has-results');
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            if (query.length > 2) {
                performSearch(query);
            } else {
                searchResults.innerHTML = '';
                searchResults.classList.remove('has-results');
            }
        });
        
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.value.trim().length > 0) {
                performSearch(this.value.trim(), true);
            }
        });
    }
    
    document.addEventListener('click', function(e) {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer && !searchContainer.contains(e.target)) {
            if (!e.target.closest('[title="Search"]')) {
                searchContainer.classList.remove('active');
                searchInput.value = '';
                searchResults.innerHTML = '';
                searchResults.classList.remove('has-results');
            }
        }
    });
} 

function createSearchElements() {
    if (!document.querySelector('.search-container')) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        
        const searchGroup = document.createElement('div');
        searchGroup.className = 'search-group';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'search-input';
        searchInput.placeholder = 'Search for services, departments, doctors...';
        
        const searchClose = document.createElement('button');
        searchClose.className = 'search-close';
        searchClose.innerHTML = '✕';
        
        const searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        
        searchGroup.appendChild(searchInput);
        searchGroup.appendChild(searchClose);
        searchContainer.appendChild(searchGroup);
        searchContainer.appendChild(searchResults);
        
        const header = document.querySelector('.header');
        if (header) {
            header.appendChild(searchContainer);
        }
    }
}

function performSearch(query, isEnter = false) {
    const searchResults = document.querySelector('.search-results');
    
    const mockResults = getMockSearchResults(query);
    
    if (mockResults.length > 0) {
        searchResults.innerHTML = '';
        
        mockResults.forEach(result => {
            const resultItem = document.createElement('a');
            resultItem.href = result.link;
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <div class="search-result-title">${result.title}</div>
                ${result.category ? `<div class="search-result-category">${result.category}</div>` : ''}
            `;
            searchResults.appendChild(resultItem);
        });
        
        if (!isEnter) {
            const viewAll = document.createElement('a');
            viewAll.href = `search-results.html?q=${encodeURIComponent(query)}`;
            viewAll.className = 'search-view-all';
            viewAll.textContent = 'View all results';
            searchResults.appendChild(viewAll);
        }
        
        searchResults.classList.add('has-results');
    } else {
        searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
        searchResults.classList.remove('has-results');
    }
}

function getMockSearchResults(query) {
    const allResults = [
        { title: 'Orthopedic Care', category: 'Department', link: 'department.html#orthopedic' },
        { title: 'Cardiology Services', category: 'Department', link: 'department.html#cardiology' },
        { title: 'Dr. Smith', category: 'Neurologist', link: 'aboutus.html#team' },
        { title: 'General Consultation', category: 'Service', link: 'price.html#consultation' },
        { title: 'Preventive Health Screenings', category: 'Service', link: 'price.html#screenings' },
        { title: 'About Our Team', category: 'Page', link: 'aboutus.html#team' },
        { title: 'Contact Information', category: 'Page', link: 'contact.html' },
        { title: 'Blog: Healthy Living Tips', category: 'Blog Post', link: '404.html' }
    ];
    
    // Filter results based on query
    return allResults.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        (item.category && item.category.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 5); // Return first 5 results
}