
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');
        const navbar = document.getElementById('navbar');

        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        const body = document.body;

        // Check for saved user preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }

        // Update the dark mode toggle event listener
darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
    
    // Force a redraw of the chatbot to apply new styles
    const chatbot = document.getElementById('chatbot');
    if (chatbot) {
        chatbot.style.display = 'none';
        setTimeout(() => {
            chatbot.style.display = 'flex';
        }, 10);
    }
});

        // Auth Modals
        const signupModal = document.getElementById('signupModal');
        const loginModal = document.getElementById('loginModal');
        const openSignup = document.getElementById('openSignup');
        const openLogin = document.getElementById('openLogin');
        const closeSignupModal = document.getElementById('closeSignupModal');
        const closeLoginModal = document.getElementById('closeLoginModal');
        const switchToLogin = document.getElementById('switchToLogin');
        const switchToSignup = document.getElementById('switchToSignup');

        // Show modals
        openSignup.addEventListener('click', () => {
            signupModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

        openLogin.addEventListener('click', () => {
            loginModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

        // Close modals
        function closeAllModals() {
            signupModal.style.display = 'none';
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        closeSignupModal.addEventListener('click', closeAllModals);
        closeLoginModal.addEventListener('click', closeAllModals);

        // Switch between modals
        switchToLogin.addEventListener('click', () => {
            signupModal.style.display = 'none';
            loginModal.style.display = 'flex';
        });

        switchToSignup.addEventListener('click', () => {
            loginModal.style.display = 'none';
            signupModal.style.display = 'flex';
        });

        // Close when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === signupModal || e.target === loginModal) {
                closeAllModals();
            }
        });

        // Form submissions
        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirm = document.getElementById('signupConfirm').value;
            
            if (password !== confirm) {
                alert('Passwords do not match!');
                return;
            }
            
            // In a real app, you would send this to your backend
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', name);
            alert('Account created successfully! You can now login.');
            closeAllModals();
        });

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // In a real app, you would verify credentials with your backend
            if (email && password) {
                alert('Login successful!');
                localStorage.setItem('isLoggedIn', 'true');
                closeAllModals();
            } else {
                alert('Please enter valid credentials');
            }
        });

        document.getElementById('footerSignupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('footerEmail').value;
            const password = document.getElementById('footerPassword').value;
            
            // In a real app, you would send this to your backend
            localStorage.setItem('userEmail', email);
            alert('Thank you for signing up! Check your email for confirmation.');
        });

        // Chatbot functionality
        const chatbotToggle = document.getElementById('chatbotToggle');
        const chatbot = document.getElementById('chatbot');
        const closeChatbot = document.getElementById('closeChatbot');
        const chatbotBody = document.getElementById('chatbotBody');
        const chatbotForm = document.getElementById('chatbotForm');
        const userInput = document.getElementById('userInput');
        const apiKeyInput = document.getElementById('apiKeyInput');
        const saveApiKey = document.getElementById('saveApiKey');

        // Check for saved API key
        if (localStorage.getItem('geminiApiKey')) {
            apiKeyInput.value = localStorage.getItem('geminiApiKey');
        }

        // Save API key
        saveApiKey.addEventListener('click', () => {
            const apiKey = apiKeyInput.value.trim();
            if (apiKey && apiKey.length >= 30) {
                localStorage.setItem('geminiApiKey', apiKey);
                
                // Update chatbot welcome message
                const welcomeMessage = document.createElement('div');
                welcomeMessage.className = 'chat-message bot-message';
                welcomeMessage.innerHTML = `
                    <div class="api-warning">
                        <i class="fas fa-check-circle"></i> API key saved successfully! You can now ask me about local dishes anywhere in the world.
                    </div>
                `;
                chatbotBody.appendChild(welcomeMessage);
                chatbotBody.scrollTop = chatbotBody.scrollHeight;
            } else {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'chat-message bot-message';
                errorMessage.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i> Please enter a valid API key (at least 30 characters)
                    </div>
                `;
                chatbotBody.appendChild(errorMessage);
                chatbotBody.scrollTop = chatbotBody.scrollHeight;
            }
        });

        // Toggle chatbot
        chatbotToggle.addEventListener('click', () => {
            chatbot.classList.toggle('active');
        });

        closeChatbot.addEventListener('click', () => {
            chatbot.classList.remove('active');
        });

        // Function to call Gemini 1.5 Flash API
        async function callGeminiAPI(prompt) {
            const apiKey = localStorage.getItem('geminiApiKey');
            
            if (!apiKey || apiKey.length < 30) {
                return `
                    <div class="api-warning">
                        <i class="fas fa-key"></i> Please enter your <a href="#api">Gemini API key</a> to use this feature
                    </div>
                `;
            }

            try {
                // Show loading indicator
                const loadingIndicator = document.createElement('div');
                loadingIndicator.className = 'chat-message bot-message';
                loadingIndicator.innerHTML = `
                    <div class="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div style="text-align: center; margin-top: 0.5rem; font-size: 0.8em;">
                        Finding the best local dishes...
                    </div>
                `;
                chatbotBody.appendChild(loadingIndicator);
                chatbotBody.scrollTop = chatbotBody.scrollHeight;

                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: `As a food expert, recommend 3 must-try local dishes for ${prompt}. 
                                    For each provide: 
                                    1) Dish name 
                                    2) Very short description (under 15 words)
                                    3) Best place to find it (specific restaurant or location)
                                    Format response with each dish as: 
                                    "DISH: [name] | DESC: [description] | LOC: [location]"
                                    Separate dishes with "---"`
                                }]
                            }],
                            generationConfig: {
                                temperature: 0.7,
                                topP: 0.9,
                                maxOutputTokens: 300
                            }
                        })
                    }
                );

                const data = await response.json();
                chatbotBody.removeChild(loadingIndicator);

                if (!response.ok) throw new Error(data.error?.message || 'API request failed');

                const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!responseText) return "Sorry, I couldn't generate recommendations. Please try again.";

                // Process and format the response
                return formatFoodRecommendations(responseText);

            } catch (error) {
                console.error("API Error:", error);
                // Remove loading indicator if it exists
                const loadingIndicator = chatbotBody.querySelector('.loading-dots');
                if (loadingIndicator) {
                    loadingIndicator.parentElement.remove();
                }
                
                return `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i> ${error.message.replace(apiKey, 'REDACTED')}
                    </div>
                `;
            }
        }

        // Format the API response into beautiful food cards
        function formatFoodRecommendations(text) {
            const dishes = text.split('---').filter(d => d.trim().length > 0);
            let html = '<div class="recommendations-header">';
            html += '<h4><i class="fas fa-utensils"></i> Recommended Dishes</h4>';
            html += '<p>Here are my top picks for you:</p></div>';

            dishes.forEach((dish, index) => {
                const dishName = extractValue(dish, 'DISH');
                const description = extractValue(dish, 'DESC');
                const location = extractValue(dish, 'LOC');

                if (dishName && description && location) {
                    html += `
                    <div class="food-recommendation">
                        <h4><span class="recommendation-number">${index + 1}</span>
                        <i class="fas fa-${getDishIcon(index)}"></i> ${dishName}</h4>
                        <div class="food-description">${description}</div>
                        <div class="food-location"><i class="fas fa-map-marker-alt"></i> ${location}</div>
                    </div>`;
                }
            });

            return html + '<p class="recommendations-footer">Bon appétit! <i class="fas fa-smile"></i></p>';
        }

        // Helper function to extract values from the API response
        function extractValue(text, key) {
            const regex = new RegExp(`${key}:\\s*([^\n|]+)`);
            const match = text.match(regex);
            return match ? match[1].trim() : '';
        }

        // Get appropriate icon for each dish
        function getDishIcon(index) {
            const icons = ['hamburger', 'pizza-slice', 'fish', 'drumstick-bite', 'ice-cream'];
            return icons[index % icons.length];
        }

        // Send message
        async function sendUserMessage() {
            const message = userInput.value.trim();
            if (message) {
                // Add user message to chat
                const userMessage = document.createElement('div');
                userMessage.className = 'chat-message user-message';
                userMessage.textContent = message;
                chatbotBody.appendChild(userMessage);
                
                // Clear input
                userInput.value = '';
                
                // Scroll to bottom
                chatbotBody.scrollTop = chatbotBody.scrollHeight;
                
                // Get AI response
                const aiResponse = await callGeminiAPI(message);
                
                // Add bot response to chat
                const botResponse = document.createElement('div');
                botResponse.className = 'chat-message bot-message';
                botResponse.innerHTML = aiResponse;
                chatbotBody.appendChild(botResponse);
                
                // Scroll to bottom
                chatbotBody.scrollTop = chatbotBody.scrollHeight;
            }
        }

        // Event listeners for sending messages
        chatbotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendUserMessage();
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                    
                    // Close chatbot if open
                    if (chatbot.classList.contains('active')) {
                        chatbot.classList.remove('active');
                    }
                }
            });
        });
    