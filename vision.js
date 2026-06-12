let globalMobileNetVisionInstance = null;

async function preloadVisionSystemInstance() {
    try {
        if(!globalMobileNetVisionInstance) {
            globalMobileNetVisionInstance = await mobilenet.load();
            console.log("TensorFlow Machine Vision Array Compiled Cleanly.");
        }
    } catch (err) {
        console.error("Neural Library failed initialization:", err);
    }
}

async function runVisionClassification(inputNode, previewImgId, laserId, textId, targetCategory) {
    const file = inputNode.files[0];
    if (!file) return;

    const laser = document.getElementById(laserId);
    const statusLabel = document.getElementById(textId);
    const imagePreview = document.getElementById(previewImgId);
    const badgeTag = document.getElementById(previewImgId.replace('Preview', 'Tag'));

    laser.style.display = 'block';
    statusLabel.innerText = "Running Neural Classification Matrix...";
    statusLabel.style.color = "var(--primary-purple)";
    badgeTag.style.display = 'none';

    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';

        imagePreview.onload = async () => {
            if (!globalMobileNetVisionInstance) {
                statusLabel.innerText = "Loading vision neural components... please retry.";
                globalMobileNetVisionInstance = await mobilenet.load();
                laser.style.display = 'none';
                return;
            }

            const classificationPredictions = await globalMobileNetVisionInstance.classify(imagePreview);
            console.log("Classification Output:", classificationPredictions);

            const keywordsString = classificationPredictions.map(p => p.className.toLowerCase()).join(' ');
            let resolvedType = "unknown";
            
            const foodKeywords = ['food', 'dish', 'meal', 'soup', 'salad', 'pizza', 'sandwich', 'fruit', 'vegetable', 'bread', 'meat', 'cuisine', 'sauce'];
            const hairKeywords = ['hair', 'wig', 'grooming', 'barber', 'comb', 'face', 'portrait', 'man', 'woman', 'boy', 'girl', 'headshot'];
            const clothKeywords = ['cloth', 'apparel', 'shirt', 'suit', 'coat', 'jacket', 'dress', 'jeans', 'sweater', 'jersey', 'garment', 'wardrobe', 'tie'];

            if (foodKeywords.some(keyword => keywordsString.includes(keyword))) resolvedType = "food";
            else if (hairKeywords.some(keyword => keywordsString.includes(keyword))) resolvedType = "hair";
            else if (clothKeywords.some(keyword => keywordsString.includes(keyword))) resolvedType = "outfit";

            laser.style.display = 'none';

            if (resolvedType === targetCategory) {
                statusLabel.innerText = `Verified Match! Detected Category: ${resolvedType.toUpperCase()}`;
                statusLabel.style.color = "var(--accent-green)";
                badgeTag.innerText = `AI Confirmed: ${classificationPredictions[0].className.split(',')[0]}`;
                badgeTag.style.background = "rgba(0, 230, 118, 0.15)";
                badgeTag.style.color = "var(--accent-green)";
                badgeTag.style.display = 'inline-block';
            } else {
                statusLabel.innerText = `Classification Error: App detected "${resolvedType.toUpperCase()}" instead of "${targetCategory.toUpperCase()}". Please choose another image.`;
                statusLabel.style.color = "var(--accent-red)";
                badgeTag.innerText = "Invalid Category File Vector";
                badgeTag.style.background = "rgba(255, 61, 0, 0.15)";
                badgeTag.style.color = "var(--accent-red)";
                badgeTag.style.display = 'inline-block';
                saveAnalysis(
    resolvedType,
    classificationPredictions[0].className
);
                imagePreview.style.display = 'none';
                inputNode.value = "";
            }
        };
    };
    reader.readAsDataURL(file);
}