// Main application logic for data loading, UI rendering, and modal interactions.

// Determine base path (for GitHub Pages compatibility).
const basePath = window.location.pathname.includes('What-a-Mess-Archives') 
    ? '/What-a-Mess-Archives/'
    : '/';

// In-memory data/state.
let specimens = [];
let aggregates = [];
let currentSort = 'id';
let currentDirection = 'asc';
let currentAggregateSort = 'id';
let currentAggregateDirection = 'asc';
let collageIntervalId = null;

// Cached DOM elements for performance and reuse.
const specimensGrid = document.getElementById('specimens-grid');
const aggregatesGrid = document.getElementById('aggregates-grid');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const headerSortControls = document.getElementById('header-sort-controls');
const headerAggregateSortControls = document.getElementById('header-aggregate-sort-controls');
const headerCarouselControls = document.getElementById('header-carousel-controls');

// Load data from JSON files and kick off the app.
async function loadData() {
    try {
        const [specimensResponse, aggregatesResponse] = await Promise.all([
            fetch(`${basePath}js/specimens.json`),
            fetch(`${basePath}js/aggregates.json`)
        ]);
        if (!specimensResponse.ok) throw new Error('Failed to load specimens');
        if (!aggregatesResponse.ok) throw new Error('Failed to load aggregates');

        const specimensData = await specimensResponse.json();
        const aggregatesData = await aggregatesResponse.json();
        specimens = specimensData.specimens;
        aggregates = aggregatesData.aggregates;
        init();
    } catch (error) {
        console.error('Error loading data:', error);
        specimensGrid.innerHTML = '<p>Error loading specimens data</p>';
        aggregatesGrid.innerHTML = '<p>Error loading aggregates data</p>';
    }
}

// Initialize the app UI and event handlers.
function init() {
    setupSorting();
    applySort();
    setupAggregateSorting();
    applyAggregateSort();
    setupCarousel();
    setupNavigation();
    setupModal();
    updateHeaderSortVisibility(getActiveSectionId());
    handleDeepLink(); // Handle initial URL
}

function getActiveSectionId() {
    const activeSection = document.querySelector('.section.active');
    return activeSection ? activeSection.id : 'specimens';
}

function updateHeaderSortVisibility(sectionId) {
    if (headerSortControls) {
        headerSortControls.style.display = sectionId === 'specimens' ? 'flex' : 'none';
    }
    if (headerAggregateSortControls) {
        headerAggregateSortControls.style.display = sectionId === 'aggregates' ? 'flex' : 'none';
    }
    if (headerCarouselControls) {
        headerCarouselControls.style.display = sectionId === 'carousel' ? 'flex' : 'none';
    }
    const carouselCaption = document.getElementById('carousel-caption');
    if (carouselCaption) {
        carouselCaption.style.display = sectionId === 'carousel' ? 'block' : 'none';
    }
}

// Render specimen cards (minimal: image only).
function renderSpecimens(specimensList = specimens) {
    specimensGrid.innerHTML = specimensList.map(specimen => `
        <div class="card" data-type="specimen" data-id="${specimen.id}">
            <img src="${basePath}${specimen.thumbnail}" ${specimen.gifPath ? `data-gif="${basePath}${specimen.gifPath}"` : ''} alt="${specimen.title}" class="card-image">
            <div class="card-fallback" aria-hidden="true">${specimen.title}</div>
            <div class="card-id">${specimen.id}</div>
            <div class="card-date">${formatDate(specimen.date)}</div>
        </div>
    `).join('');

    if (specimensList.length === 0) {
        specimensGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-lg); color: var(--color-text-light);">No specimens available.</p>';
    }

    // Add hover listeners for image/gif swap and fallback for missing images.
    specimensGrid.querySelectorAll('.card-image').forEach(img => {
        const gifPath = img.getAttribute('data-gif');
        const originalSrc = img.src;
        const card = img.closest('.card');

        img.addEventListener('error', () => {
            img.dataset.hasError = 'true';
            if (card) card.classList.add('missing-image');
        });
        
        img.addEventListener('mouseenter', () => {
            if (gifPath && !img.dataset.hasError) img.src = gifPath;
        });
        
        img.addEventListener('mouseleave', () => {
            if (!img.dataset.hasError) img.src = originalSrc;
        });
    });
}

