// Handle form submissions
document.addEventListener('DOMContentLoaded', function() {
    // Handle complaint form submission
    const complaintFormElement = document.getElementById('complaintForm');
    if (complaintFormElement) {
        complaintFormElement.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const studentNameInput = document.getElementById('studentName').value;
            const roomNumberInput = document.getElementById('roomNumber').value;
            const complaintTypeInput = document.getElementById('complaintType').value;
            const descriptionInput = document.getElementById('description').value;

            // Create new complaint card
            const complaintGridContainer = document.querySelector('.complaint-grid');
            const newComplaintCard = document.createElement('div');
            newComplaintCard.className = 'complaint-card';
            newComplaintCard.innerHTML = `
                <div class="complaint-header">
                    <h3>Complaint #${complaintGridContainer.children.length + 1}</h3>
                    <span class="complaint-status status-pending">Pending</span>
                </div>
                <div class="complaint-details">
                    <p><strong>Student:</strong> ${studentNameInput}</p>
                    <p><strong>Room:</strong> ${roomNumberInput}</p>
                    <p><strong>Type:</strong> ${complaintTypeInput}</p>
                    <p><strong>Description:</strong> ${descriptionInput}</p>
                    <p><strong>Date:</strong> ${new Date().toISOString().split('T')[0]}</p>
                </div>
                <div class="complaint-actions">
                    <button class="action-btn resolve-btn">Mark as Resolved</button>
                    <button class="action-btn delete-btn">Delete</button>
                </div>
            `;

            // Add event listeners to new buttons
            const resolveButton = newComplaintCard.querySelector('.resolve-btn');
            const deleteButton = newComplaintCard.querySelector('.delete-btn');

            resolveButton.addEventListener('click', function() {
                const statusElement = newComplaintCard.querySelector('.complaint-status');
                statusElement.className = 'complaint-status status-resolved';
                statusElement.textContent = 'Resolved';
            });

            deleteButton.addEventListener('click', function() {
                newComplaintCard.remove();
            });

            // Add new complaint to the grid
            complaintGridContainer.appendChild(newComplaintCard);

            // Reset form
            complaintFormElement.reset();

            // Show success message
            alert('Complaint submitted successfully!');
        });
    }

    // Handle search functionality
    const searchInputElements = document.querySelectorAll('.filter-input[type="text"]');
    searchInputElements.forEach(inputElement => {
        inputElement.addEventListener('input', function() {
            const searchQuery = this.value.toLowerCase();
            const cardElements = document.querySelectorAll('.room-card, .complaint-card');
            
            cardElements.forEach(cardElement => {
                const cardText = cardElement.textContent.toLowerCase();
                if (cardText.includes(searchQuery)) {
                    cardElement.style.display = '';
                } else {
                    cardElement.style.display = 'none';
                }
            });
        });
    });

    // Handle status filter
    const statusFilterElements = document.querySelectorAll('.filter-input[type="select"]');
    statusFilterElements.forEach(filterElement => {
        filterElement.addEventListener('change', function() {
            const selectedFilterStatus = this.value.toLowerCase();
            const cardElements = document.querySelectorAll('.room-card, .complaint-card');
            
            cardElements.forEach(cardElement => {
                if (!selectedFilterStatus) {
                    cardElement.style.display = '';
                    return;
                }

                const statusElement = cardElement.querySelector('.room-status, .complaint-status');
                if (statusElement && statusElement.textContent.toLowerCase().includes(selectedFilterStatus)) {
                    cardElement.style.display = '';
                } else {
                    cardElement.style.display = 'none';
                }
            });
        });
    });

    // Handle delete buttons
    const deleteButtonElements = document.querySelectorAll('.delete-btn');
    deleteButtonElements.forEach(buttonElement => {
        buttonElement.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this item?')) {
                this.closest('.room-card, .complaint-card').remove();
            }
        });
    });

    // Handle resolve buttons for complaints
    const resolveButtonElements = document.querySelectorAll('.resolve-btn');
    resolveButtonElements.forEach(buttonElement => {
        buttonElement.addEventListener('click', function() {
            const statusElement = this.closest('.complaint-card').querySelector('.complaint-status');
            statusElement.className = 'complaint-status status-resolved';
            statusElement.textContent = 'Resolved';
        });
    });

    // Navigation Menu Functionality
    const hamburgerMenu = document.querySelector('.hamburger');
    const navigationContainer = document.querySelector('.nav-container');
    const navigationOverlay = document.querySelector('.nav-overlay');
    const documentBody = document.body;

    function toggleNavigationMenu() {
        hamburgerMenu.classList.toggle('active');
        navigationContainer.classList.toggle('active');
        navigationOverlay.classList.toggle('active');
        documentBody.style.overflow = navigationContainer.classList.contains('active') ? 'hidden' : '';
    }

    hamburgerMenu.addEventListener('click', toggleNavigationMenu);
    navigationOverlay.addEventListener('click', toggleNavigationMenu);

    // Close menu when clicking a link
    const navigationLinks = document.querySelectorAll('.nav-links a');
    navigationLinks.forEach(linkElement => {
        linkElement.addEventListener('click', () => {
            if (navigationContainer.classList.contains('active')) {
                toggleNavigationMenu();
            }
        });
    });

    // Close menu on window resize if open
    window.addEventListener('resize', () => {
        if (window.innerWidth > 991 && navigationContainer.classList.contains('active')) {
            toggleNavigationMenu();
        }
    });
}); 