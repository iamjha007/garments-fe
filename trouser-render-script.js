document.addEventListener('DOMContentLoaded', () => {
    // --- Header Shrink on Scroll ---
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { // Adjust this value as needed
                header.classList.add('py-2', 'md:py-3');
                header.classList.remove('py-4');
            } else {
                header.classList.remove('py-2', 'md:py-3');
                header.classList.add('py-4');
            }
        });
    }

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when a navigation link is clicked
        const mobileNavLinks = mobileMenu.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // --- Product Loading from JSON (for Trousers) ---
    const productListContainer = document.getElementById('product-list-container');

    if (productListContainer) {
        console.log('executed 2')
        fetch('trousers.json') // Fetch the trousers data from trousers.json
            .then(response => {
                console.log('executed line 3 ')
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log('eseuted line 4 ')
                return response.json();
            })
            .then(products => {
                products.forEach(product => {
                    // Create a new div element for each product card
                    const productCard = document.createElement('div');
                    // Add existing Tailwind CSS classes and the fade-in class
                    productCard.classList.add('group', 'fade-in');
                    
                    // Construct the inner HTML using template literals
                    // Use a fallback image in case the product.image URL fails
                    productCard.innerHTML = `
                        <div class="w-full bg-gray-100 rounded-lg overflow-hidden">
                            <a href="${product.link}">
                                <img src="${product.image}"
                                     alt="${product.name}"
                                     class="w-full h-full object-cover object-center group-hover:opacity-80 transition-opacity"
                                     loading="lazy"
                                     onerror="this.onerror=null;this.src='https://placehold.co/500x600/cccccc/333333?text=Image+Not+Found';">
                            </a>
                        </div>
                        <div class="mt-4">
                            <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                            <p class="text-sm text-gray-500 mt-1">SKU: ${product.sku}</p>
                        </div>
                    `;
                    // Append the created product card to the container
                    productListContainer.appendChild(productCard);
                });

                // --- Fade-in animation for dynamically loaded elements ---
                // Observe the dynamically added elements to apply fade-in effect
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target); // Stop observing once visible
                        }
                    });
                }, {
                    threshold: 0.1 // Trigger when 10% of the element is visible
                });

                // Select all newly created .fade-in elements and observe them
                document.querySelectorAll('.fade-in').forEach(element => {
                    observer.observe(element);
                });

            })
            .catch(error => {
                console.error('Failed to load trousers:', error);
                // Optionally display a user-friendly error message
                productListContainer.innerHTML = '<p class="text-red-500">Could not load trousers. Please try again later.</p>';
            });
    }
});
