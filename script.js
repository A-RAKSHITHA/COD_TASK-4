// Course progress tracking
const updateProgress = () => {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const percentage = bar.parentElement.previousElementSibling.querySelector('.progress-percentage');
        if (percentage) {
            bar.style.width = percentage.textContent;
        }
    });
};

// Course filtering
const initializeFilters = () => {
    const filterInputs = document.querySelectorAll('.filter-group input[type="checkbox"]');
    filterInputs.forEach(input => {
        input.addEventListener('change', filterCourses);
    });
};

const filterCourses = () => {
    const selectedCategories = Array.from(document.querySelectorAll('.filter-group input[name="category"]:checked'))
        .map(input => input.value);
    const selectedLevels = Array.from(document.querySelectorAll('.filter-group input[name="level"]:checked'))
        .map(input => input.value);

    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        const cardLevel = card.querySelector('.course-level').textContent.toLowerCase();
        const shouldShow = (selectedLevels.length === 0 || selectedLevels.includes(cardLevel)) &&
                          (selectedCategories.length === 0 || selectedCategories.some(cat => 
                              card.textContent.toLowerCase().includes(cat.toLowerCase())
                          ));
        
        card.style.display = shouldShow ? 'block' : 'none';
    });

    filterByDuration();
};

// Video player controls
const initializeVideoControls = () => {
    const nextButton = document.querySelector('.navigation-buttons .btn-primary');
    const prevButton = document.querySelector('.navigation-buttons .btn-secondary');
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            // Implement next video logic
            console.log('Loading next video...');
        });
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            // Implement previous video logic
            console.log('Loading previous video...');
        });
    }
};

// Course completion tracking
const trackCompletion = () => {
    const videoPlayer = document.querySelector('.video-player iframe');
    if (videoPlayer) {
        // Listen for video completion
        window.addEventListener('message', (event) => {
            if (event.data === 'videoCompleted') {
                updateCourseProgress();
            }
        });
    }
};

const updateCourseProgress = () => {
    // Update progress in local storage
    const courseId = new URLSearchParams(window.location.search).get('courseId');
    if (courseId) {
        const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
        progress[courseId] = (progress[courseId] || 0) + 1;
        localStorage.setItem('courseProgress', JSON.stringify(progress));
        
        // Update UI
        updateProgressUI(courseId, progress[courseId]);
    }
};

const updateProgressUI = (courseId, completedLessons) => {
    const progressElement = document.querySelector('.progress-text');
    if (progressElement) {
        const totalLessons = 12; // This should be dynamic based on course
        const percentage = Math.round((completedLessons / totalLessons) * 100);
        progressElement.textContent = `${percentage}%`;
        
        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
    }
};

// Achievement system
const checkAchievements = () => {
    const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    const totalCompletedCourses = Object.keys(progress).length;
    
    // Update achievements
    if (totalCompletedCourses >= 1) {
        unlockAchievement('quick-starter');
    }
    if (totalCompletedCourses >= 5) {
        unlockAchievement('course-master');
    }
};

const unlockAchievement = (achievementId) => {
    const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    if (!achievements.includes(achievementId)) {
        achievements.push(achievementId);
        localStorage.setItem('achievements', JSON.stringify(achievements));
        
        // Show achievement notification
        showAchievementNotification(achievementId);
    }
};

const showAchievementNotification = (achievementId) => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <i class="fas fa-trophy"></i>
        <p>Achievement Unlocked: ${achievementId.replace('-', ' ').toUpperCase()}</p>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after animation
    setTimeout(() => {
        notification.remove();
    }, 3000);
};

// Authentication
const initializeAuth = () => {
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');

    if (signinForm) {
        signinForm.addEventListener('submit', handleSignIn);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignUp);
    }

    // Check authentication status and update UI
    updateAuthUI();
};

const handleSignIn = (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.querySelector('input[type="checkbox"]').checked;

    // For demo purposes, simulate successful login
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', email.split('@')[0]); // Use email username as display name
    window.location.href = 'courses.html';
};

const handleSignUp = (e) => {
    e.preventDefault();
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // For demo purposes, simulate successful registration
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', fullname);
    window.location.href = 'courses.html';
};

const updateAuthUI = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userName = localStorage.getItem('userName');
    const navLinks = document.querySelector('.nav-links');
    const signInLink = navLinks.querySelector('a[href="signin.html"]');
    
    if (isAuthenticated && userName && signInLink) {
        // Replace sign in link with user profile
        const userProfile = document.createElement('div');
        userProfile.className = 'user-profile';
        userProfile.innerHTML = `
            <div class="user-menu">
                <i class="fas fa-user-circle"></i>
                <span>${userName}</span>
                <i class="fas fa-chevron-down"></i>
                <div class="dropdown-menu">
                    <a href="progress.html"><i class="fas fa-chart-line"></i> My Progress</a>
                    <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>
        `;
        signInLink.parentElement.replaceWith(userProfile);

        // Add logout functionality
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userName');
            window.location.href = 'index.html';
        });

        // Update welcome message if on home page
        const welcomeMessage = document.getElementById('welcome-message');
        const heroUserName = document.getElementById('hero-user-name');
        if (welcomeMessage && heroUserName) {
            heroUserName.textContent = userName;
            welcomeMessage.style.display = 'block';
        }

        // Update progress page user info if on progress page
        const progressUserName = document.getElementById('user-name');
        const progressUserEmail = document.getElementById('user-email');
        if (progressUserName && progressUserEmail) {
            progressUserName.textContent = userName;
            progressUserEmail.textContent = localStorage.getItem('userEmail') || `${userName.toLowerCase()}@example.com`;
        }
    }
};

// Course rating system
const initializeRatings = () => {
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        const rating = parseFloat(card.querySelector('.fa-star').nextSibling.textContent);
        const starsContainer = document.createElement('div');
        starsContainer.className = 'rating-stars';
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = `fas fa-star ${i <= rating ? 'filled' : ''}`;
            starsContainer.appendChild(star);
        }
        
        card.querySelector('.course-meta').appendChild(starsContainer);
    });
};

// Course search functionality
const initializeSearch = () => {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search courses...';
    searchInput.className = 'course-search';
    
    const coursesContainer = document.querySelector('.courses-container');
    if (coursesContainer) {
        coursesContainer.insertBefore(searchInput, coursesContainer.firstChild);
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const courseCards = document.querySelectorAll('.course-card');
            
            courseCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const shouldShow = title.includes(searchTerm) || description.includes(searchTerm);
                card.style.display = shouldShow ? 'block' : 'none';
            });
        });
    }
};

// Course duration filter
const filterByDuration = () => {
    const selectedDurations = Array.from(document.querySelectorAll('.filter-group input[name="duration"]:checked'))
        .map(input => input.value);

    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        const duration = parseInt(card.querySelector('.fa-clock').nextSibling.textContent);
        let durationCategory;
        
        if (duration <= 5) durationCategory = 'short';
        else if (duration <= 10) durationCategory = 'medium';
        else durationCategory = 'long';

        const shouldShow = selectedDurations.length === 0 || selectedDurations.includes(durationCategory);
        if (!shouldShow) {
            card.style.display = 'none';
        }
    });
};

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
    initializeFilters();
    initializeVideoControls();
    trackCompletion();
    checkAchievements();
    initializeAuth();
    initializeRatings();
    initializeSearch();
    
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
