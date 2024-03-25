document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:9090/api/v1/users')
        .then(response => response.json())
        .then(data => {
            const selectElement = document.getElementById('fullname');

            data.forEach(user => {
                const option = document.createElement('option');
                option.value = user.fullname;
                option.text = user.fullname;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
