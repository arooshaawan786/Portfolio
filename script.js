// Academic Data
const academicData = [
    {
        period: "2025 - Present",
        institution: "UET Peshawar",
        degree: "Bachelor's in Computer Science",
        details: "Currently pursuing first year. Coursework: Programming, Data Structures, ICT.",
        type: "University"
    },
    {
        period: "2022 - 2025",
        institution: "Pakistan International Public School and Girls College",
        degree: "High School Education",
        details: "Completed with distinction. Top performance in sciences.",
        type: "College"
    },
    {
        period: "2019 - 2021",
        institution: "Pakistan International Public School and Girls College",
        degree: "Secondary School",
        details: "Grade A with focus on science subjects. Strong analytical skills.",
        type: "School"
    },
    {
        period: "2014 - 2018",
        institution: "Pakistan International Public School and Girls College",
        degree: "Primary Education",
        details: "Excellent performance, building strong academic foundation.",
        type: "School"
    }
];

// DOM Elements
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const resetFilters = document.getElementById('resetFilters');
const resultCount = document.getElementById('resultCount');
const themeToggle = document.getElementById('themeToggle');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const progressBars = document.querySelectorAll('.progress');
const contactForm = document.getElementById('contactForm');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDescription = document.getElementById('lightbox-description');
const tableHeaders = document.querySelectorAll('th[data-column]');

// Sort state
let currentSort = {
    column: null,
    direction: 'asc'
};

// Filter state
let currentFilter = 'all';
let currentSearch = '';

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    renderTable(academicData);
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            themeToggle.innerHTML = '<i class="material-icons">light_mode</i>';
        }
    }
    
    // Animate progress bars when section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressBars.forEach(bar => {
                    bar.style.width = bar.getAttribute('data-width');
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    observer.observe(document.getElementById('projects'));
});

// Render table function
function renderTable(data) {
    tableBody.innerHTML = '';
    
    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem;">
                    No education records match your criteria.
                </td>
            </tr>
        `;
        resultCount.textContent = 'No matching records found';
        return;
    }
    
    data.forEach(item => {
        const row = document.createElement('tr');
        // Note: classList.add(item.type) relies on CSS classes matching the data strings exactly
        row.innerHTML = `
            <td>${item.period}</td>
            <td>${item.institution}</td>
            <td>${item.degree}</td>
            <td><span class="type-badge ${item.type}">${item.type}</span></td>
            <td>${item.details}</td>
        `;
        tableBody.appendChild(row);
    });
    
    resultCount.textContent = `Showing ${data.length} of ${academicData.length} education records`;
}

// Apply both search and filter
function applyFilters() {
    let filteredData = academicData;
    
    // Apply type filter
    if (currentFilter !== 'all') {
        filteredData = filteredData.filter(item => item.type === currentFilter);
    }
    
    // Apply search filter
    if (currentSearch) {
        const searchTerm = currentSearch.toLowerCase();
        filteredData = filteredData.filter(item => 
            item.period.toLowerCase().includes(searchTerm) ||
            item.institution.toLowerCase().includes(searchTerm) ||
            item.degree.toLowerCase().includes(searchTerm) ||
            item.details.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply sorting
    if (currentSort.column) {
        const key = currentSort.column;
        filteredData.sort((a, b) => {
            if (a[key] < b[key]) return currentSort.direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return currentSort.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }
    
    renderTable(filteredData);
}

// Sort table functionality
tableHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const column = header.getAttribute('data-column');
        
        // If clicking same column, toggle direction
        if (currentSort.column === column) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.column = column;
            currentSort.direction = 'asc';
        }
        
        // Update header styles
        tableHeaders.forEach(h => {
            h.classList.remove('sorted-asc', 'sorted-desc');
        });
        header.classList.add(currentSort.direction === 'asc' ? 'sorted-asc' : 'sorted-desc');
        
        applyFilters();
    });
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    applyFilters();
});

// Filter functionality
filterSelect.addEventListener('change', (e) => {
    currentFilter = e.target.value;
    applyFilters();
});

// Reset filters
resetFilters.addEventListener('click', () => {
    currentFilter = 'all';
    currentSearch = '';
    currentSort.column = null;
    currentSort.direction = 'asc';
    
    searchInput.value = '';
    filterSelect.value = 'all';
    
    tableHeaders.forEach(h => {
        h.classList.remove('sorted-asc', 'sorted-desc');
    });
    
    applyFilters();
});

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
        themeToggle.innerHTML = '<i class="material-icons">light_mode</i>';
    } else {
        themeToggle.innerHTML = '<i class="material-icons">dark_mode</i>';
    }
});

// Mobile navigation
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Contact form validation
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Name validation
    const name = document.getElementById('name');
    if (name.value.trim() === '') {
        setError(name);
        isValid = false;
    } else {
        setSuccess(name);
    }
    
    // Email validation
    const email = document.getElementById('email');
    if (!isValidEmail(email.value)) {
        setError(email);
        isValid = false;
    } else {
        setSuccess(email);
    }
    
    // Message validation
    const message = document.getElementById('message');
    if (message.value.trim() === '') {
        setError(message);
        isValid = false;
    } else {
        setSuccess(message);
    }
    
    // If valid, show success message
    if (isValid) {
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
        // Reset validation styles
        document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
    }
});

function setError(input) {
    const formGroup = input.parentElement;
    formGroup.classList.add('error');
}

function setSuccess(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove('error');
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Lightbox functionality
function openLightbox(imgSrc, title, description) {
    lightboxImg.src = imgSrc;
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close lightbox when clicking outside the content
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// CV download function
function downloadCV() {
    // In a real application, this would download actual PDF file
    // For this example, we'll show an alert
    alert('In a real application, this would trigger a download of "cv.pdf". Currently, no PDF file is linked.');
}