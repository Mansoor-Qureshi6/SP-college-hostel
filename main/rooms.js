import { db } from './firebase-config.js';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// --- Get DOM Elements ---
const addRoomBtn = document.getElementById('add-room-btn');
const modal = document.getElementById('add-room-modal');
const closeModalBtn = document.querySelector('.modal .close');
const addRoomForm = document.getElementById('add-room-form');
const roomGrid = document.getElementById('room-grid');

// --- Modal Logic ---
addRoomBtn.addEventListener('click', () => { modal.style.display = 'block'; });
closeModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});
// --- End Modal Logic ---

// --- Render Rooms ---
const renderRooms = (rooms) => {
    roomGrid.innerHTML = ''; // Clear the grid
    rooms.forEach(room => {
        const card = document.createElement('div');
        card.className = 'room-card';
        card.setAttribute('data-id', room.id);

        const status = room.data.status || 'available'; // Default to available
        const statusClass = `status-${status}`;

        card.innerHTML = `
            <div class="room-header">
                <h3>Room ${room.data.number}</h3>
                <span class="room-status ${statusClass}">${status}</span>
            </div>
            <div class="room-details">
                <p><i class="fas fa-bed"></i> Capacity: ${room.data.capacity} Students</p>
                <p><i class="fas fa-rupee-sign"></i> Rent: ₹${room.data.rent}/year</p>
            </div>
            <div class="room-actions">
                <button class="action-btn toggle-status-btn">Toggle Status</button>
                <button class="action-btn delete-btn">Delete</button>
            </div>
        `;

        roomGrid.appendChild(card);

        // --- Event Listeners for room actions ---
        card.querySelector('.delete-btn').addEventListener('click', async () => {
            if (confirm(`Are you sure you want to delete Room ${room.data.number}?`)) {
                await deleteDoc(doc(db, "rooms", room.id));
            }
        });

        card.querySelector('.toggle-status-btn').addEventListener('click', async () => {
            const newStatus = status === 'available' ? 'occupied' : 'available';
            await updateDoc(doc(db, "rooms", room.id), {
                status: newStatus
            });
        });
    });
};

// --- Firestore Logic ---
onSnapshot(collection(db, "rooms"), (snapshot) => {
    const rooms = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
    renderRooms(rooms);
});

addRoomForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const roomNumber = document.getElementById('room-number').value;
    const capacity = document.getElementById('capacity').value;
    const rent = document.getElementById('rent').value;

    try {
        await addDoc(collection(db, "rooms"), {
            number: roomNumber,
            capacity: parseInt(capacity),
            rent: parseInt(rent),
            status: 'available' // Always available when new
        });
        addRoomForm.reset();
        modal.style.display = 'none';
    } catch (error) {
        console.error("Error adding room: ", error);
        alert('Failed to add room.');
    }
}); 