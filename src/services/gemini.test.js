// Mock localStorage for node testing environment
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
global.localStorage = localStorageMock;

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getStoredApiKey, 
  setStoredApiKey, 
  getStoredModel, 
  setStoredModel,
  getFanConciergeResponse,
  getOperationsMitigationPlan
} from './gemini';

describe('ArenaFlow Gemini Configuration Services', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should store and retrieve the API Key correctly', () => {
    expect(getStoredApiKey()).toBe('');
    setStoredApiKey('  AIzaSyTestKey123  ');
    // Trimming test
    expect(getStoredApiKey()).toBe('AIzaSyTestKey123');
  });

  it('should store and retrieve the model correctly, defaulting to gemini-3.5-flash', () => {
    expect(getStoredModel()).toBe('gemini-3.5-flash');
    setStoredModel('gemini-pro-latest');
    expect(getStoredModel()).toBe('gemini-pro-latest');
  });
});

describe('ArenaFlow Offline Mock AI Responses', () => {
  it('should return appropriate mock responses for wheelchair queries in English', async () => {
    const response = await getFanConciergeResponse('where are the wheelchair accessible ramps?', 'en');
    expect(response).toContain('Accessibility Assistance');
    expect(response).toContain('Elevators');
  });

  it('should return default message in Spanish for generic queries', async () => {
    const response = await getFanConciergeResponse('hola', 'es');
    expect(response).toContain('Copa Mundial de la FIFA');
  });

  it('should generate correct action plans for operations congestion', async () => {
    const incident = { gate: 'Gate C', type: 'Crowd Congestion', density: '90%' };
    const plan = await getOperationsMitigationPlan(incident);
    expect(plan).toContain('Action Mitigation Strategy');
    expect(plan).toContain('Gate C');
    expect(plan).toContain('Rerouting');
  });
});
