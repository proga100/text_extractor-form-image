document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const fileLabel = document.getElementById('file-label');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removeImageBtn = document.getElementById('remove-image');
    const extractBtn = document.getElementById('extract-btn');
    const resultContainer = document.getElementById('result-container');
    const extractedText = document.getElementById('extracted-text');
    const copyBtn = document.getElementById('copy-btn');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    // Event Listeners for Drag and Drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropArea.classList.add('highlight');
    }

    function unhighlight() {
        dropArea.classList.remove('highlight');
    }

    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length) {
            handleFiles(files);
        }
    }

    // Handle file input change
    fileInput.addEventListener('change', function() {
        if (this.files.length) {
            handleFiles(this.files);
        }
    });

    // Process the selected files
    function handleFiles(files) {
        const file = files[0]; // Only process the first file
        
        // Check if file is an image
        if (!file.type.match('image.*')) {
            showError('Please select an image file (PNG, JPG, JPEG, BMP)');
            return;
        }
        
        // Display image preview
        const reader = new FileReader();
        
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            previewContainer.classList.remove('hidden');
            fileLabel.style.display = 'none';
            extractBtn.disabled = false;
        };
        
        reader.readAsDataURL(file);
    }

    // Remove selected image
    removeImageBtn.addEventListener('click', () => {
        resetForm();
    });

    // Reset the form
    function resetForm() {
        fileInput.value = '';
        imagePreview.src = '#';
        previewContainer.classList.add('hidden');
        fileLabel.style.display = 'flex';
        extractBtn.disabled = true;
        resultContainer.classList.add('hidden');
        errorMessage.classList.add('hidden');
    }

    // Extract text from image
    extractBtn.addEventListener('click', () => {
        if (!fileInput.files.length) return;
        
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('image', file);
        
        // Show loading spinner
        loading.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        errorMessage.classList.add('hidden');
        
        // Send request to server
        fetch('/extract', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Failed to extract text');
                });
            }
            return response.json();
        })
        .then(data => {
            // Hide loading spinner
            loading.classList.add('hidden');
            
            // Display extracted text
            extractedText.textContent = data.text || 'No text found in the image';
            resultContainer.classList.remove('hidden');
        })
        .catch(error => {
            // Hide loading spinner
            loading.classList.add('hidden');
            
            // Show error message
            showError(error.message);
        });
    });

    // Copy extracted text to clipboard
    copyBtn.addEventListener('click', () => {
        const text = extractedText.textContent;
        
        if (!text) return;
        
        navigator.clipboard.writeText(text)
            .then(() => {
                // Change button text temporarily
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                showError('Failed to copy text: ' + err);
            });
    });

    // Show error message
    function showError(message) {
        errorText.textContent = message;
        errorMessage.classList.remove('hidden');
    }
}); 