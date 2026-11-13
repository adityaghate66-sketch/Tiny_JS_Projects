/**
 * Phase 2: Validators Utility
 * Input validation and sanitization
 */

class Validators {
    // Numeric validation
    static isNumber(value) {
        const num = parseFloat(value);
        return !isNaN(num) && isFinite(num);
    }

    static toNumber(value, defaultValue = 0) {
        const num = parseFloat(value);
        return isNaN(num) ? defaultValue : num;
    }

    // Date validation
    static isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    }

    static formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        if (!d instanceof Date || isNaN(d.getTime())) return '';

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        if (format === 'YYYY-MM-DD') return `${year}-${month}-${day}`;
        if (format === 'DD/MM/YYYY') return `${day}/${month}/${year}`;
        if (format === 'MM/DD/YYYY') return `${month}/${day}/${year}`;
        return `${year}-${month}-${day}`;
    }

    // Email validation
    static isEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Required field validation
    static isRequired(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    }

    // Range validation
    static isInRange(value, min, max) {
        const num = parseFloat(value);
        return this.isNumber(value) && num >= min && num <= max;
    }

    // Sanitize input
    static sanitize(value) {
        return value.toString().trim();
    }

    // Validate and convert
    static validateAndConvert(value, type, options = {}) {
        const { required = false, min = -Infinity, max = Infinity, defaultValue = '' } = options;

        if (required && !this.isRequired(value)) {
            return defaultValue;
        }

        if (value === '' || value === null || value === undefined) {
            return defaultValue;
        }

        switch (type) {
            case 'number':
                if (!this.isNumber(value)) return defaultValue;
                const num = parseFloat(value);
                if (num < min || num > max) return defaultValue;
                return num;

            case 'date':
                if (!this.isValidDate(value)) return defaultValue;
                return this.formatDate(value);

            case 'email':
                if (!this.isEmail(value)) return defaultValue;
                return this.sanitize(value);

            case 'string':
                const sanitized = this.sanitize(value);
                if (sanitized.length < min || sanitized.length > max) return defaultValue;
                return sanitized;

            default:
                return this.sanitize(value);
        }
    }

    // Get error message
    static getErrorMessage(field, errorType, options = {}) {
        const messages = {
            required: `${field} is required`,
            number: `${field} must be a valid number`,
            range: `${field} must be between ${options.min} and ${options.max}`,
            date: `${field} must be a valid date`,
            email: `Please enter a valid email address`,
            min_length: `${field} must be at least ${options.min} characters`
        };

        return messages[errorType] || `Invalid ${field}`;
    }
}

export default Validators;