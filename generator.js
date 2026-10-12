document.getElementById('card-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevents the page from refreshing

    // 1. Get the values the user typed in
    const to = document.getElementById('to').value;
    const occasion = document.getElementById('occasion').value;
    const msg = document.getElementById('msg').value;

    // 2. Automatically safely encode them into URL parameters
    const params = new URLSearchParams({
        to: to,
        occasion: occasion,
        msg: msg
    });

    // 3. Construct the final URL
    // This assumes your main card file is named 'index.html' in the same folder.
    let baseUrl = window.location.href.replace('generator.html', 'index.html');

    // If you are testing from a local file, ensure it formats right
    if (!baseUrl.endsWith('index.html')) {
        baseUrl += 'index.html';
    }

    const fullUrl = `${baseUrl}?${params.toString()}`;

    // 4. Show the result section and populate the link
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('generated-url').value = fullUrl;
    document.getElementById('preview-link').href = fullUrl;

    // Reset the copy button text just in case
    document.getElementById('copy-btn').textContent = 'Copy Link';
});

// Copy to clipboard functionality
document.getElementById('copy-btn').addEventListener('click', function() {
    const urlInput = document.getElementById('generated-url');

    // Select the text and copy it
    urlInput.select();
    navigator.clipboard.writeText(urlInput.value).then(() => {
        // Change button text briefly to show it worked
        const btn = document.getElementById('copy-btn');
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = 'Copy Link';
        }, 2000);
    });
});
