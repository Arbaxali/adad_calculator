// const textOutput = document.getElementById("urduText");
// const startListeningBtn = document.getElementById("startListening");
// const submitBtn = document.getElementById("submitButton");

// startListeningBtn.addEventListener('click', function () {
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//    // recognition.lang = 'en-US'; // Set language as needed
//    recognition.lang = 'ur-PK' 
//    recognition.interimResults = false;

//     recognition.onstart = () => {
//         startListeningBtn.textContent = "Listening...";
//         startListeningBtn.disabled = true; // Disable button while listening
//     };

//     recognition.onresult = (event) => {
//         const transcript = event.results[0][0].transcript; // Get the transcript
//         textOutput.value = transcript; // Output to the text area
//     };

//     recognition.onend = () => {
//         startListeningBtn.textContent = "Start Listening";
//         startListeningBtn.disabled = false; // Enable button after listening ends
//     };

//     recognition.onerror = (event) => {
//         console.error('Speech recognition error:', event.error);
//     };

//     recognition.start(); // Start recognition
// });

// // Add submit functionality
// submitBtn.addEventListener('click', function () {
//     const inputText = textOutput.value;
//     // You can handle the submission of inputText here
//     console.log("Submitted Text:", inputText); // Placeholder for submit action
// });


// //

// // Handle submit button click
// document.getElementById('submitButton').addEventListener('click', async function () {
//     const urduText = document.getElementById('urduText').value;
    
    
//         // document.getElementById('form-container').style.display = 'block';
//         // document.getElementById('result').style.display = 'none';
//         // document.getElementById('urlForm').reset();
//          // Call resetForm to reload the page
    
    
//     if (urduText === '') {
//         alert('Please enter some Urdu text before submitting.');
//         return;
//     }

// // document.getElementById('submitButton').addEventListener('click', async function () {
// //     const urduTextElement = document.getElementById('urduText');
// //     const urduText = urduTextElement.value;

// //     if (urduText === '') {
// //         alert('Please enter some Urdu text before submitting.');
// //         return;
// //     }

// //     // Assuming you process the urduText here...
// //     console.log('Processing text: ', urduText);

// //     // Clear the textarea after submission
// //     urduTextElement.value = '';

// //     // You can also reset other parts of the form, like hiding/showing the form elements
// //    // resetForm();
// // }


//     // Prepare the payload
//     const payload = {
//         text: urduText
//     };

//     try {
//         // Send POST request to FastAPI
//         // const response = await fetch('https://adadcontainer-521824227311.us-central1.run.app/calculate_adad', {
//         //     method: 'POST',
//         //     headers: {
//         //         'Content-Type': 'application/json'
//         //     },
//         //     body: JSON.stringify(payload)

//         const response = await fetch('http://127.0.0.1:8000/calculate_adad', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(payload)
//         });

//         // Parse the JSON response
//         const data = await response.json();

//         // Update the result section with received data
//         document.getElementById('resultText').textContent = `Text: ${data.text}`;
//         document.getElementById('adadValue').textContent = `Adad Value: ${data.adad_value}`;
        
//         const breakdownList = document.getElementById('adadBreakdown');
//         breakdownList.innerHTML = '';  // Clear existing list items

//         data.adad_breakdown.forEach(item => {
//             const li = document.createElement('li');
//             li.textContent = item;
//             breakdownList.appendChild(li);
//         });

//         // Hide input section and show result section
//         document.getElementById('input-section').style.display = 'none';
//         document.querySelector('.interaction-container').style.display = 'none';
//         document.getElementById('result-section').style.display = 'block';
        
//     } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred while fetching the adad result.');
//     }
// });

// // Handle back button click
// document.getElementById('backButton').addEventListener('click', function () {
//     // Hide the result section and show the input section again
//     document.getElementById('result-section').style.display = 'none';
//     document.getElementById('input-section').style.display = 'block';
//     document.querySelector('.interaction-container').style.display = 'block';
//     //urduTextElement.value = '';
//     textOutput.value = '';
//     // Scroll back to the top of the page
//     window.scrollTo({ top: 0, behavior: 'smooth' });
// });



const apiTransliterateUrl = "http://127.0.0.1:8000/transliterate";

const textOutput = document.getElementById("urduText");
const startListeningBtn = document.getElementById("startListening");
const translateButton = document.getElementById("translateButton");
const submitBtn = document.getElementById("submitButton");

startListeningBtn.addEventListener('click', function () {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ur-PK';
    recognition.interimResults = false;

    recognition.onstart = () => {
        startListeningBtn.textContent = "Listening...";
        startListeningBtn.disabled = true;
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        textOutput.value = transcript;
    };

    recognition.onend = () => {
        startListeningBtn.textContent = "Start Listening";
        startListeningBtn.disabled = false;
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };

    recognition.start();
});

// Add functionality for Translate button
translateButton.addEventListener('click', async function () {
    const inputText = englishText.value;

    if (inputText === '') {
        alert('Please enter some text to transliterate.');
        return;
    }

    try {
        const transliteratedText = await transliterateToUrdu(inputText);

        if (!transliteratedText) {
            alert('Failed to transliterate the text.');
            return;
        }

        console.log("Transliterated Text:", transliteratedText);

        // Update the text area with the transliterated text
        textOutput.value = transliteratedText;
    } catch (error) {
        console.error('Error during transliteration:', error);
        alert('An error occurred while transliterating the text.');
    }
});

// Add submit functionality
submitBtn.addEventListener('click', async function () {
    const inputText = textOutput.value;

    if (inputText === '') {
        alert('Please enter some Urdu text before submitting.');
        return;
    }

    try {
        await calculateAdad(inputText);
    } catch (error) {
        console.error('Error during Adad calculation:', error);
        alert('An error occurred while processing your request.');
    }
});

// Function to transliterate text using the FastAPI endpoint
async function transliterateToUrdu(text) {
    const payload = {
        "name": text
    };

    try {
        const response = await fetch(apiTransliterateUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Return the Urdu name from the response
        return data.urdu_name || null;
    } catch (error) {
        console.error("Error during transliteration:", error);
        return null;
    }
}

// Function to calculate Adad using FastAPI
async function calculateAdad(transliteratedText) {
    const payload = {
        text: transliteratedText
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/calculate_adad', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Update the result section with received data
        document.getElementById('resultText').textContent = `Text: ${data.text}`;
        document.getElementById('adadValue').textContent = `Adad Value: ${data.adad_value}`;

        const breakdownList = document.getElementById('adadBreakdown');
        breakdownList.innerHTML = '';

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
        console.error('Error during Adad calculation:', error);
        alert('An error occurred while fetching the Adad result.');
    }
}

// Handle back button click
document.getElementById('backButton').addEventListener('click', function () {
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('input-section').style.display = 'block';
    document.querySelector('.interaction-container').style.display = 'block';
    textOutput.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
