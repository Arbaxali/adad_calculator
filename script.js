const textOutput = document.getElementById("urduText");
const startListeningBtn = document.getElementById("startListening");
const submitBtn = document.getElementById("submitButton");

startListeningBtn.addEventListener('click', function () {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
   // recognition.lang = 'en-US'; // Set language as needed
   recognition.lang = 'ur-PK' 
   recognition.interimResults = false;

    recognition.onstart = () => {
        startListeningBtn.textContent = "Listening...";
        startListeningBtn.disabled = true; // Disable button while listening
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript; // Get the transcript
        textOutput.value = transcript; // Output to the text area
    };

    recognition.onend = () => {
        startListeningBtn.textContent = "Start Listening";
        startListeningBtn.disabled = false; // Enable button after listening ends
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };

    recognition.start(); // Start recognition
});

// Add submit functionality
submitBtn.addEventListener('click', function () {
    const inputText = textOutput.value;
    // You can handle the submission of inputText here
    console.log("Submitted Text:", inputText); // Placeholder for submit action
});


//

// Handle submit button click
document.getElementById('submitButton').addEventListener('click', async function () {
    const urduText = document.getElementById('urduText').value;

    if (urduText === '') {
        alert('Please enter some Urdu text before submitting.');
        return;
    }

    // Prepare the payload
    const payload = {
        text: urduText
    };

    try {
        // Send POST request to FastAPI
        //const response = await fetch('http://127.0.0.1:8000/calculate_adad', {
        const response = await fetch('https://adad-api.onrender.com/calculate_adad', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // Parse the JSON response
        const data = await response.json();

        // Update the result section with received data
        document.getElementById('resultText').textContent = `Text: ${data.text}`;
        document.getElementById('adadValue').textContent = `Adad Value: ${data.adad_value}`;
        
        const breakdownList = document.getElementById('adadBreakdown');
        breakdownList.innerHTML = '';  // Clear existing list items

        data.adad_breakdown.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            breakdownList.appendChild(li);
        });

        // Hide input section and show result section
        document.getElementById('input-section').style.display = 'none';
        document.querySelector('.interaction-container').style.display = 'none';
        document.getElementById('result-section').style.display = 'block';

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching the adad result.');
    }
});

// Handle back button click
document.getElementById('backButton').addEventListener('click', function () {
    // Hide the result section and show the input section again
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('input-section').style.display = 'block';
    document.querySelector('.interaction-container').style.display = 'block';

    // Scroll back to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

