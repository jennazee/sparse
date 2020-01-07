function sparse(string) {
    if (!string.length) return [];

    const tokens = lexer(string);

    return parser(tokens);
}

function lexer(string) {
    const regex = /(in:[^ ]+|from:[^ ]+|"([^"]+)"|'([^']+)'|([^ ]+))/g

    return string.match(regex);
}

function parser(tokens) {
    return tokens.map((token) => {
        if (isInToken(token)) {
            return makeInToken(token);
        }
        if (isFromToken(token)) {
            return makeFromToken(token);
        }
        else {
            return makeTermToken(token);
        }
    })
}

function isInToken(token) {
    return token.match(/in:[^ ]+/);
}

function isFromToken(token) {
    return token.match(/from:[^ ]+/);
}

function isPhraseToken(token) {
    return token.match(/"([^"]+)"/) || token.match(/'([^']+)'/);
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

    render() {
        return `<div class="${this.className}">${this.prefix}${this.content}</div>`
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

document.querySelector('[data-js="input"]').addEventListener('keyup', (e) => {
    document.querySelector('[data-js="visualizer"]').innerHTML = sparse(e.target.value).map(p => p.render()).join('');
});