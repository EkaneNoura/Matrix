document.addEventListener('DOMContentLoaded', function() {
    // Profile picture change functionality
    const profilePicture = document.getElementById('profilePicture');
    const profilePictureInput = document.getElementById('profilePictureInput');
    const profilePictureContainer = document.querySelector('.profile-picture-container');
    
    profilePictureContainer.addEventListener('click', function() {
        profilePictureInput.click();
    });
    
    profilePictureInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                profilePicture.src = event.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });
})