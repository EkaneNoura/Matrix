// profile-manager.js
class ProfileManager {
    constructor(profileData) {
      this.profileData = profileData;
      this.cache = {};
      this.init();
    }
  
    init() {
      this.cacheDOM();
      this.renderProfile();
      this.setupEventListeners();
      this.setupIntersectionObserver();
    }
  
    cacheDOM() {
      this.cache = {
        profileName: document.querySelector('.profile-name'),
        profileUsername: document.querySelector('.profile-username'),
        profileTagline: document.querySelector('.profile-tagline'),
        availability: document.querySelector('.availability'),
        socialLinks: document.querySelector('.social-links'),
        aboutSection: document.getElementById('aboutSection'),
        skillsContainer: document.getElementById('skillsContainer'),
        experienceContainer: document.getElementById('experienceContainer'),
        portfolioGrid: document.getElementById('portfolioGrid'),
        ratingScore: document.querySelector('.rating-score'),
        reviewCount: document.getElementById('reviewCount'),
        ratingDetails: document.getElementById('ratingDetails'),
        reviewsContainer: document.getElementById('reviewsContainer'),
        pricingContainer: document.getElementById('pricingContainer'),
        statsGrid: document.getElementById('statsGrid'),
        badgesContainer: document.getElementById('badgesContainer'),
        hireMeBtn: document.getElementById('hireMeBtn'),
        shareBtn: document.getElementById('shareBtn'),
        contactForm: document.getElementById('contactForm')
      };
    }
  
    renderProfile() {
      this.renderPersonalInfo();
      this.renderAboutSection();
      this.renderSkills();
      this.renderExperience();
      this.renderPortfolio();
      this.renderReviews();
      this.renderServices();
      this.renderStats();
      this.renderBadges();
    }
  
    renderPersonalInfo() {
      const { personal } = this.profileData;
      
      this.cache.profileName.textContent = personal.name;
      this.cache.profileUsername.textContent = personal.username;
      this.cache.profileTagline.textContent = personal.tagline;
  
      this.cache.availability.innerHTML = 
        `<i class="fas fa-circle"></i> ${personal.availability.status === 'available' ? 'Available' : 'Not Available'} for work`;
      
      if (personal.availability.status !== 'available') {
        this.cache.availability.classList.add('offline');
      }
      if (personal.availability.type === 'part-time') {
        this.cache.availability.classList.add('part-time');
      }
  
      this.cache.socialLinks.innerHTML = personal.social
        .map(({ url, icon }) => `
          <a href="${url}" class="social-link" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-${icon}"></i>
          </a>
        `).join('');
    }
  
    renderAboutSection() {
      const { about } = this.profileData;
      
      this.cache.aboutSection.querySelector('.about-text').innerHTML = 
        about.bio.map(p => `<p>${p}</p>`).join('');
  
      const educationHTML = `
        <h3 class="subsection-title">Education</h3>
        ${about.education.map(edu => `
          <div class="education-item">
            <h4 class="education-degree">${edu.degree}</h4>
            <p class="education-institution">
              ${edu.institution} <span class="education-year">(${edu.year})</span>
            </p>
          </div>
        `).join('')}
      `;
  
      const languagesHTML = `
        <h3 class="subsection-title">Languages</h3>
        <div class="languages-container">
          ${about.languages.map(lang => `
            <div class="language-item">
              <span class="language-name">${lang.name}</span>
              <span class="language-level">${lang.level}</span>
            </div>
          `).join('')}
        </div>
      `;
  
      this.cache.aboutSection.insertAdjacentHTML('beforeend', educationHTML + languagesHTML);
    }
  
    renderSkills() {
      this.cache.skillsContainer.innerHTML = this.profileData.skills
        .map(skill => `
          <div class="skill-item">
            <span>${skill.name}</span>
            <div class="skill-rating">
              ${this.generateStars(skill.rating)}
            </div>
          </div>
        `).join('');
    }
  
    renderExperience() {
      this.cache.experienceContainer.innerHTML = this.profileData.experience
        .map(exp => `
          <div class="experience-item">
            <h3 class="experience-role">${exp.role}</h3>
            <p class="experience-company">${exp.company}</p>
            <p class="experience-duration">
              <i class="far fa-calendar-alt"></i>
              <span>${exp.duration}</span>
            </p>
            <p class="experience-description">${exp.description}</p>
          </div>
        `).join('');
    }
  
