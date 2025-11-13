// Firebase configuration
export const firebaseConfig = {
    apiKey: "AIzaSyAqLDOVn5zJgQhG8jpKS5wJ2uGbKR8KDzw",
    authDomain: "delta-green-agents.firebaseapp.com",
    databaseURL: "https://delta-green-agents-default-rtdb.firebaseio.com",
    projectId: "delta-green-agents",
    storageBucket: "delta-green-agents.firebasestorage.app",
    messagingSenderId: "385876877940",
    appId: "1:385876877940:web:c4807a06db3d2ee883e721"
};

// Firestore collection names
export const COLLECTIONS = {
    CHARACTERS: 'characters',
    REPORTS: 'reports'
};

// Character moderation status
export const MODERATION_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    FLAGGED: 'flagged'
};

