const mdInput = document.getElementById('mdInput');
const htmlInput = document.getElementById('htmlInput');
const swapBtn = document.getElementById('swapBtn');

let mdToHtml = true;
let isUpdating = false;

function headerToId(text) {
    return String(text || '').trim().toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-');
}

const renderer = new marked.Renderer();

renderer.heading = function(text, level, raw, slugger) {
    let headerText = '';

    if (typeof text === 'string') {
        headerText = text;
    } else if (Array.isArray(text)) {
        headerText = text.map(t => t.raw || t.text || '').join('');
    } else if (text && typeof text === 'object') {
        headerText = text.raw || text.text || '';
    } else {
        headerText = '';
    }

    const id = headerToId(headerText);

    return `<h${level} id="${id}">${marked.parseInline(headerText)}</h${level}>\n`;
};

function convert() {
    if(isUpdating) return;
    isUpdating = true;

    try {
        if(mdToHtml) {
            htmlInput.value = marked.parse(String(mdInput.value), { breaks: true });
        } else {
            const turndown = new TurndownService({ headingStyle: 'atx' });
            mdInput.value = turndown.turndown(String(htmlInput.value));
        }
    } catch(e) {
        console.error(e);
    }

    isUpdating = false;
}

function attachListeners() {
    mdInput.oninput = mdToHtml ? convert : null;
    htmlInput.oninput = mdToHtml ? null : convert;
}

swapBtn.addEventListener('click', () => {
    mdToHtml = !mdToHtml;
    const tmp = mdInput.value;
    mdInput.value = htmlInput.value;
    htmlInput.value = tmp;

    if(mdToHtml){
        mdInput.readOnly = false;
        mdInput.classList.add('active');
        htmlInput.readOnly = true;
        htmlInput.classList.remove('active');
    } else {
        mdInput.readOnly = true;
        mdInput.classList.remove('active');
        htmlInput.readOnly = false;
        htmlInput.classList.add('active');
    }

    attachListeners();
    convert();
});

attachListeners();
convert();