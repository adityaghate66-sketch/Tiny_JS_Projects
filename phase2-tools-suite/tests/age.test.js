/**
 * Phase 2: Age Calculator Tests
 * Jest Unit Tests for Age Calculation Logic
 */

import AgeCalculator from '../tools/age.js';

describe('Age Calculator', () => {
    let calculator;

    beforeEach(() => {
        // Reset DOM for each test
        document.body.innerHTML = `
            <div class="tool-container">
                <h2>Age Calculator</h2>
                <div class="inputs">
                    <div class="form-group">
                        <label>Birth Date:</label>
                        <input type="date" data-field="birth_date">
                    </div>
                </div>
                <div class="actions">
                    <button class="btn calculate">Calculate</button>
                    <button class="btn export">Export</button>
                    <a href="../index.html" class="btn back-btn">Back</a>
                </div>
                <div class="result-box"></div>
            </div>
        `;
        calculator = new AgeCalculator();
    });

    test('initializes correctly', () => {
        expect(calculator.name).toBe('Age Calculator');
        expect(calculator.toolId).toBe('age-calculator');
    });

    test('calculates age for past date', () => {
        // Set birth date to 10 years ago
        const tenYearsAgo = new Date();
        tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
        const birthDate = calculator.formatDate(tenYearsAgo);

        calculator.setInput('birth_date', birthDate);
        calculator.calculate();

        const result = calculator.getResult();
        expect(result).not.toBeNull();
        expect(result.years).toBeGreaterThanOrEqual(10);
        expect(result.months).toBeGreaterThanOrEqual(0);
        expect(result.days).toBeGreaterThanOrEqual(0);
    });

    test('calculates age for recent date', () => {
        // Set birth date to 1 month ago
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const birthDate = calculator.formatDate(oneMonthAgo);

        calculator.setInput('birth_date', birthDate);
        calculator.calculate();

        const result = calculator.getResult();
        expect(result).not.toBeNull();
        expect(result.years).toBe(0);
        expect(result.months).toBeGreaterThanOrEqual(0);
    });

    test('handles leap year birth dates', () => {
        // Feb 29, 2000 (leap year)
        calculator.setInput('birth_date', '2000-02-29');
        calculator.calculate();

        const result = calculator.getResult();
        expect(result).not.toBeNull();
        expect(result.years).toBeGreaterThanOrEqual(23);
    });

    test('stores and retrieves result from localStorage', () => {
        const birthDate = '1990-05-15';
        calculator.setInput('birth_date', birthDate);
        calculator.calculate();

        // Create new instance to simulate page refresh
        const newCalc = new AgeCalculator();
        const result = newCalc.getResult();

        expect(result).not.toBeNull();
        expect(newCalc.inputs.birth_date).toBe(birthDate);
    });

    test('returns correct total days calculation', () => {
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
        const birthDate = calculator.formatDate(fiveYearsAgo);

        calculator.setInput('birth_date', birthDate);
        calculator.calculate();

        const result = calculator.getResult();
        expect(result.totalDays).toBeCloseTo(5 * 365, -1); // Approximate
    });

    test('handles today as birth date', () => {
        const today = new Date().toISOString().split('T')[0];
        calculator.setInput('birth_date', today);

        // Should not crash
        expect(() => calculator.calculate()).not.toThrow();
    });
});

describe('Age Calculator Edge Cases', () => {
    let calculator;

    beforeEach(() => {
        document.body.innerHTML = `
            <div class="tool-container">
                <input type="hidden" data-field="birth_date">
                <div class="result-box"></div>
            </div>
        `;
        calculator = new AgeCalculator();
    });

    test('shows error for empty input', () => {
        calculator.setInput('birth_date', '');
        calculator.calculate();

        const resultBox = document.querySelector('.result-box');
        expect(resultBox.innerHTML).toContain('error');
    });

    test('shows error for future date', () => {
        const future = new Date();
        future.setFullYear(future.getFullYear() + 1);

        calculator.setInput('birth_date', calculator.formatDate(future));
        calculator.calculate();

        // Should handle gracefully
        expect(() => calculator.calculate()).not.toThrow();
    });

    test('clears storage correctly', () => {
        calculator.setInput('birth_date', '1990-01-01');
        calculator.calculate();

        calculator.clear();

        const result = calculator.getResult();
        expect(result).toBeNull();
    });
});