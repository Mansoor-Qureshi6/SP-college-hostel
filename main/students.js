import { db } from './firebase-config.js';
import { collection, addDoc, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// --- Get DOM Elements ---
const addStudentBtn = document.getElementById('add-student-btn');
const modal = document.getElementById('add-student-modal');
const closeModalBtn = document.querySelector('.modal .close');
const addStudentForm = document.getElementById('add-student-form');
const studentTableBody = document.getElementById('student-table-body');

// --- Modal Logic ---
addStudentBtn.addEventListener('click', () => { modal.style.display = 'block'; });
closeModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});
// --- End Modal Logic ---

// --- Render Students ---
const renderStudents = (students) => {
    studentTableBody.innerHTML = ''; // Clear the table first
    students.forEach(student => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', student.id);

        row.innerHTML = `
            <td>${student.data.name}</td>
            <td>${student.data.rollNumber}</td>
            <td>${student.data.roomNumber}</td>
            <td>${student.data.contact}</td>
            <td class="action-buttons">
                <button class="action-btn delete-btn">Delete</button>
            </td>
        `;

        studentTableBody.appendChild(row);

        // Add event listener for delete button
        row.querySelector('.delete-btn').addEventListener('click', async () => {
            if (confirm(`Are you sure you want to delete ${student.data.name}?`)) {
                await deleteDoc(doc(db, "students", student.id));
            }
        });
    });
};

// --- Firestore Logic ---
// Real-time listener for students
onSnapshot(collection(db, "students"), (snapshot) => {
    const students = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
    renderStudents(students);
});

// Handle form submission for adding a new student
addStudentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const studentName = document.getElementById('student-name').value;
    const rollNumber = document.getElementById('roll-number').value;
    const roomNumber = document.getElementById('room-number').value;
    const contact = document.getElementById('contact-number').value;

    try {
        await addDoc(collection(db, "students"), {
            name: studentName,
            rollNumber: rollNumber,
            roomNumber: roomNumber,
            contact: contact
        });
        addStudentForm.reset();
        modal.style.display = 'none';
    } catch (e) {
        console.error("Error adding student: ", e);
        alert('Error adding student. Please try again.');
    }
}); 