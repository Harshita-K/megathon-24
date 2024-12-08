async function generateAverageFeedback() {
    const feedbackText = document.getElementById("feedback-text");

    try {
        const response = await fetch("/average_feedback", {
            method: "GET"
        });

        if (response.ok) {
            const data = await response.json();
            feedbackText.innerHTML = `<strong>Feedback:</strong> ${data.feedback}<br>
                                      <strong>Average Intensity:</strong> ${data.average_intensity.toFixed(2)}<br>
                                      <strong>Overall Sentiment:</strong> ${data.overall_sentiment}`;
        } else {
            feedbackText.innerText = "Error: Could not retrieve average feedback.";
        }
    } catch (error) {
        feedbackText.innerText = "Error: " + error.message;
    }
}

function analyzeText() {
    const text = $('#userInput').val();
    $.post('/predict', {text: text}, function(data) {
        $('#result').html(`<p>Sentiment: ${data['Overall Sentiment']} </p><p> Intensity: ${data['Intensity']} </p><p> Emotion : ${data['Predicted_label']}</p>`);
    });
}

function generatePlot() {
    $.get('/plot', function(data) {
        $('#plot').html(`<img src="data:image/png;base64,${data.plot_url}" />`);
    });
}


let recognition;
function startSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Your browser does not support speech recognition.');
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = function() {
        $('#userInput').attr('placeholder', 'Listening...');
    };

    recognition.onresult = function(event) {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                $('#userInput').val(event.results[i][0].transcript); // Set final recognized text
            } else {
                interimTranscript += event.results[i][0].transcript;
                $('#userInput').val(interimTranscript); // Update interim recognized text
            }
        }
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error', event);
    };

    recognition.onend = function() {
        $('#userInput').attr('placeholder', 'Enter your text here...');
    };

    recognition.start();
}
