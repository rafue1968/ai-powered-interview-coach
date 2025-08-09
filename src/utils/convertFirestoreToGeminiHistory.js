/**
 * @param {Array} firestoreInteractions - Array of { role: 'user' | 'model', text: string }
 * @returns {Array} Gemini-formatted chat history
 */
export function convertFirestoreToGeminiHistory(firestoreInteractions) {
    if (!Array.isArray(firestoreInteractions)) return [];

    return firestoreInteractions.map(interaction => ({
        role: interaction.role,
        parts: [{ text: interaction.text }],
    }));
}
