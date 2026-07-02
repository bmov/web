import bbobHTML from '@bbob/html';
import presetHTML5 from '@bbob/preset-html5';
import sanitizeHtml from 'sanitize-html';

const allowedTags = [
  'a',
  'blockquote',
  'br',
  'code',
  'del',
  'div',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'img',
  'li',
  'ol',
  'p',
  'pre',
  's',
  'span',
  'strong',
  'u',
  'ul',
  'table',
  'th',
  'tr',
  'td',
];

const allowedAttributes = {
  a: ['href', 'target', 'rel'],
  img: ['src', 'alt', 'title', 'width', 'height'],
  span: ['style'],
  '*': ['class'],
};

const allowedStyles = {
  span: {
    'font-weight': [/^bold$/],
    'font-style': [/^italic$/],
    'text-decoration': [/^(underline|line-through)$/],
  },
};

const decodeUrl = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const isAllowedUrl = (value, schemes) => {
  const decoded = decodeUrl(value).trim().toLowerCase();
  return schemes.some((scheme) => decoded.startsWith(`${scheme}:`));
};

const prerender = (input) => {
  return input.replace(/\[post=(.*?)\](.*?)\[\/post\]/gi, '<a href="wnotepad://posts/$1">$2</a>');
}

export const renderBbcode = (source) => {
  const html = bbobHTML(prerender(source), presetHTML5());

  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    allowedStyles,
    allowedSchemes: ['http', 'https', 'mailto', 'wnotepad'],
    allowedSchemesByTag: {
      img: ['http', 'https'],
    },
    transformTags: {
      a: (tagName, attribs) => {
        if (!attribs.href || !isAllowedUrl(attribs.href, ['http', 'https', 'mailto', 'wnotepad'])) {
          return { tagName: 'span', attribs: {} };
        }

        if (attribs.href.startsWith('wnotepad://')) {
          return { tagName, attribs: {
              href: attribs.href.replaceAll('wnotepad://', '/'),
            }
          };
        }

        const nextAttribs = {
          href: attribs.href,
          rel: 'noopener noreferrer',
          target: '_blank',
        };

        return { tagName, attribs: nextAttribs };
      },
      img: (tagName, attribs) => {
        if (!attribs.src || !isAllowedUrl(attribs.src, ['http', 'https'])) {
          return { tagName: 'span', attribs: {} };
        }

        const nextAttribs = {};

        nextAttribs.src = attribs.src;

        for (const key of ['alt', 'title', 'width', 'height']) {
          if (attribs[key]) {
            nextAttribs[key] = attribs[key];
          }
        }

        return { tagName, attribs: nextAttribs };
      },
    },
  });
};