// Render aggregate cards.
function renderAggregates(aggregatesList = aggregates) {
    aggregatesGrid.innerHTML = aggregatesList.map(aggregate => `
        <div class="card" data-type="aggregate" data-id="${aggregate.id}">
            <img src="${basePath}${aggregate.thumbnail}" alt="${aggregate.title}" class="card-image">
            <div class="card-fallback" aria-hidden="true">${aggregate.title}</div>
            <div class="card-id">${aggregate.id}</div>
            <div class="card-date">${formatDate(aggregate.dateCreated)}</div>
        </div>
    `).join('');

    if (aggregatesList.length === 0) {
        aggregatesGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-lg); color: var(--color-text-light);">No aggregates available.</p>';
    }

    aggregatesGrid.querySelectorAll('.card-image').forEach(img => {
        const card = img.closest('.card');
        img.addEventListener('error', () => {
            img.dataset.hasError = 'true';
            if (card) card.classList.add('missing-image');
        });
    });
}

// Setup navigation tab switching.
function setupNavigation() {
    // Function to switch to a section
    function switchToSection(targetSection) {
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(section => {
            if (section.id === targetSection) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        updateHeaderSortVisibility(targetSection);
        // Update active nav link
        navLinks.forEach(link => {
            if (link.getAttribute('data-section') === targetSection) {
                link.classList.add('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            switchToSection(targetSection);
            // Update URL without page reload
            window.history.pushState({ section: targetSection }, '', `#${targetSection}`);
            
            // Stop carousel autoplay if leaving carousel section, start if entering
            if (targetSection === 'carousel') {
                startCarouselAutoplay();
            } else {
                stopCarouselAutoplay();
            }
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
        handleDeepLink();
    });

    // Handle initial page load with hash
    const initialHash = window.location.hash.slice(1);
    if (initialHash && document.getElementById(initialHash)) {
        switchToSection(initialHash);
        if (initialHash === 'carousel') {
            startCarouselAutoplay();
        }
    }
}

// Handle deep links for sections and modals
function handleDeepLink() {
    const hash = window.location.hash.slice(1); // Remove the #
    
    if (!hash) {
        // No hash, show default section
        return;
    }
    
    // Check if it's a modal deep link (format: section/id)
    const parts = hash.split('/');
    
    if (parts.length === 2) {
        const [section, id] = parts;
        
        // Switch to the correct section first
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(sec => {
            if (sec.id === section) {
                sec.classList.add('active');
            } else {
                sec.classList.remove('active');
            }
        });
        navLinks.forEach(link => {
            if (link.getAttribute('data-section') === section) {
                link.classList.add('active');
            }
        });
        updateHeaderSortVisibility(section);
        
        // Open the modal
        if (section === 'specimens') {
            openSpecimenModal(id, true);
        } else if (section === 'aggregates') {
            openAggregateModal(id, true);
        }
    } else if (parts.length === 1) {
        // Just a section, ensure modal is closed
        closeModal(true);
        
        // Switch to section
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(section => {
            if (section.id === hash) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        navLinks.forEach(link => {
            if (link.getAttribute('data-section') === hash) {
                link.classList.add('active');
            }
        });
        updateHeaderSortVisibility(hash);
    }
}

// Setup sorting controls.
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

// Update sort button UI to reflect current state.
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

// Apply sort to specimens and render.
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

// Setup aggregate sorting controls
function setupAggregateSorting() {
    const sortBtns = document.querySelectorAll('.aggregate-sort-btn');
    sortBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const newSort = btn.getAttribute('data-sort');

            if (newSort === 'random') {
                currentAggregateSort = 'random';
                currentAggregateDirection = 'asc';
            } else {
                if (currentAggregateSort === newSort) {
                    currentAggregateDirection = currentAggregateDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    currentAggregateSort = newSort;
                    currentAggregateDirection = 'asc';
                }
            }

            updateAggregateSortUI();
            applyAggregateSort();
        });
    });
    
    updateAggregateSortUI();
}

// Update aggregate sort button UI
function updateAggregateSortUI() {
    const sortBtns = document.querySelectorAll('.aggregate-sort-btn');
    
    sortBtns.forEach(btn => {
        if (btn.getAttribute('data-sort') === currentAggregateSort) {
            btn.classList.add('active');
            if (currentAggregateSort === 'random') {
                btn.setAttribute('data-direction', '⟳');
            } else {
                btn.setAttribute('data-direction', currentAggregateDirection === 'asc' ? '↑' : '↓');
            }
        } else {
            btn.classList.remove('active');
            btn.removeAttribute('data-direction');
        }
    });
}

// Apply sort to aggregates and render
function applyAggregateSort() {
    let sorted = [...aggregates];
    const isAscending = currentAggregateDirection === 'asc';
    
    switch (currentAggregateSort) {
        case 'id':
            sorted.sort((a, b) => isAscending 
                ? a.id.localeCompare(b.id)
                : b.id.localeCompare(a.id));
            break;
        case 'date':
            sorted.sort((a, b) => {
                const dateA = new Date(a.dateCreated);
                const dateB = new Date(b.dateCreated);
                return isAscending ? dateA - dateB : dateB - dateA;
            });
            break;
        case 'random':
            for (let i = sorted.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
            }
            break;
    }
    
    renderAggregates(sorted);
}

// Setup modal open/close behavior.
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

// Open specimen detail modal and show a model-viewer preview.
function openSpecimenModal(id, skipHistory = false) {
    const specimen = specimens.find(s => s.id === id);
    if (!specimen) return;

    const specimenAggregates = aggregates.filter(aggregate =>
        aggregate.specimenIds.includes(specimen.id)
    );
    
    modalBody.innerHTML = `
        <div class="detail-viewer">
            <model-viewer
                src="${basePath}${specimen.modelPath}"
                alt="${specimen.title}"
                camera-controls
                auto-rotate
                shadow-intensity="0"
                camera-orbit="-45deg 55deg 15m"
                min-camera-orbit="auto auto 1m"
                loading="eager">
            </model-viewer>
        </div>
        <div class="detail-info">
            <div class="detail-main">
                <h2>${specimen.title}</h2>
                <p>${specimen.description}</p>

                <div class="detail-main">
                <div class="meta-value">
                        <a href="${basePath}${specimen.modelPath}" download class="download-link">Download file</a>
                </div>
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

                <div class="meta-item">
                    <div class="meta-label">Aggregates</div>
                    <div class="meta-value">
                        ${specimenAggregates.length ? specimenAggregates.map(aggregate => `
                            <a href="#" data-aggregate-id="${aggregate.id}">${aggregate.id}</a>
                        `).join('') : '<span>None</span>'}
                    </div>
                </div>
            </div>
        </div>
    `;

    modalBody.querySelectorAll('[data-aggregate-id]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const aggregateId = link.getAttribute('data-aggregate-id');
            openAggregateModal(aggregateId);
        });
    });
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Update URL
    if (!skipHistory) {
        window.history.pushState({ type: 'specimen', id: id }, '', `#specimens/${id}`);
    }
}

