document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.getElementById('reportForm');

    if (reportForm) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(reportForm);

            const accused = formData.get('accused');
            const position = formData.get('position');
            const description = formData.get('description');
            const location_incidence = formData.get('location_incidence');
            const date = formData.get('date'); 

            try {
                const response = await fetch ('/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ accused, position, description, location_incidence, date })
                });
                if (response.ok) {
                    alert('Report submitted successfully');
                    window.location.href ='/';
                } else {
                    alert('Submission failed');
                }
                
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
});