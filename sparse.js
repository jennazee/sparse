const inRegex = 'in: ?([^ ]+)';
const fromRegex = 'from: ?([^ ]+)';
const phraseRegex = '"([^"]+)"|\'([^\']+)\'';
const termToken = '([^ ]+)';


function sparse(string) {
    if (!string.trim().length) return new Query([]);

    const regex = new RegExp(`(${inRegex}|${fromRegex}|${phraseRegex}|${termToken})`, 'g')

    const lexemes = string.match(regex);

    const tokens = lexemes.map((token) => {
        if (isInToken(token)) {
            return makeInToken(token);
        }
        if (isFromToken(token)) {
            return makeFromToken(token);
        }
        else {
            return makeTermToken(token);
        }
    });

    const parseTree = new Query(tokens);
    console.log(parseTree);

    return parseTree;
}

function isInToken(token) {
    return token.match(new RegExp(inRegex));
}

function isFromToken(token) {
    return token.match(new RegExp(fromRegex));
}

function isPhraseToken(token) {
    return token.match(new RegExp(phraseRegex));
}

function makeInToken(token) {
    return new InToken(token)
}

function makeFromToken(token) {
    return new FromToken(token)
}

function makeTermToken(token) {
    return new Token(token)
}

class Query {
    constructor(tokens) {
        this.type = 'Query';
        this.terms = tokens;
    }
}

class Token {
    constructor(token) {
        this.type = 'Term';
        this.value = token;
        this.prefix = '';
    }
}

class InToken {
    constructor(token) {
        this.type = 'InFilter';
        this.rawToken = token;
        this.modifier = new Modifier('in');
        this.filter = new Entity(this.getFilterText());
    }

    getFilterText() {
        return this.rawToken.replace(`${this.modifier.modifier}:`, '').trim();
    }
}

class FromToken {
    constructor(token) {
        this.type = 'FromFilter';
        this.rawToken = token;
        this.modifier = new Modifier('from');
        this.filter = new Entity(this.getFilterText());
    }

    getFilterText() {
        return this.rawToken.replace(`${this.modifier.modifier}:`, '').trim();
    }
}

class Modifier {
    constructor(modifier) {
        this.type = 'Modifier';
        this.modifier = modifier;
    }
}

class Entity {
    constructor(name) {
        this.type = 'Entity';
        this.name = name;
    }
}

function renderFromTree(parseTree) {
    return parseTree.terms.map((token) => {
        if (token.type === 'Term') {
            return `<div class="Token">${token.value}</div>`
        }
        if (token.type === 'InFilter') {
            return `<div class="Token InToken">
                ${token.modifier.modifier}:<span class="Entity">${token.filter.name}</span>
                </div>`
        }
        if (token.type === 'FromFilter') {
            return `<div class="Token FromToken">
                ${token.modifier.modifier}:<span class="Entity">${token.filter.name}</span>
                </div>`
        }
    }).join('');
}

document.querySelector('[data-js="input"]').addEventListener('keyup', (e) => {
    document.querySelector('[data-js="visualizer"]').innerHTML = renderFromTree(sparse(e.target.value));
});
