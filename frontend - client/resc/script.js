document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const baseURL = "http://localhost:9090/api/v1/users";
        const formData = new FormData(loginForm);
        const username = formData.get('username');
        const password = formData.get('password');
        const user = {
            username: username,
            password: password
        };
        fetch(baseURL + "/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Invalid username or password');
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userId', data.id);
                console.log("Local " + localStorage.getItem('userId'));
                switch (data.userRole) {
                    case "admin":
                        window.location.href = 'admin-home.html';
                        break;
                    case "patient":
                        window.location.href = 'patient-home.html';
                        break;
                    case "doctor":
                        window.location.href = 'doctor.html';
                        break;
                    case "technician":
                        window.location.href = 'technician.html';
                        break;
                    default:

                        break;
                }
            })
            .catch(error => {

                alert('Invalid username or password');
            });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const regForm = document.getElementById('reg-form');

    regForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(regForm);

        for (const [key, value] of formData.entries()) {
            if (value.trim() === '') {
                showModal('Please fill in all fields.');
                return;
            }
        }

        // Validate username
        const username = formData.get('username');
        if (!username.trim()) {
            showModal('Username cannot be empty.');
            return;
        }

        // Validate password
        const password = formData.get('password');
        if (password.length < 6 || password.length > 20) {
            showModal('Password must be between 6 and 20 characters.');
            //showModal();
            return;
        }

        // Validate fullname
        const fullname = formData.get('fullname');
        if (!/^[a-zA-Z\s]*$/.test(fullname)) {
            showModal('Full Name can only contain alphabets and spaces.');
            return;
        }

        // Validate email
        const email = formData.get('email');
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            showModal('Invalid email format.');
            return;
        }

        // Validate date of birth
        const dob = new Date(formData.get('dob'));
        const currentDate = new Date();

        if (dob >= currentDate) {
            showModal('Please select a valid date of birth.');
            return;
        }

        const role = formData.get('role');


        const userData = {
            username: username,
            password: password,
            fullname: fullname,
            email: email,
            dob: dob.toISOString().split('T')[0],
            userRole: role
        };

        // Proceed with registration if all fields are valid
        fetch('http://localhost:9090/api/v1/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (response.ok) {
                    console.log('Registration successful');
                    showModal('Registration successful');
                    document.getElementById("reg-form").reset();
                } else {
                    console.error('Registration failed');
                    showModal('Registration failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showModal('Error: ' + error)
            });
    });
});

// Function to show modal with message
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
function closeErrorMessage() {
    var errorMessage = document.getElementById('error-message');
    errorMessage.style.visibility = false;
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:9090/api/v1/users')
        .then(response => response.json())
        .then(data => {
            const userTableBody = document.getElementById('user-table-body');
            data.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.fullname}</td>
                    <td>${user.email}</td>
                    <td>${user.username}</td>
                `;
                userTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});



