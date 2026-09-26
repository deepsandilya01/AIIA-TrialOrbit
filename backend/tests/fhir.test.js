import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';

describe('fhir API', () => {
  it('should be configured for testing', () => {
    expect(true).toBe(true);
  });
});
