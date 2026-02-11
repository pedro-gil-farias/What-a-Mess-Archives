// Main application logic

// Determine base path (for GitHub Pages compatibility)
const basePath = window.location.pathname.includes('What-a-Mess-Archives') 
    ? '/What-a-Mess-Archives/'
    : '/';

// Data storage
let specimens = [];
let aggregates = [];
let currentSort = 'id';
let currentDirection = 'asc';

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
    setupSorting();
    applySort();
    renderAggregates();
    setupNavigation();
    setupModal();
}

// Render specimen cards (minimal: image only)
function renderSpecimens(specimensList = specimens) {
    specimensGrid.innerHTML = specimensList.map(specimen => `
        <div class="card" data-type="specimen" data-id="${specimen.id}">
            <img src="${basePath}${specimen.thumbnail}" ${specimen.gifPath ? `data-gif="${basePath}${specimen.gifPath}"` : ''} alt="${specimen.title}" class="card-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22280%22%3E%3Crect fill=%22%23f5f2ed%22 width=%22400%22 height=%22280%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22monospace%22 font-size=%2216%22 fill=%22%236b6560%22%3E3D Model Placeholder%3C/text%3E%3C/svg%3E'">
        </div>
    `).join('');

    if (specimensList.length === 0) {
        specimensGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-lg); color: var(--color-text-light);">No specimens available.</p>';
    }

    // Add hover listeners for image/gif swap
    specimensGrid.querySelectorAll('.card-image').forEach(img => {
        const gifPath = img.getAttribute('data-gif');
        const originalSrc = img.src;
        
        img.addEventListener('mouseenter', () => {
            if (gifPath) img.src = gifPath;
        });
        
        img.addEventListener('mouseleave', () => {
            img.src = originalSrc;
        });
    });
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

// Setup sorting
function setupSorting() {
    const sortBtns = document.querySelectorAll('.sort-btn');
    sortBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Use the button element so clicks on inner SVGs still work
            const newSort = btn.getAttribute('data-sort');

            if (newSort === 'random') {
                // Always select random and reshuffle (no asc/desc toggle)
                currentSort = 'random';
                currentDirection = 'asc';
            } else {
                // If same button clicked, toggle direction
                if (currentSort === newSort) {
                    currentDirection = currentDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    // New button, reset to ascending
                    currentSort = newSort;
                    currentDirection = 'asc';
                }
            }

            updateSortUI();
            applySort();
        });
    });
    
    // Set initial active button
    updateSortUI();
}

// Update sort button UI
function updateSortUI() {
    const sortBtns = document.querySelectorAll('.sort-btn');
    const directionDisplay = document.getElementById('sort-direction-display');
    
    sortBtns.forEach(btn => {
        if (btn.getAttribute('data-sort') === currentSort) {
            btn.classList.add('active');
            if (currentSort === 'random') {
                btn.setAttribute('data-direction', '⟳');
            } else {
                btn.setAttribute('data-direction', currentDirection === 'asc' ? '↑' : '↓');
            }
        } else {
            btn.classList.remove('active');
            btn.removeAttribute('data-direction');
        }
    });
    
    // Update direction indicator
    if (directionDisplay) {
        directionDisplay.textContent = currentDirection === 'asc' ? '↑' : '↓';
    }
}

// Apply sort
function applySort() {
    let sorted = [...specimens];
    const isAscending = currentDirection === 'asc';
    
    switch (currentSort) {
        case 'id':
            sorted.sort((a, b) => isAscending 
                ? a.id.localeCompare(b.id)
                : b.id.localeCompare(a.id));
            break;
        case 'date':
            sorted.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return isAscending ? dateA - dateB : dateB - dateA;
            });
            break;
        case 'latitude':
            sorted.sort((a, b) => {
                const latA = parseFloat(a.latitude || 0);
                const latB = parseFloat(b.latitude || 0);
                return isAscending ? latA - latB : latB - latA;
            });
            break;
        case 'longitude':
            sorted.sort((a, b) => {
                const lonA = parseFloat(a.longitude || 0);
                const lonB = parseFloat(b.longitude || 0);
                return isAscending ? lonA - lonB : lonB - lonA;
            });
            break;
        case 'random':
            // Fisher-Yates shuffle for random ordering
            for (let i = sorted.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
            }
            break;
    }
    
    renderSpecimens(sorted);
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
                shadow-intensity="0"
                camera-orbit="-45deg 55deg 15m"
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
                    <div class="meta-label">Latitude</div>
                    <div class="meta-value">${specimen.latitude}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Longitude</div>
                    <div class="meta-value">${specimen.longitude}</div>
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

// Setup specimen submission form (Formspree Integration)
function setupSubmissionForm() {
    const form = document.getElementById('specimen-form');
    const messageDiv = document.getElementById('form-message');
    
    if (!form) return;

    // Check if Formspree form ID is configured
    const formAction = form.getAttribute('action');
    if (formAction.includes('YOUR_FORM_ID')) {
        messageDiv.textContent = '⚠ Form not configured yet. See SUBMISSION_SETUP.md';
        messageDiv.classList.add('show', 'error');
        form.querySelector('.btn-submit').disabled = true;
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        try {
            // Use Formspree's AJAX submission
            const formData = new FormData(form);
            
            const response = await fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show success message
                messageDiv.innerHTML = '✓ <strong>Thank you!</strong> Your submission has been received. We\'ll review it and add it to the archive soon.';
                messageDiv.classList.add('show', 'success');
                messageDiv.classList.remove('error');
                
                // Reset form
                form.reset();
                
                // Keep message visible longer for file uploads
                setTimeout(() => {
                    messageDiv.classList.remove('show');
                }, 8000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            messageDiv.textContent = '✗ Error submitting specimen. Please try again or contact us directly.';
            messageDiv.classList.add('show', 'error');
            messageDiv.classList.remove('success');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Load data and initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupSubmissionForm();
});