    renderPortfolio() {
      this.cache.portfolioGrid.innerHTML = this.profileData.portfolio
        .map(item => `
          <div class="portfolio-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.title}" class="portfolio-image" loading="lazy">
            <div class="portfolio-overlay">
              <h3 class="portfolio-title">${item.title}</h3>
              <p class="portfolio-category">${item.category}</p>
            </div>
          </div>
        `).join('');
    }
  
    renderReviews() {
      const { reviews } = this.profileData;
      
      this.cache.ratingScore.textContent = reviews.average;
      this.cache.reviewCount.textContent = reviews.count;
  
      this.cache.ratingDetails.innerHTML = reviews.distribution
        .map(dist => `
          <div class="rating-bar">
            <span class="rating-label">${dist.stars} stars</span>
            <div class="rating-progress">
              <div class="rating-progress-fill" style="width: ${dist.percentage}%;"></div>
            </div>
            <span>${dist.percentage}%</span>
          </div>
        `).join('');
  
      this.cache.reviewsContainer.innerHTML = reviews.testimonials
        .map(testimonial => `
          <div class="review-item">
            <div class="review-header">
              <div class="review-client">
                <img src="${testimonial.avatar}" alt="${testimonial.client}" class="review-avatar" loading="lazy">
                <div>
                  <p class="review-name">${testimonial.client}</p>
                  <p class="review-date">${testimonial.date}</p>
                </div>
              </div>
              <div class="review-stars">
                ${this.generateStars(testimonial.rating)}
              </div>
            </div>
            <p class="review-content">${testimonial.content}</p>
          </div>
        `).join('');
    }
  
    renderServices() {
      this.cache.pricingContainer.innerHTML = this.profileData.services
        .map(service => `
          <div class="pricing-option" data-id="${service.id}">
            <div class="pricing-header">
              <h3 class="pricing-title">${service.title}</h3>
              <span class="pricing-amount">${service.pricing}</span>
            </div>
            <p class="pricing-description">${service.description}</p>
            <ul class="pricing-features">
              ${service.features.map(f => `
                <li class="pricing-feature">
                  <i class="fas fa-check"></i> ${f}
                </li>
              `).join('')}
            </ul>
          </div>
        `).join('');
    }
  
    renderStats() {
      this.cache.statsGrid.innerHTML = this.profileData.stats
        .map(stat => `
          <div class="stat-item" data-id="${stat.id}">
            <div class="stat-value">${stat.value}</div>
            <div class="stat-label">${stat.label}</div>
          </div>
        `).join('');
    }
  
    renderBadges() {
      this.cache.badgesContainer.innerHTML = this.profileData.badges
        .map(badge => `
          <div class="badge ${badge.verified ? 'verified' : ''}" data-id="${badge.id}">
            <i class="fas fa-${badge.icon}"></i>
            <span>${badge.name}</span>
          </div>
        `).join('');
    }
  
    generateStars(rating) {
      return Array.from({ length: 5 }, (_, i) => {
        if (i < Math.floor(rating)) return '<i class="fas fa-star"></i>';
        if (i === Math.floor(rating) && rating % 1 >= 0.5) return '<i class="fas fa-star-half-alt"></i>';
        return '<i class="far fa-star"></i>';
      }).join('');
    }
  
    setupEventListeners() {
      this.cache.hireMeBtn.addEventListener('click', () => this.scrollToContact());
      this.cache.shareBtn.addEventListener('click', () => this.handleShare());
      this.cache.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
      this.cache.portfolioGrid.addEventListener('click', (e) => this.handlePortfolioClick(e));
    }
  
    scrollToContact() {
      document.getElementById('contactSection').scrollIntoView({
        behavior: 'smooth'
      });
    }
  
