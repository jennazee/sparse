const inRegex = 'in: ?([^ ]+)';
const fromRegex = 'from: ?([^ ]+)';
const phraseRegex = '"([^"]+)"|\'([^\']+)\'';
const termToken = '([^ ]+)';

function sparse(string) {
  if (!string.trim().length) return new Query([]);

  const regex = new RegExp(`(${inRegex}|${fromRegex}|${phraseRegex}|${termToken})`, 'g');

  const lexemes = string.match(regex);

  console.log('Lexemes: ', lexemes);

  const tokens = lexemes.map((token) => {
    if (isInToken(token)) {
      return makeInToken(token);
    }
    if (isFromToken(token)) {
      return makeFromToken(token);
    }
    return makeTermToken(token);
  });

  console.log('Tokens: ', tokens);

  const parseTree = new Query(tokens);
  console.log('Parse tree: ', parseTree);

  return parseTree;
}

function isInToken(token) {
  return token.match(new RegExp(inRegex));
}

function isFromToken(token) {
  return token.match(new RegExp(fromRegex));
}

function makeInToken(token) {
  return new InToken(token);
}

function makeFromToken(token) {
  return new FromToken(token);
}

function makeTermToken(token) {
  return new Token(token);
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
  }
}

class InToken {
  constructor(token) {
    this.type = 'InFilter';
    this.rawToken = token;
  }
}

class FromToken {
  constructor(token) {
    this.type = 'FromFilter';
    this.rawToken = token;
  }
}

function renderFromTree(parseTree) {
  if (!parseTree) return '';
  return parseTree.terms
    .map((token) => {
      if (token.type === 'Term') {
        return `<div class="Token">${token.value}</div>`;
      }
      if (token.type === 'InFilter') {
        return `<div class="Token InToken">
                ${token.rawToken}</span>
                </div>`;
      }
      if (token.type === 'FromFilter') {
        return `<div class="Token FromToken">
                ${token.rawToken}</span>
                </div>`;
      }
      return '';
    })
    .join('');
}

document.querySelector('[data-js="input"]').addEventListener('keyup', (e) => {
  document.querySelector('[data-js="visualizer"]').innerHTML = renderFromTree(
    sparse(e.target.value)
  );
});
