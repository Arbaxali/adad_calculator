// const apiTransliterateUrl = "http://127.0.0.1:8000/transliterate";
// const apiworking = "http://127.0.0.1:8000/";

const apiTransliterateUrl = "https://adad-api-1.onrender.com/transliterate"
const apiworking = "https://adad-api-1.onrender.com/" ;
const textOutput = document.getElementById("urduText");
const startListeningBtn = document.getElementById("startListening");
const translateButton = document.getElementById("translateButton");
const submitBtn = document.getElementById("submitButton");
const englishTextbox = document.getElementById("englishText")


document.addEventListener("DOMContentLoaded", ()=>{
    TriggerApi();
})



async function TriggerApi() {

    try {
        const resp1 = await fetch(apiworking);

        if (!resp1.ok) {
            throw new Error(`Response status: ${resp1.status}`);
        }

        const json1  = await resp1.json()
        console.log(json1);


    } catch (error) {   
        console.error(error.message);
        
    }
    
}
startListeningBtn.addEventListener('click', function () {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ur-PK';
    recognition.interimResults = false;

    

    
    translateButton.disabled = true; 
    englishTextbox.value = ''; 
    englishTextbox.readOnly = true; 
    
    recognition.onstart = () => {
        startListeningBtn.textContent = "Listening...";
        startListeningBtn.disabled = true;
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        textOutput.value = transcript; // Assign Urdu text to the Urdu text box
    };

    recognition.onend = () => {
        startListeningBtn.textContent = "Start Listening";
        startListeningBtn.disabled = false;

        
        translateButton.disabled = false; 
        englishTextbox.readOnly = false; 
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);

        
        translateButton.disabled = false;
        englishTextbox.readOnly = false;
    };

    recognition.start();
});





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

        
        textOutput.value = transliteratedText;
    } catch (error) {
        console.error('Error during transliteration:', error);
        alert('An error occurred while transliterating the text.');
    }
});

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


async function calculateAdad(transliteratedText) {
    const payload = {
        text: transliteratedText
    };

    try {
        const response = await fetch('https://adad-api-1.onrender.com/calculate_adad', {
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


document.getElementById('backButton').addEventListener('click', function () {
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('input-section').style.display = 'block';
    document.querySelector('.interaction-container').style.display = 'block';
    textOutput.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
