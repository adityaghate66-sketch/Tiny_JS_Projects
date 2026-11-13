/**
 * Phase 2: Temperature & Weight Converter Tests
 * Jest Unit Tests for Calculator Logic
 */

import { TemperatureConverter, WeightConverter } from '../tools/converter.js';

describe('Temperature Converter', () => {
    let converter;

    beforeEach(() => {
        converter = new TemperatureConverter();
    });

    test('converts Celsius to Fahrenheit correctly', () => {
        expect(converter._toBase(0, 'celsius')).toBe(0);
        expect(converter._fromBase(0, 'fahrenheit').value).toBeCloseTo(32, 1);
    });

    test('converts Kelvin to Celsius correctly', () => {
        const kelvinToCelsius = converter._toBase(273.15, 'kelvin');
        expect(kelvinToCelsius).toBeCloseTo(0, 1);
    });

    test('converts Celsius to Kelvin correctly', () => {
        const celsiusToKelvin = converter._fromBase(0, 'kelvin');
        expect(celsiusToKelvin.value).toBeCloseTo(273.15, 1);
    });

    test('handles freeezing point correctly', () => {
        const result = converter._fromBase(0, 'fahrenheit');
        expect(result.value).toBeCloseTo(32, 1);
    });

    test('returns correct units list', () => {
        expect(converter.getUnits()).toEqual(['celsius', 'fahrenheit', 'kelvin']);
    });

    test('formats temperature correctly', () => {
        const formatted = converter.formatTemp(25.5, 'c');
        expect(formatted).toContain('C');
        expect(formatted).toContain('25.50');
    });
});

describe('Weight Converter', () => {
    let converter;

    beforeEach(() => {
        converter = new WeightConverter();
    });

    test('converts kg to grams correctly', () => {
        const result = converter._fromBase(1, 'grams');
        expect(result.value).toBeCloseTo(1000, 1);
        expect(result.ratio).toBeCloseTo(1000, 1);
    });

    test('converts kg to pounds correctly', () => {
        const result = converter._fromBase(1, 'pounds');
        expect(result.value).toBeCloseTo(2.20462, 3);
    });

    test('converts grams to kg correctly', () => {
        const result = converter._toBase(1000, 'grams');
        expect(result).toBeCloseTo(1, 3);
    });

    test('converts pounds to kg correctly', () => {
        const result = converter._toBase(2.20462, 'pounds');
        expect(result).toBeCloseTo(1, 3);
    });

    test('returns correct units list', () => {
        expect(converter.getUnits()).toEqual(['kg', 'g', 'pounds', 'oz']);
    });
});

describe('Converters Validation', () => {
    test('TemperatureConverter has correct base unit', () => {
        const converter = new TemperatureConverter();
        expect(converter.baseUnit).toBe('celsius');
    });

    test('WeightConverter has correct base unit', () => {
        const converter = new WeightConverter();
        expect(converter.baseUnit).toBe('kg');
    });
});