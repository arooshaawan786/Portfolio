// Theme Switcher
const themeToggle = document.getElementById("theme-toggle")
const htmlElement = document.documentElement

// Load theme from localStorage
const currentTheme = localStorage.getItem("theme") || "light"
htmlElement.setAttribute("data-theme", currentTheme)

themeToggle.addEventListener("click", () => {
  const currentTheme = htmlElement.getAttribute("data-theme")
  const newTheme = currentTheme === "light" ? "dark" : "light"

  htmlElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
})

// Mobile Navigation
const mobileToggle = document.querySelector(".mobile-nav-toggle")
const navMenu = document.querySelector(".nav-menu")

mobileToggle.addEventListener("click", () => {
  mobileToggle.classList.toggle("active")
  navMenu.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    mobileToggle.classList.remove("active")
    navMenu.classList.remove("active")
  })
})

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Education Table - Sorting and Filtering
const educationTable = document.getElementById("education-table")
const tbody = document.getElementById("education-tbody")
const searchInput = document.getElementById("search-input")
const levelFilter = document.getElementById("level-filter")

let educationData = []
let sortColumn = ""
let sortDirection = "asc"

// Initialize education data
function initEducationData() {
  const rows = tbody.querySelectorAll("tr")
  educationData = Array.from(rows).map((row) => {
    const cells = row.querySelectorAll("td")
    return {
      level: cells[0].textContent,
      institution: cells[1].textContent,
      year: cells[2].textContent,
      grade: cells[3].textContent,
      achievements: cells[4].textContent,
      element: row,
    }
  })
}

// Sort table
function sortTable(column) {
  if (sortColumn === column) {
    sortDirection = sortDirection === "asc" ? "desc" : "asc"
  } else {
    sortColumn = column
    sortDirection = "asc"
  }

  educationData.sort((a, b) => {
    const aVal = a[column].toLowerCase()
    const bVal = b[column].toLowerCase()

    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  renderTable()
  updateSortIndicators()
}

// Update sort indicators
function updateSortIndicators() {
  document.querySelectorAll(".sort-indicator").forEach((indicator) => {
    indicator.textContent = "↕"
  })

  const activeHeader = document.querySelector(`th[data-sort="${sortColumn}"]`)
  if (activeHeader) {
    const indicator = activeHeader.querySelector(".sort-indicator")
    indicator.textContent = sortDirection === "asc" ? "↑" : "↓"
  }
}

// Filter table
function filterTable() {
  const searchTerm = searchInput.value.toLowerCase()
  const levelValue = levelFilter.value

  const filteredData = educationData.filter((row) => {
    const matchesSearch = Object.values(row).some((val) => String(val).toLowerCase().includes(searchTerm))
    const matchesLevel = !levelValue || row.level === levelValue

    return matchesSearch && matchesLevel
  })

  tbody.innerHTML = ""
  filteredData.forEach((row) => {
    tbody.appendChild(row.element)
  })
}

// Render table
function renderTable() {
  tbody.innerHTML = ""
  educationData.forEach((row) => {
    tbody.appendChild(row.element)
  })
}

// Event listeners for table
educationTable.querySelectorAll("th[data-sort]").forEach((header) => {
  header.addEventListener("click", () => {
    sortTable(header.dataset.sort)
  })
})

searchInput.addEventListener("input", filterTable)
levelFilter.addEventListener("change", filterTable)

// Progress Bars Animation
function animateProgressBars() {
  const progressBars = document.querySelectorAll(".progress-fill")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progress = entry.target.dataset.progress
          entry.target.style.width = progress + "%"
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  progressBars.forEach((bar) => observer.observe(bar))
}

const galleryCards = document.querySelectorAll(".gallery-card")
const lightbox = document.getElementById("lightbox")
const lightboxImage = lightbox.querySelector(".lightbox-image")
const lightboxTitle = document.getElementById("lightbox-title")
const lightboxDescription = document.getElementById("lightbox-description")
const closeBtn = lightbox.querySelector(".lightbox-close")
const prevBtn = lightbox.querySelector(".lightbox-prev")
const nextBtn = lightbox.querySelector(".lightbox-next")

let currentImageIndex = 0

galleryCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    currentImageIndex = index
    showLightbox()
  })
})

function showLightbox() {
  const card = galleryCards[currentImageIndex]
  const img = card.querySelector(".gallery-image")
  const title = card.querySelector("h3").textContent
  const description = card.querySelector(".gallery-card-description").textContent

  lightboxImage.src = img.src
  lightboxImage.alt = img.alt
  lightboxTitle.textContent = title
  lightboxDescription.textContent = description
  lightbox.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeLightbox() {
  lightbox.classList.remove("active")
  document.body.style.overflow = "auto"
}

function changeImage(direction) {
  currentImageIndex += direction
  if (currentImageIndex < 0) {
    currentImageIndex = galleryCards.length - 1
  } else if (currentImageIndex >= galleryCards.length) {
    currentImageIndex = 0
  }
  showLightbox()
}

closeBtn.addEventListener("click", closeLightbox)
prevBtn.addEventListener("click", () => changeImage(-1))
nextBtn.addEventListener("click", () => changeImage(1))

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox()
  }
})

// Keyboard navigation for lightbox
document.addEventListener("keydown", (e) => {
  if (lightbox.classList.contains("active")) {
    if (e.key === "Escape") closeLightbox()
    if (e.key === "ArrowLeft") changeImage(-1)
    if (e.key === "ArrowRight") changeImage(1)
  }
})

// Contact Form Validation
const contactForm = document.getElementById("contact-form")
const nameInput = document.getElementById("name")
const emailInput = document.getElementById("email")
const messageInput = document.getElementById("message")

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function showError(input, message) {
  const errorElement = document.getElementById(`${input.id}-error`)
  errorElement.textContent = message
  input.style.borderColor = "var(--error-color)"
}

function clearError(input) {
  const errorElement = document.getElementById(`${input.id}-error`)
  errorElement.textContent = ""
  input.style.borderColor = "var(--border-color)"
}

contactForm.addEventListener("submit", (e) => {
  e.preventDefault()

  let isValid = true

  // Validate name
  if (nameInput.value.trim().length < 2) {
    showError(nameInput, "Name must be at least 2 characters long")
    isValid = false
  } else {
    clearError(nameInput)
  }

  // Validate email
  if (!validateEmail(emailInput.value)) {
    showError(emailInput, "Please enter a valid email address")
    isValid = false
  } else {
    clearError(emailInput)
  }

  // Validate message
  if (messageInput.value.trim().length < 10) {
    showError(messageInput, "Message must be at least 10 characters long")
    isValid = false
  } else {
    clearError(messageInput)
  }

  if (isValid) {
    // Show success message
    const successMessage = document.getElementById("form-success")
    successMessage.textContent = "Thank you for your message! I will get back to you soon."
    successMessage.classList.add("show")

    // Reset form
    contactForm.reset()

    // Hide success message after 5 seconds
    setTimeout(() => {
      successMessage.classList.remove("show")
    }, 5000)
  }
})

// Clear error on input
;[nameInput, emailInput, messageInput].forEach((input) => {
  input.addEventListener("input", () => {
    if (input.value.trim()) {
      clearError(input)
    }
  })
})

// Initialize animations
animateProgressBars()

// Initialize education data on page load
initEducationData()

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 50) {
    navbar.style.boxShadow = "var(--shadow-lg)"
  } else {
    navbar.style.boxShadow = "var(--shadow)"
  }
})
