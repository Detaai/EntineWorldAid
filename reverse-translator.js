// Function to load the reverse translation data from the JSON files
async function loadReverseTranslationData(language) {
    try {
        const response = await fetch(`reverse-tranlations/${language}.json`); // Corrected folder name and template literal
        if (!response.ok) {
            throw new Error(`Error loading reverse translation data for language: ${language}. HTTP Status: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to load reverse translation data:", error.message);
        throw new Error(`Failed to load reverse translation data for ${language}. Please check if the file exists and is valid.`);
    }
}

// Updated Function to reverse translate the input text
async function reverseTranslateText() {
    const textElement = document.getElementById('text');
    const text = textElement && textElement.value ? textElement.value.trim() : null;
    const resultElement = document.getElementById('result');
    const fantasyType = document.getElementById('fantasy-type').value;

    if (!text) {
        resultElement.innerHTML = `
            <strong>Error #1:</strong> No text entered.<br>
            <em>Reference:</em> See <code>errors</code> file for details.
        `;
        return;
    }

    try {
        const { combos, letters } = await loadReverseTranslationData(fantasyType);
        const upperText = text.toUpperCase();
        let output = '';
        let i = 0;

        while (i < upperText.length) {
            let matched = false;

            // Try to match combos first (e.g., "BOGO" -> "TH")
            for (let len = 4; len > 0; len--) {
                const chunk = upperText.substring(i, i + len);
                if (combos[chunk]) {
                    output += combos[chunk];
                    i += len;
                    matched = true;
                    break;
                }
            }

            if (matched) continue;

            // Try to match letters (e.g., "MAS" -> "T")
            for (let len = 4; len > 0; len--) {
                const chunk = upperText.substring(i, i + len);
                if (letters[chunk]) {
                    output += letters[chunk];
                    i += len;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                // If no match, just add the original character
                output += upperText[i];
                i++;
            }
        }

        resultElement.innerHTML = `<strong>Result:</strong><br>${output}`;
    } catch (error) {
        resultElement.innerHTML = `
            <strong>Error:</strong> ${error.message}<br>
            <em>Reference:</em> Translation failed.
        `;
    }
}

// Function to reverse translate to English (if needed elsewhere)
function reverseTranslateToEnglish(text, translationData) {
    // Convert the input text to uppercase
    let translatedText = text.toUpperCase();

    // Step 1: Replace combos
    const combos = Object.keys(translationData.combos || {}).sort((a, b) => b.length - a.length); // Sort combos by length
    combos.forEach(combo => {
        const regex = new RegExp(combo, 'g'); // Global match for the combo
        translatedText = translatedText.replace(regex, translationData.combos[combo].toLowerCase()); // Convert translation to lowercase
    });

    // Step 2: Replace single letters
    translatedText = translatedText.split('').map(char => {
        if (translationData.letters && translationData.letters[char]) {
            return translationData.letters[char].toLowerCase(); // Translate and convert to lowercase
        } else {
            console.warn(`Warning: No translation found for character "${char}". Keeping it as is.`);
            return char; // Keep the character as is if no translation exists
        }
    }).join('');

    // Step 3: Apply suffix rules
    for (const [suffix, replacement] of Object.entries(translationData.suffixes || {})) {
        if (translatedText.endsWith(suffix)) {
            console.log(`Applying suffix rule: "${suffix}" → "${replacement}"`);
            translatedText = translatedText.slice(0, -suffix.length) + replacement.toLowerCase(); // Convert suffix replacement to lowercase
        }
    }

    return translatedText;
}