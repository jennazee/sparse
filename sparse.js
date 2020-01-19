const inRegex = 'in: ?([^ ]+)';
const fromRegex = 'from: ?([^ ]+)';
const phraseRegex = '"([^"]+)"|\'([^\']+)\'';
const termToken = '([^ ]+)';


function sparse(string) {
    if (!string.length) return [];

    const regex = new RegExp(`(${inRegex}|${fromRegex}|${phraseRegex}|${termToken})`, 'g')

    const lexemes = string.match(regex);
    console.log(lexemes)

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

    return tokens;
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

class Token {
    constructor(token) {
        this.className = 'Token';
        this.content = token;
        this.prefix = '';    
    }
}

class InToken extends Token {
    constructor(token) {
        super();
        this.className = 'Token InToken';
        this.prefix = 'in:';
        this.content = token.replace(this.prefix, '');
    }
}

class FromToken extends Token {
    constructor(token) {
        super();
        this.className = 'Token FromToken';
        this.prefix = 'from:'
        this.content = token.replace(this.prefix, '');
    }
}

class Modifier {
    constructor(modifier) {
        this.modifer = modifier;
    }
}

function renderToken(tokenInstance) {
    return `<div class="${tokenInstance.className}">${tokenInstance.prefix}${tokenInstance.content}</div>`
}

document.querySelector('[data-js="input"]').addEventListener('keyup', (e) => {
    document.querySelector('[data-js="visualizer"]').innerHTML = sparse(e.target.value).map(t => renderToken(t)).join('');
});