    async handleShare() {
      const { personal } = this.profileData;
      const shareData = {
        title: `${personal.name} - Freelancer Profile`,
        text: personal.tagline,
        url: window.location.href
      };
  
      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          this.showFallbackShare();
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          this.showFallbackShare();
        }
      }
    }
  
    showFallbackShare() {
      // Could use a toast notification here
      console.log('Share this profile:', window.location.href);
    }
  
    handleFormSubmit(e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      const formValues = Object.fromEntries(formData.entries());
      
      console.log('Form submitted:', formValues);
      this.showSuccessMessage(e.target);
      e.target.reset();
    }
  
    showSuccessMessage(form) {
      const message = document.createElement('div');
      message.className = 'success-message';
      message.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Message sent successfully!</span>
      `;
      
      form.appendChild(message);
      setTimeout(() => message.remove(), 3000);
    }
  
    handlePortfolioClick(e) {
      const item = e.target.closest('.portfolio-item');
      if (!item) return;
      
      const projectId = item.dataset.id;
      const project = this.profileData.portfolio.find(p => p.id == projectId);
      if (project) {
        console.log('Selected project:', project.title);
        // In a real app, show a modal with project details
      }
    }
  
    setupIntersectionObserver() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
  
      document.querySelectorAll('.profile-section').forEach(section => {
        observer.observe(section);
      });
    }
  }
  
  // profile-data.js
  const profileData = {
    personal: {
      name: "TEBOH SAMUEL",
      username: "@tebohsamuel",
      tagline: "Expert UI/UX Designer & Frontend Developer",
      location: "Buea, Cameroon",
      timezone: "GMT",
      availability: {
        status: "available",
        type: "full-time"
      },
      social: [
        { platform: "linkedin", url: "#", icon: "linkedin-in" },
        { platform: "github", url: "#", icon: "github" },
        { platform: "dribbble", url: "#", icon: "dribbble" },
        { platform: "behance", url: "#", icon: "behance" },
        { platform: "twitter", url: "#", icon: "twitter" }
      ]
    },
    about: {
      bio: [
        "Hello! I'm Teboh Samuel, a passionate UI/UX Designer and Frontend Developer with over 5 years of experience creating beautiful, functional, and user-centered digital experiences.",
        "My approach combines aesthetic sensibility with technical expertise to deliver products that are not only visually appealing but also highly usable.",
        "When I'm not designing or coding, you can find me hiking, reading about new technologies, or mentoring aspiring designers."
      ],
      education: [
        {
          degree: "Bachelor of Design",
          institution: "California College of Arts",
          year: "2016"
        },
        {
          degree: "Frontend Development Certification",
          institution: "Udacity",
          year: "2018"
        }
      ],
      languages: [
        { name: "English", level: "Native" },
        { name: "Spanish", level: "Professional" },
        { name: "French", level: "Basic" }
      ]
    },
    skills: [
      { name: "UI/UX Design", rating: 5 },
      { name: "Figma", rating: 5 },
      { name: "HTML/CSS", rating: 4.5 },
      { name: "JavaScript", rating: 4 },
      { name: "React", rating: 4 },
      { name: "User Research", rating: 4 },
      { name: "Wireframing", rating: 5 },
      { name: "Prototyping", rating: 4.5 }
    ],
    experience: [
      {
        id: 1,
        role: "Senior UI/UX Designer",
        company: "TechSolutions Inc.",
        duration: "Jan 2020 - Present",
        description: "Lead the design team in creating intuitive user interfaces for web and mobile applications."
      },
      {
        id: 2,
        role: "UI Designer",
        company: "Digital Creations",
        duration: "Mar 2018 - Dec 2019",
        description: "Designed user interfaces for various clients across different industries."
      }
    ],
    portfolio: [
      {
        id: 1,
        title: "E-commerce Dashboard",
        category: "UI/UX Design",
        image: "img/bbb.webp",
        description: "A comprehensive dashboard for e-commerce analytics."
      },
      {
        id: 2,
        title: "Fitness Mobile App",
        category: "Mobile Design",
        image: "img/aaa.webp",
        description: "Mobile application for fitness tracking and workouts."
      }
    ],
    reviews: {
      average: 4.9,
      count: 47,
      distribution: [
        { stars: 5, percentage: 85 },
        { stars: 4, percentage: 12 },
        { stars: 3, percentage: 2 },
        { stars: 2, percentage: 1 }
      ],
      testimonials: [
        {
          client: "Sarah Johnson",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
          date: "2 weeks ago",
          rating: 5,
          content: "Alex exceeded all our expectations with his design work."
        }
      ]
    },
    services: [
      {
        id: 1,
        title: "UI/UX Design",
        pricing: "$75/hr",
        description: "Custom UI/UX design for web and mobile applications.",
        features: [
          "Wireframes",
          "High-fidelity mockups",
          "Interactive prototypes"
        ]
      }
    ],
    stats: [
      { id: 1, value: "5+", label: "Years Experience" },
      { id: 2, value: "120+", label: "Projects Completed" },
      { id: 3, value: "98%", label: "Client Satisfaction" }
    ],
    badges: [
      { id: 1, name: "Verified Freelancer", icon: "check-circle", verified: true },
      { id: 2, name: "Top Rated", icon: "medal" }
    ]
  };
  
  // Initialize the profile when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    new ProfileManager(profileData);
  });