// Main application logic

// Determine base path (for GitHub Pages compatibility)
const basePath = window.location.pathname.includes('What-a-Mess-Archives') 
    ? '/What-a-Mess-Archives/'
    : '/';

// Data storage
let specimens = [];
let aggregates = [];

// DOM elements
const specimensGrid = document.getElementById('specimens-grid');
const aggregatesGrid = document.getElementById('aggregates-grid');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch(`${basePath}js/data.json`);
        if (!response.ok) throw new Error('Failed to load data');
        const data = await response.json();
        specimens = data.specimens;
        aggregates = data.aggregates;
        init();
    } catch (error) {
        console.error('Error loading data:', error);
        specimensGrid.innerHTML = '<p>Error loading specimens data</p>';
        aggregatesGrid.innerHTML = '<p>Error loading aggregates data</p>';
    }
}

// Initialize the app
function init() {
    renderSpecimens();
    renderAggregates();
    setupNavigation();
    setupModal();
}

// Render specimen cards
function renderSpecimens() {
    specimensGrid.innerHTML = specimens.map(specimen => `
        <div class="card" data-type="specimen" data-id="${specimen.id}">
            <img src="${basePath}${specimen.thumbnail}" alt="${specimen.title}" class="card-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22280%22%3E%3Crect fill=%22%23f5f2ed%22 width=%22400%22 height=%22280%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22monospace%22 font-size=%2216%22 fill=%22%236b6560%22%3E3D Model Placeholder%3C/text%3E%3C/svg%3E'">
            <div class="card-content">
                <h3 class="card-title">${specimen.title}</h3>
                <div class="card-meta">${specimen.location} • ${formatDate(specimen.date)}</div>
                <p class="card-description">${specimen.description}</p>
                <div class="card-tags">
                    ${specimen.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Render aggregate cards
function renderAggregates() {
    aggregatesGrid.innerHTML = aggregates.map(aggregate => `
        <div class="card" data-type="aggregate" data-id="${aggregate.id}">
            <img src="${basePath}${aggregate.thumbnail}" alt="${aggregate.title}" class="card-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22280%22%3E%3Crect fill=%22%23f5f2ed%22 width=%22400%22 height=%22280%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22monospace%22 font-size=%2216%22 fill=%22%236b6560%22%3EAggregate Collection%3C/text%3E%3C/svg%3E'">
            <div class="card-content">
                <h3 class="card-title">${aggregate.title}</h3>
                <div class="card-meta">${aggregate.specimenIds.length} specimens • ${formatDate(aggregate.dateCreated)}</div>
                <p class="card-description">${aggregate.description}</p>
                <div class="card-tags">
                    ${aggregate.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Setup navigation
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            
            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            sections.forEach(section => {
                if (section.id === targetSection) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });
}

// Setup modal functionality
function setupModal() {
    // Open modal when card is clicked
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (card) {
            const type = card.getAttribute('data-type');
            const id = card.getAttribute('data-id');
            
            if (type === 'specimen') {
                openSpecimenModal(id);
            } else if (type === 'aggregate') {
                openAggregateModal(id);
            }
        }
    });
    
    // Close modal
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Open specimen detail modal
function openSpecimenModal(id) {
    const specimen = specimens.find(s => s.id === id);
    if (!specimen) return;
    
    modalBody.innerHTML = `
        <div class="detail-viewer">
            <model-viewer
                src="${basePath}${specimen.modelPath}"
                alt="${specimen.title}"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                loading="eager">
            </model-viewer>
        </div>
        <div class="detail-info">
            <div class="detail-main">
                <h2>${specimen.title}</h2>
                <p>${specimen.description}</p>
                <div class="card-tags">
                    ${specimen.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="detail-meta">
                <div class="meta-item">
                    <div class="meta-label">Location</div>
                    <div class="meta-value">${specimen.location}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Date Scanned</div>
                    <div class="meta-value">${formatDate(specimen.date)}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Coordinates</div>
                    <div class="meta-value">${specimen.coordinates}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Specimen ID</div>
                    <div class="meta-value">${specimen.id}</div>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Open aggregate detail modal
function openAggregateModal(id) {
    const aggregate = aggregates.find(a => a.id === id);
    if (!aggregate) return;
    
    const aggregateSpecimens = specimens.filter(s => 
        aggregate.specimenIds.includes(s.id)
    );
    
    modalBody.innerHTML = `
        <div class="detail-info">
            <div class="detail-main">
                <h2>${aggregate.title}</h2>
                <p>${aggregate.description}</p>
                <div class="card-tags">
                    ${aggregate.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="detail-meta">
                <div class="meta-item">
                    <div class="meta-label">Curated By</div>
                    <div class="meta-value">${aggregate.curatedBy}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Date Created</div>
                    <div class="meta-value">${formatDate(aggregate.dateCreated)}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Total Specimens</div>
                    <div class="meta-value">${aggregate.specimenIds.length}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Aggregate ID</div>
                    <div class="meta-value">${aggregate.id}</div>
                </div>
            </div>
        </div>
        <div class="aggregate-specimens">
            <h3>Included Specimens</h3>
            <div class="specimens-list">
                ${aggregateSpecimens.map(specimen => `
                    <a href="#" class="specimen-link" data-specimen-id="${specimen.id}">
                        <div style="font-weight: 600; margin-bottom: 0.25rem;">${specimen.title}</div>
                        <div style="font-size: 0.85rem; color: var(--color-text-light);">${specimen.location}</div>
                    </a>
                `).join('')}
            </div>
        </div>
    `;
    
    // Add click handlers for specimen links
    modalBody.querySelectorAll('.specimen-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const specimenId = link.getAttribute('data-specimen-id');
            openSpecimenModal(specimenId);
        });
    });
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Format date helper
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Load data and initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadData);