// Open aggregate detail modal and assemble a Three.js collage.
function openAggregateModal(id, skipHistory = false) {
    const aggregate = aggregates.find(a => a.id === id);
    if (!aggregate) return;
    

    // Resolve the specimens belonging to this aggregate.
    const aggregateSpecimens = specimens.filter(s =>
        aggregate.specimenIds.includes(s.id)
    );
    
    modalBody.innerHTML = `
        <div class="detail-viewer">
            <div id="dustball-collage" class="dustball-collage"></div>
        </div>
        <div class="detail-info">
            <div class="detail-main">
                <h2>${aggregate.title}</h2>
                <p>${aggregate.description}</p>
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
                <div class="meta-item">
                    <div class="meta-label">Specimens</div>
                    <div class="meta-value">${aggregateSpecimens.map(specimen => `
                    <a href="#" data-specimen-id="${specimen.id}">${specimen.id}</a>
                    `).join('')}</div>
                </div>
            </div>
        </div>
    `;

    // Add click handlers for specimen links in the aggregate view.
    modalBody.querySelectorAll('[data-specimen-id]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const specimenId = link.getAttribute('data-specimen-id');
            openSpecimenModal(specimenId);
        });
    });

    // --- Three.js Dustball Collage ---
    // Use ES module builds to avoid MIME type blocking on classic scripts.
    // Load a module from a primary CDN, then try fallback on failure.
    async function loadModuleWithFallback(primary, fallback) {
        try {
            return await import(primary);
        } catch (err) {
            console.warn(`Primary module failed (${primary}), attempting fallback`, err);
            if (!fallback) throw err;
            return await import(fallback);
        }
    }

    // Load and cache Three.js modules so we only fetch them once.
    async function ensureThreeModules() {
        if (window.__threeModules) return window.__threeModules;

        const THREE = await loadModuleWithFallback(
            'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js',
            'https://esm.sh/three@0.152.2'
        );

        const { GLTFLoader } = await loadModuleWithFallback(
            'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/GLTFLoader.js',
            'https://esm.sh/three@0.152.2/examples/jsm/loaders/GLTFLoader.js'
        );

        const { OrbitControls } = await loadModuleWithFallback(
            'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/OrbitControls.js',
            'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js'
        );

        const { RGBELoader } = await loadModuleWithFallback(
            'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/RGBELoader.js',
            'https://esm.sh/three@0.152.2/examples/jsm/loaders/RGBELoader.js'
        );

        window.__threeModules = { THREE, GLTFLoader, OrbitControls, RGBELoader };
        return window.__threeModules;
    }

    // Build the Three.js scene for the aggregate collage.
    async function setupDustballCollage() {
        const { THREE, GLTFLoader, OrbitControls, RGBELoader } = await ensureThreeModules();

        // Find the container in the modal and clear previous renders.
        const container = document.getElementById('dustball-collage');
        if (!container) {
            console.warn('Dustball collage container missing');
            return;
        }
        container.innerHTML = '';

        // Wait a frame to ensure layout is ready.
        await new Promise(requestAnimationFrame);
        const width = container.offsetWidth || 600;
        const height = container.offsetHeight || 400;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.set(0, 0, 8);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.setSize(width, height);
        
        // Enable shadows
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.rotateSpeed = 0.6;
        controls.zoomSpeed = 0.9;
        controls.panSpeed = 0.6;
        let isUserInteracting = false;
        controls.addEventListener('start', () => { isUserInteracting = true; });
        controls.addEventListener('end', () => { isUserInteracting = false; });
        
        // Load HDRI for environment and lighting
        const rgbeLoader = new RGBELoader();
        try {
            const hdriUrl = `${basePath}hdri/lilienstein_4k.hdr`;
            const texture = await rgbeLoader.loadAsync(hdriUrl);
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture;
        } catch (err) {
            console.warn('Failed to load local HDRI, using CDN fallback', err);
            try {
                const fallbackUrl = 'https://cdn.jsdelivr.net/npm/@pmndrs/assets@2.0.8/hdris/mv_studio.hdr';
                const texture = await rgbeLoader.loadAsync(fallbackUrl);
                texture.mapping = THREE.EquirectangularReflectionMapping;
                scene.environment = texture;
            } catch (fallbackErr) {
                console.warn('CDN fallback also failed', fallbackErr);
            }
        }
        
        // Set background to transparent
        scene.background = null;
        
        // Add directional light for shadow casting
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(5, 8, 7);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -15;
        directionalLight.shadow.camera.right = 15;
        directionalLight.shadow.camera.top = 15;
        directionalLight.shadow.camera.bottom = -5;
        directionalLight.shadow.bias = -0.0005;
        directionalLight.shadow.normalBias = 0.02;
        scene.add(directionalLight);

        // Base lighting so GLB materials are visible.
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        // Pick up to 5 GLB files from the aggregate specimens (or fallback to generic names).
        let glbFiles = aggregateSpecimens
            .slice(0, 5)
            .map(s => s.modelPath ? basePath + s.modelPath : null)
            .filter(Boolean);
        // Fallback if not enough
        while (glbFiles.length < 5) glbFiles.push(basePath + 'models/model' + (glbFiles.length + 1) + '.glb');

        const loader = new GLTFLoader();
        let loadedCount = 0;

        // Random point in a sphere for a loose collage layout.
        function randomPosition(radius = 1) {
            // Random point in a sphere
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const r = radius * (0.2 + 0.8 * Math.random());
            return new THREE.Vector3(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
            );
        }

        // Normalize mesh size and center to keep models within view.
        function normalizeMesh(mesh, targetSize = 1.2) {
            const box = new THREE.Box3().setFromObject(mesh);
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const scale = targetSize / maxDim;
            mesh.scale.multiplyScalar(scale);

            const center = new THREE.Vector3();
            box.getCenter(center);
            mesh.position.sub(center.multiplyScalar(scale));
        }

        // Load each GLB and add it to the scene.
        const loadedMeshes = [];
        const meshTargets = new Map();
        const expectedCount = glbFiles.length;

        function fitCameraToMeshes() {
            if (!loadedMeshes.length) return;
            const box = new THREE.Box3();
            loadedMeshes.forEach((mesh) => box.expandByObject(mesh));

            const center = new THREE.Vector3();
            const size = new THREE.Vector3();
            box.getCenter(center);
            box.getSize(size);

            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const distance = Math.max(2.0, maxDim * 1.2);

            camera.position.set(center.x, center.y, center.z + distance);
            camera.near = Math.max(0.1, distance / 100);
            camera.far = distance * 50;
            camera.updateProjectionMatrix();

            controls.target.copy(center);
            controls.minDistance = distance * 0.4;
            controls.maxDistance = distance * 6;
            controls.update();
        }

        function setTargets() {
            if (isUserInteracting) return;
            loadedMeshes.forEach((mesh) => {
                meshTargets.set(mesh, {
                    position: randomPosition(),
                    rotation: new THREE.Euler(
                        Math.random() * Math.PI * 2,
                        Math.random() * Math.PI * 2,
                        Math.random() * Math.PI * 2
                    )
                });
            });
        }

        glbFiles.forEach((file) => {
            loader.load(file, (gltf) => {
                const mesh = gltf.scene;
                mesh.traverse((child) => {
                    if (child.isMesh && child.material) {
                        // Convert materials to ensure shadow support
                        if (Array.isArray(child.material)) {
                            child.material = child.material.map((mat) => {
                                const newMat = new THREE.MeshStandardMaterial({
                                    map: mat.map,
                                    color: mat.color,
                                    roughness: 0.7,
                                    metalness: 0.2
                                });
                                newMat.side = THREE.DoubleSide;
                                return newMat;
                            });
                        } else {
                            const newMat = new THREE.MeshStandardMaterial({
                                map: child.material.map,
                                color: child.material.color,
                                roughness: 0.7,
                                metalness: 0.2
                            });
                            newMat.side = THREE.DoubleSide;
                            child.material = newMat;
                        }
                        // Enable shadows on meshes
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                normalizeMesh(mesh, 1.2);
                mesh.rotation.x = Math.random() * Math.PI * 2;
                mesh.rotation.y = Math.random() * Math.PI * 2;
                mesh.rotation.z = Math.random() * Math.PI * 2;
                mesh.position.copy(randomPosition());
                mesh.scale.multiplyScalar(0.9 + Math.random() * 0.2);
                scene.add(mesh);
                loadedMeshes.push(mesh);
                meshTargets.set(mesh, {
                    position: mesh.position.clone(),
                    rotation: mesh.rotation.clone()
                });
                loadedCount++;
                if (loadedCount === expectedCount) {
                    fitCameraToMeshes();
                }
            }, undefined, (err) => {
                console.error('Failed to load GLB:', file, err);
                loadedCount++;
                if (loadedCount === expectedCount) {
                    fitCameraToMeshes();
                }
            });
        });

        if (collageIntervalId) {
            clearInterval(collageIntervalId);
        }
        collageIntervalId = setInterval(setTargets, 6000);

        // Animation loop for rotation and controls.
        function animate() {
            requestAnimationFrame(animate);
            if (!isUserInteracting) {
                loadedMeshes.forEach((mesh) => {
                    const target = meshTargets.get(mesh);
                    if (!target) return;
                    mesh.position.lerp(target.position, 0.01);
                    mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, target.rotation.x, 0.01);
                    mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, target.rotation.y, 0.01);
                    mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, target.rotation.z, 0.01);
                });
            }
            controls.update();
            if (!isUserInteracting) {
                scene.rotation.y += 0.002;
            }
            renderer.render(scene, camera);
        }
        animate();
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Run the collage setup and show a fallback message on failure.
    setupDustballCollage().catch(err => {
        console.error('Failed to initialize dustball collage', err);
        const container = document.getElementById('dustball-collage');
        if (container) {
            container.innerHTML = '<p style="color: var(--color-text-light); text-align: center; padding: 2rem;">Unable to load 3D collage. Please check your connection and model paths.</p>';
        }
    });
    
    // Update URL
    if (!skipHistory) {
        window.history.pushState({ type: 'aggregate', id: id }, '', `#aggregates/${id}`);
    }
}

