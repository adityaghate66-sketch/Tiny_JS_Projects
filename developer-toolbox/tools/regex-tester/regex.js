/**
 * Phase 3: Advanced Regex Tester
 */

class RegexTester {
    constructor() {
        this.patterns = [];
    }

    test(pattern, input, flags = 'g') {
        try {
            const regex = new RegExp(pattern, flags);
            const matches = input.match(regex);

            return {
                valid: true,
                matches: matches || [],
                matchCount: matches ? matches.length : 0,
                groups: regex.exec(input) || []
            };
        } catch (e) {
            return {
                valid: false,
                error: e.message,
                matches: [],
                matchCount: 0
            };
        }
    }

    highlightMatches(input, pattern, flags = 'g') {
        try {
            const regex = new RegExp(pattern, flags);
            return input.replace(regex, '<mark>$&</mark>');
        } catch (e) {
            return input;
        }
    }

    savePattern(name, pattern, flags = 'g') {
        this.patterns.push({ name, pattern, flags, created: new Date().toISOString() });
        localStorage.setItem('regex_patterns', JSON.stringify(this.patterns));
    }

    getSavedPatterns() {
        const saved = localStorage.getItem('regex_patterns');
        return saved ? JSON.parse(saved) : [];
    }

    clearSavedPatterns() {
        this.patterns = [];
        localStorage.removeItem('regex_patterns');
    }

    getPerformanceStats() {
        const start = performance.now();
        // Dummy operation
        const end = performance.now();
        return {
            testTime: (end - start).toFixed(4),
            memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 'N/A'
        };
    }
}

export default new RegexTester();