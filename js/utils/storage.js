// Character storage utilities for localStorage

const STORAGE_KEY = 'delta_green_characters';
const STORAGE_LIMIT = 20;

// Generate unique ID for characters
function generateCharacterId() {
    return 'char_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

// Get all saved characters
export function getAllCharacters() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return [];
        }
        const characters = JSON.parse(stored);
        // Sort by createdDate descending (newest first)
        return characters.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    } catch (error) {
        console.error('Error reading characters from storage:', error);
        return [];
    }
}

// Get a specific character by ID
export function getCharacterById(id) {
    const characters = getAllCharacters();
    return characters.find(char => char.id === id) || null;
}

// Save a character to storage
export function saveCharacter(characterData) {
    try {
        const characters = getAllCharacters();
        
        // Check if this is an update (character already has an ID)
        if (characterData.id) {
            const index = characters.findIndex(char => char.id === characterData.id);
            if (index !== -1) {
                // Update existing character
                characters[index] = {
                    ...characters[index],
                    ...characterData,
                    lastModified: new Date().toISOString()
                };
            } else {
                // ID exists but character not found, treat as new
                characterData.id = generateCharacterId();
                characterData.createdDate = new Date().toISOString();
                characterData.lastModified = new Date().toISOString();
                characters.push(characterData);
            }
        } else {
            // New character
            characterData.id = generateCharacterId();
            characterData.createdDate = new Date().toISOString();
            characterData.lastModified = new Date().toISOString();
            characters.push(characterData);
        }

        // Enforce storage limit - remove oldest if over limit
        if (characters.length > STORAGE_LIMIT) {
            // Sort by createdDate ascending to get oldest first
            characters.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
            // Remove oldest characters until under limit
            while (characters.length > STORAGE_LIMIT) {
                characters.shift();
            }
            // Re-sort by createdDate descending (newest first)
            characters.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
        return characterData.id;
    } catch (error) {
        console.error('Error saving character to storage:', error);
        throw error;
    }
}

// Delete a character by ID
export function deleteCharacter(id) {
    try {
        const characters = getAllCharacters();
        const filtered = characters.filter(char => char.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return true;
    } catch (error) {
        console.error('Error deleting character from storage:', error);
        return false;
    }
}

// Update character name
export function updateCharacterName(id, newName) {
    try {
        const characters = getAllCharacters();
        const character = characters.find(char => char.id === id);
        if (character) {
            character.name = newName;
            character.lastModified = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error updating character name:', error);
        return false;
    }
}

// Get storage limit
export function getStorageLimit() {
    return STORAGE_LIMIT;
}

// Check if storage is full
export function isStorageFull() {
    const characters = getAllCharacters();
    return characters.length >= STORAGE_LIMIT;
}

// Get number of stored characters
export function getStoredCharacterCount() {
    return getAllCharacters().length;
}

// Get only own characters (not imported)
export function getOwnCharacters() {
    const allCharacters = getAllCharacters();
    return allCharacters.filter(char => !char.imported);
}

// Get only imported characters
export function getImportedCharacters() {
    const allCharacters = getAllCharacters();
    return allCharacters.filter(char => char.imported === true);
}

// Import character from external source (URL, file, etc.)
export function importCharacter(characterData) {
    try {
        // Ensure imported flag is set
        const importData = {
            ...characterData,
            imported: true,
            importedDate: new Date().toISOString()
        };
        
        // Remove id if present to create new entry
        delete importData.id;
        
        return saveCharacter(importData);
    } catch (error) {
        console.error('Error importing character:', error);
        throw error;
    }
}