// Close modal and restore page scroll.
function closeModal(skipHistory = false) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (collageIntervalId) {
        clearInterval(collageIntervalId);
        collageIntervalId = null;
    }
    
    // Update URL back to just the section
    if (!skipHistory) {
        const currentSection = document.querySelector('.section.active')?.id || 'specimens';
        window.history.pushState({ section: currentSection }, '', `#${currentSection}`);
    }
}

// Format date helper.
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Stub for submission form setup (if needed in the future)
function setupSubmissionForm() {
    // Placeholder for future submission form functionality
}

// Carousel functionality
let carouselImages = [];
let currentCarouselIndex = 0;
let carouselAutoplayTimer = null;
const AUTOPLAY_INTERVAL = 5000; // 5 seconds

async function setupCarousel() {
    try {
        // Load manifestations from JSON file
        const response = await fetch(`${basePath}js/manifestations.json`);
        if (!response.ok) {
            console.log('No manifestations.json found, carousel will be empty');
            return;
        }
        
        const data = await response.json();
        // Store image objects with filename and caption
        carouselImages = data.images.map(item => ({
            filename: item.filename,
            caption: item.caption || ''
        }));
        
        if (carouselImages.length === 0) {
            console.log('No images found in manifestations.json');
            return;
        }
        
        renderCarousel();
        setupCarouselControls();
        startCarouselAutoplay();
    } catch (error) {
        console.error('Error loading carousel images:', error);
    }
}

