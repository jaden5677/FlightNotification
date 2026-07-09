// Backend base URL. The Flask API runs on 8080 (docker compose publishes
// 8080:8080). Flip USE_MOCKS to true to run the UI fully offline against the
// in-memory mock services instead of the real backend.
export const API_BASE_URL = 'http://localhost:8080';
export const USE_MOCKS = false;
