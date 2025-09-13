export function convertFirestoreToGeminiHistory(firestoreInteractions) {
    if (!Array.isArray(firestoreInteractions)) return [];

    return firestoreInteractions.map(interaction => ({
        role: interaction.role,
        parts: [{ text: interaction.text }],
    }));
}
