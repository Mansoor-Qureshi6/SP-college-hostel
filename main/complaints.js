import { db } from './firebase-config.js';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Get elements
const newComplaintBtn = document.getElementById('new-complaint-btn');
const modal = document.getElementById('new-complaint-modal');
const closeModalBtn = document.querySelector('.modal .close');
const complaintForm = document.getElementById('new-complaint-form');
const complaintGrid = document.getElementById('complaint-grid');

// Show the modal
newComplaintBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Hide the modal
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// --- Render Complaints ---
const renderComplaints = (complaints) => {
    complaintGrid.innerHTML = ''; // Clear the grid first
    complaints.forEach(complaint => {
        const card = document.createElement('div');
        card.className = 'complaint-card';
        card.setAttribute('data-id', complaint.id);

        const statusClass = complaint.data.status.toLowerCase().replace(' ', '-');
        const submittedDate = complaint.data.submittedAt?.toDate().toLocaleDateString() || 'N/A';

        card.innerHTML = `
            <div class="complaint-header">
                <h3>${complaint.data.category}</h3>
                <span class="complaint-status status-${statusClass}">${complaint.data.status}</span>
            </div>
            <div class="complaint-details">
                <p><i class="fas fa-user"></i> ${complaint.data.name} (Room ${complaint.data.room})</p>
                <p><i class="fas fa-calendar"></i> Submitted: ${submittedDate}</p>
                <p><i class="fas fa-info-circle"></i> ${complaint.data.details}</p>
            </div>
            <div class="complaint-actions">
                <button class="action-btn resolve-btn">Resolve</button>
                <button class="action-btn delete-btn">Delete</button>
            </div>
        `;

        complaintGrid.appendChild(card);

        // Add event listeners for delete and resolve
        card.querySelector('.delete-btn').addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this complaint?')) {
                await deleteDoc(doc(db, "complaints", complaint.id));
            }
        });

        card.querySelector('.resolve-btn').addEventListener('click', async () => {
            await updateDoc(doc(db, "complaints", complaint.id), {
                status: 'resolved'
            });
        });
    });
};

// --- Firestore Logic ---
// Real-time listener for complaints
onSnapshot(collection(db, "complaints"), (snapshot) => {
    const complaints = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
    renderComplaints(complaints);
});

// Handle form submission
complaintForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const studentName = document.getElementById('student-name').value;
    const roomNumber = document.getElementById('room-number').value;
    const category = document.getElementById('complaint-category').value;
    const details = document.getElementById('complaint-details').value;

    try {
        // Add a new document with a generated ID to the "complaints" collection.
        const docRef = await addDoc(collection(db, "complaints"), {
            name: studentName,
            room: roomNumber,
            category: category,
            details: details,
            status: 'pending', // Default status
            submittedAt: serverTimestamp() // Add a server-side timestamp
        });
        console.log("Document written with ID: ", docRef.id);
        alert('Complaint submitted successfully!');
        complaintForm.reset();
        modal.style.display = 'none';
    } catch (e) {
        console.error("Error adding document: ", e);
        alert('Error submitting complaint. Please try again.');
    }
}); 