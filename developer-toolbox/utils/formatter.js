/**
 * Phase 3: Developer Toolbox - Advanced Code Formatter
 */

class CodeFormatter {
    static formatJSON(input) {
        try {
            const parsed = JSON.parse(input);
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            return input;
        }
    }

    static formatCSS(input) {
        return input
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n')
            .replace(/\}\s*/g, '}\n')
            .replace(/\{\s*/g, '{\n  ')
            .replace(/;\s*/g, ';\n  ')
            .trim();
    }

    static formatJS(input) {
        // Simple JS formatting
        return input
            .replace(/\}/g, '}\n')
            .replace(/\/\//g, '//\n')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n');
    }

    static detectAndFormat(input, type = 'json') {
        switch(type.toLowerCase()) {
            case 'json':
                return this.formatJSON(input);
            case 'css':
                return this.formatCSS(input);
            case 'js':
                return this.formatJS(input);
            default:
                return this.formatJSON(input);
        }
    }
}

export default CodeFormatter;