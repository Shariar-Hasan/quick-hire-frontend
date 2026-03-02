
type CaseType = 'camel' | 'pascal' | 'snake' | 'kebab' | 'normal';

type CapitalizeConfigType = {
    word?: boolean;
};

type CaseConverterConfigType = {
    from: CaseType;
    to: CaseType;
    skipPrepositions?: boolean;
    skipArticles?: boolean;
};

class Str {
    private static prepositions = [
        'in', 'on', 'at', 'for', 'to', 'with', 'by',
        'about', 'against', 'between', 'among'
    ];

    private static articles = ['a', 'an', 'the'];

    static capitalize(text: string, props?: CapitalizeConfigType): string {
        const { word } = props || {};
        if (word) {
            return text
                .split(' ')
                .map(w => this.capitalize(w))
                .join(' ');
        }
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    static ordinalValue(num: number): string {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = num % 100;
        return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    }

    static caseConverter(
        text: string,
        {
            from,
            to,
            skipPrepositions = false,
            skipArticles = false,
        }: CaseConverterConfigType
    ): string {
        if (from === to) return text;

        // 1. Normalize "from" to normal (space separated, lowercase words)
        let words: string[] = [];
        if (from === 'snake') {
            words = text.split('_');
        } else if (from === 'kebab') {
            words = text.split('-');
        } else if (from === 'camel') {
            words = text.replace(/([a-z])([A-Z])/g, '$1 $2').split(/\s+/);
        } else if (from === 'pascal') {
            words = text
                .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .split(/\s+/);
        } else {
            words = text.split(/\s+/);
        }
        words = words.map(w => w.toLowerCase());

        // 2. Apply capitalization rules only for "normal"/Pascal/camel
        const formatWord = (word: string) => {
            if (skipPrepositions && this.prepositions.includes(word)) return word;
            if (skipArticles && this.articles.includes(word)) return word;
            return this.capitalize(word);
        };

        // 3. Convert to "to"
        if (to === 'normal') {
            return words.map(formatWord).join(' ');
        }
        if (to === 'snake') {
            return words.join('_');
        }
        if (to === 'kebab') {
            return words.join('-');
        }
        if (to === 'camel') {
            return words
                .map((w, i) => (i === 0 ? w : formatWord(w)))
                .join('');
        }
        if (to === 'pascal') {
            return words.map(formatWord).join('');
        }

        return words.join(' ');
    }

    static extractDate(date: string | Date): Date | null {
        if (!date) return null;
        const d = new Date(date);
        return isNaN(d.getTime()) ? null : d;
    }

    private static irregularPlurals = new Map<string, string>([
        ["man", "men"],
        ["woman", "women"],
        ["child", "children"],
        ["person", "people"],
        ["tooth", "teeth"],
        ["foot", "feet"],
        ["mouse", "mice"],
        ["goose", "geese"],
        ["louse", "lice"],
        ["die", "dice"],
        ["ox", "oxen"],
        ["cactus", "cacti"],
        ["focus", "foci"],
        ["fungus", "fungi"],
        ["nucleus", "nuclei"],
        ["syllabus", "syllabi"],
        ["analysis", "analyses"],
        ["diagnosis", "diagnoses"],
        ["thesis", "theses"],
        ["crisis", "crises"],
        ["phenomenon", "phenomena"],
        ["criterion", "criteria"],
        ["datum", "data"],
        ["appendix", "appendices"],
        ["index", "indices"],
        ["matrix", "matrices"],
        ["axis", "axes"],
        ["basis", "bases"],
        ["oasis", "oases"],
        ["parenthesis", "parentheses"],
        ["hypothesis", "hypotheses"],
        ["medium", "media"],
        ["memorandum", "memoranda"],
        ["vertebra", "vertebrae"],
        ["antenna", "antennae"],
        ["bacterium", "bacteria"],
        ["curriculum", "curricula"],
        ["genus", "genera"],
        ["stimulus", "stimuli"],
        ["alumnus", "alumni"],
        ["alga", "algae"],
        ["larva", "larvae"],
        ["formula", "formulae"],
        ["nebula", "nebulae"],
        ["stratum", "strata"],
        ["automaton", "automata"],
        ["corpus", "corpora"],
        ["graffito", "graffiti"],
        ["locus", "loci"],
        ["opus", "opera"],
        ["radius", "radii"],
        ["terminus", "termini"]
    ]);

    private static preserveCase(original: string, plural: string): string {
        // Preserve uppercase or capitalized first letter
        if (/^[A-Z]/.test(original)) {
            return plural.charAt(0).toUpperCase() + plural.slice(1);
        }
        return plural;
    }

    static pluralize(num: number, word: string): string {
        const isSingular = num === 1 || num === 0;
        const lowerWord = word.toLowerCase();

        if (isSingular) return `${num} ${word}`;

        // Handle irregulars
        if (this.irregularPlurals.has(lowerWord)) {
            const pluralWord = this.irregularPlurals.get(lowerWord) ?? lowerWord;
            return `${num} ${this.preserveCase(word, pluralWord)}`;
        }

        // Handle -y → -ies (but not vowel+y like "key" → "keys")
        if (/[^aeiou]y$/i.test(word)) {
            const pluralWord = `${word.slice(0, -1)}ies`;
            return `${num} ${this.preserveCase(word, pluralWord)}`;
        }

        // Handle -s, -ss, -sh, -ch, -x, -z → +es
        if (/(s|sh|ch|x|z)$/i.test(word)) {
            const pluralWord = `${word}es`;
            return `${num} ${this.preserveCase(word, pluralWord)}`;
        }

        // Default regular plural (just +s)
        const pluralWord = `${word}s`;
        return `${num} ${this.preserveCase(word, pluralWord)}`;
    }



    /**
     * Format a number as currency string
     * @param amount The amount to format
     * @param currencySymbol The currency symbol to use (default: $)
     * 
    */
    static currencyFormat(amount: number, currencySymbol = '$'): string {
        let isNegative = false;
        if (isNaN(amount)) {
            amount = 0;
        } else if (!isFinite(amount)) {
            amount = 0;
        } else if (typeof amount !== 'number') {
            amount = 0;
        } else if (amount < 0) {
            isNegative = true;
            amount = Math.abs(amount);
        }
        if (isNegative) {
            return `-${currencySymbol}${amount.toFixed(2)}`;
        }


        return `${currencySymbol}${amount.toFixed(2)}`;
    }

    static initials(name?: string | null): string {
        if (!name) return '?';
        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(w => w.charAt(0).toUpperCase())
            .join('');
    }

}

export default Str;