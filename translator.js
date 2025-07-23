// Function to load the translation data (from the JSON files)
async function loadTranslationData(language) {
    try {
        const response = await fetch(`translations/${language}.json`); // Fetch the JSON file
        if (!response.ok) {
            throw new Error(`Error loading translation data for language: ${language}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to load translation data:", error);
        throw error;
    }
}

// Function to translate the input text
async function translateText() {
    const textElement = document.getElementById('text');
    const text = textElement && textElement.value ? textElement.value.trim() : null;
    const resultElement = document.getElementById('result');
    const fantasyType = document.getElementById('fantasy-type').value;

    if (!text) {
        resultElement.innerHTML = "Please enter text.";
        return;
    }

    try {
        // Load translation data
        const translationData = await loadTranslationData(fantasyType);
        console.log("Loaded translation data:", translationData); // Debug: check if the data is loaded correctly

        let translatedText = text.toUpperCase(); // Convert input text to uppercase

        // Step 1: Replace combos
        const combos = Object.keys(translationData.combos || {}).sort((a, b) => b.length - a.length); // Sort combos by length
        combos.forEach(combo => {
            const regex = new RegExp(combo, 'g'); // Global match for the combo
            translatedText = translatedText.replace(regex, match => `{{${translationData.combos[combo].toLowerCase()}}}`); // Wrap in double curly braces
        });

        // Step 2: Replace single letters (ignore anything inside double curly braces)
        translatedText = translatedText.replace(/{{.*?}}/g, match => match); // Preserve combos
        let finalText = '';

        for (let i = 0; i < translatedText.length; i++) {
            const char = translatedText[i];

            // Skip anything inside double curly braces
            if (translatedText.slice(i, i + 2) === '{{') {
                const endIndex = translatedText.indexOf('}}', i);
                finalText += translatedText.slice(i, endIndex + 2); // Add the entire combo untouched
                i = endIndex + 1; // Skip to the end of the combo
                continue;
            }

            // Replace single letters
            finalText += translationData.letters && translationData.letters[char]
                ? translationData.letters[char].toLowerCase()
                : char;
        }

        // Step 3: Remove double curly braces from the final output
        translatedText = finalText.replace(/{{|}}/g, '');

        // Step 4: Convert to uppercase if the fantasy type is "randeth-writting"
        if (fantasyType === "randeth-writting") {
            translatedText = translatedText.toUpperCase();
        }

        // Display the final translated text
        resultElement.innerHTML = translatedText; // Output the translated text
    } catch (error) {
        resultElement.innerHTML = "Error loading translation data.";
        console.error("Translation Error:", error);
    }
}
