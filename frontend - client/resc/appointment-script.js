function scheduleAppointment() {
    window.location.href = "schedule.html";
}
document.addEventListener('DOMContentLoaded', function () {
    const appointmentForm = document.getElementById('appointment-form');
    const fullnameSelect = document.getElementById('fullname');

    fetch('http://localhost:9090/api/v1/users/patient')
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.text = user.fullname;
                fullnameSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
document.addEventListener('DOMContentLoaded', function () {
    const doctornameSelect = document.getElementById('recommending-doctor');

    fetch('http://localhost:9090/api/v1/users/doctor')
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                const option = document.createElement('option');
                option.value = user.fullname;
                option.text = user.fullname;
                doctornameSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
document.addEventListener('DOMContentLoaded', function () {
    const technicianameSelect = document.getElementById('assigned-technician');

    fetch('http://localhost:9090/api/v1/users/technician')
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                const option = document.createElement('option');
                option.value = user.fullname;
                option.text = user.fullname;
                technicianameSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.addEventListener('DOMContentLoaded', function () {
    const appointmentForm = document.getElementById('appointment-form');

    appointmentForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get form data
        const formData = new FormData(appointmentForm);
        for (const [key, value] of formData.entries()) {
            if (value.trim() === '') {
                showModal('Please fill in all fields.');
                return;
            }
        }
        const userID = formData.get('fullname');

        const appointmentDate = new Date(formData.get('appointment-date'));
        const currentDate = new Date();

        if (appointmentDate < currentDate) {
            showModal('Please select a valid date.');
            return;
        }
        const appointmentTime = formData.get('appointment-time');
        const testType = formData.get('test-type');
        const assignedTechnician = formData.get('assigned-technician');
        if (!/^[a-zA-Z\s]*$/.test(assignedTechnician)) {
            showModal('Technician name can only contain alphabets and spaces.');
            return;
        }
        const recommendingDoctor = formData.get('recommending-doctor');
        if (!/^[a-zA-Z\s]*$/.test(recommendingDoctor)) {
            showModal('Doctor name can only contain alphabets and spaces.');
            return;
        }


        if (!userID || !appointmentDate || !appointmentTime || !testType || !assignedTechnician || !recommendingDoctor) {
            showModal('All fields are required');
            return;
        }

        console.log('User ID:', userID);
        console.log('Appointment Date:', appointmentDate);
        console.log('Appointment Time:', appointmentTime);
        console.log('Test Type:', testType);
        console.log('Assigned Technician:', assignedTechnician);
        console.log('Recommending Doctor:', recommendingDoctor);
		
		document.getElementById("newSchedulebtn").disabled = true;

        fetch('http://localhost:9090/api/v1/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: { id: userID },
                appointmentDate: appointmentDate,
                appointmentTime: appointmentTime,
                testType: testType,
                assignedTechnician: assignedTechnician,
                recommendingDoctor: recommendingDoctor
            })
        })
            .then(response => {
				document.getElementById("newSchedulebtn").disabled = false;
                if (response.ok) {
                    console.log('Appointment scheduled successfully');
                    showModal('Appointment scheduled successfully');
                    window.location.href = 'technician.html';
                } else {
                    showModal('Error: Failed to schedule appointment.');
                    console.error('Failed to schedule appointment');
                }
            })
            .catch(error => {
                showModal('Error: Can not schedule appointment server side issue.');
                console.error('Error:', error);
            });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:9090/api/v1/appointments')
        .then(response => response.json())
        .then(data => {
            const appointmentTableBody = document.getElementById('appointment-table-body');

            data.forEach(appointment => {
                const row = document.createElement('tr');
                const appointmentDate = new Date(appointment.appointmentDate);
                const formattedDate = appointmentDate.toLocaleDateString();
                row.innerHTML = `
                    <td>${appointment.appointmentID}</td>
                    <td>${appointment.testType}</td>
                    <td>${formattedDate}</td>
                    <td>${appointment.appointmentTime}</td>
                `;
                appointmentTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function showModal(message) {
    const modal = document.getElementById('myModal');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;
    modal.style.display = 'block';

    var closeButton = document.querySelector('.close');

    closeButton.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}