function renderCarousel() {
    const container = document.getElementById('carousel-image-container');
    if (!container || carouselImages.length === 0) return;

    const currentImage = carouselImages[currentCarouselIndex];
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
            <img src="${basePath}Manifestations/${currentImage.filename}" alt="${currentImage.caption || 'Gallery image'}" loading="lazy" style="max-width: 100%; max-height: 70vh; object-fit: contain;">
            ${currentImage.caption ? `<div class="carousel-caption-below">${currentImage.caption}</div>` : ''}
        </div>
    `;

    updateCarouselButtons();
    updateCarouselCounter();
}

function setupCarouselControls() {
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const randomBtn = document.querySelector('.carousel-btn-random');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentCarouselIndex > 0) {
                currentCarouselIndex--;
                renderCarousel();
                resetAutoplay();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentCarouselIndex < carouselImages.length - 1) {
                currentCarouselIndex++;
                renderCarousel();
                resetAutoplay();
            }
        });
    }

    if (randomBtn) {
        randomBtn.addEventListener('click', () => {
            goToRandomImage();
            resetAutoplay();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const carouselSection = document.getElementById('carousel');
        if (!carouselSection || !carouselSection.classList.contains('active')) return;

        if (e.key === 'ArrowLeft' && currentCarouselIndex > 0) {
            currentCarouselIndex--;
            renderCarousel();
            resetAutoplay();
        } else if (e.key === 'ArrowRight' && currentCarouselIndex < carouselImages.length - 1) {
            currentCarouselIndex++;
            renderCarousel();
            resetAutoplay();
        }
    });
}

function updateCarouselButtons() {
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    
    if (prevBtn) prevBtn.disabled = currentCarouselIndex === 0;
    if (nextBtn) nextBtn.disabled = currentCarouselIndex === carouselImages.length - 1;
}

function updateCarouselCounter() {
    const carouselCounter = document.querySelector('.carousel-counter');
    if (carouselCounter && carouselImages.length > 0) {
        carouselCounter.textContent = `${currentCarouselIndex + 1} / ${carouselImages.length}`;
    }
}

function updateCarouselCaption() {
    const carouselCaption = document.getElementById('carousel-caption');
    if (carouselCaption && carouselImages.length > 0) {
        const currentImage = carouselImages[currentCarouselIndex];
        carouselCaption.textContent = currentImage.caption || '';
    }
}

function startCarouselAutoplay() {
    const carouselSection = document.getElementById('carousel');
    if (!carouselSection || !carouselSection.classList.contains('active')) return;
    
    if (carouselAutoplayTimer) clearInterval(carouselAutoplayTimer);
    
    carouselAutoplayTimer = setInterval(() => {
        goToRandomImage();
    }, AUTOPLAY_INTERVAL);
}

function stopCarouselAutoplay() {
    if (carouselAutoplayTimer) {
        clearInterval(carouselAutoplayTimer);
        carouselAutoplayTimer = null;
    }
}

function resetAutoplay() {
    stopCarouselAutoplay();
    startCarouselAutoplay();
}

function goToRandomImage() {
    if (carouselImages.length === 0) return;
    currentCarouselIndex = Math.floor(Math.random() * carouselImages.length);
    renderCarousel();
}


// Load data and initialize when DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupSubmissionForm();
});

