
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const predictButton = document.getElementById('predict');
const result = document.getElementById('result');
const insightsDiv = document.getElementById('insights');
const context = canvas.getContext('2d');
const capturedImage = document.getElementById('capturedImage');
const skin_quality_score= document.getElementById('skin_quality_score');

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => { video.srcObject = stream; })
    .catch(err => console.error("Camera access denied", err));

captureButton.addEventListener('click', () => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');
    capturedImage.src = imageData;
    capturedImage.style.display = 'block';
});

predictButton.addEventListener('click', async () => {
    const imageData = canvas.toDataURL('image/jpeg');
    const skinFactors = {
        sun_exposure: document.getElementById('sun_exposure').value,
        sleep_cycle: document.getElementById('sleep_cycle').value,
        diet_level: document.getElementById('diet_level').value,
        stress_level: document.getElementById('stress_level').value,
        water_intake: document.getElementById('water_intake').value
    };

    const response = await fetch('/upload_webcam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData, skin_factors: skinFactors })
    });
    const data = await response.json();

    if (data.error) {
        result.innerHTML = `❌ Error: ${data.error}`;
    } else {
        result.innerHTML = `✅ Real Age: <b>${data.real_age}</b>, Skin Age: <b>${data.skin_age}</b>`;
        insightsDiv.innerHTML = "<h3>Skin Insights:</h3>" + Object.entries(data.insights).map(([key, value]) => `<p><b>${key.replace(/_/g, ' ')}:</b> ${value}</p>`).join('');

        skin_quality_score.innerHTML= `Skin Score:${data.skin_quality_score}`;
    }
});
