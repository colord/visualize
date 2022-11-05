let numOfRows = 4;
let numOfCols = 10;
const MININT = 0;
const MAXINT = 20;

const state = {
    empty: 0,
    showNum: 1,
    showChar: 2,
    showPointer: 3
};

const stateControl = {
    count: 0,
    functions: [setEmptyState, setNumState, setCharState, setPointerState],
    next(e) {
        let elem = e.target;
        this.count = parseInt(elem.getAttribute("data-state"));
        // Create a continuous cycle - Increment the counter. Then modulo the result 
        // based on the number of functions in the array
        this.count = ++this.count % this.functions.length;
        this.functions[this.count](e);
    }
}

/** Helper functions **/
function addGlobalEventListener(type, selector, callback) {
    document.addEventListener(type, e => {
        if (e.target.matches(selector)) {
            callback(e);
        }
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/*
    Get a random int between the unicode value starting from A
    to the unicode value ending at Z. Convert to a character and return it.
*/
function getRandomChar() {
    return String.fromCharCode(getRandomInt('A'.charCodeAt(), 'Z'.charCodeAt()));
}

function getNumOfCols() {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--grid-cols'))
}

function getNumOfRows() {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--grid-rows'))
}

function updateArraySize(cols = null, rows = null) {
    if (cols) {
        document.documentElement.style.setProperty('--grid-cols', `${cols}`);
    }
    if (rows) {
        document.documentElement.style.setProperty('--grid-rows', `${rows}`);
    }
}

function createGrid() {
    // Headers
    for (let i = 0; i < numOfCols; i++) {
        createHeaderCell("#col-header", i);
    }
    for (let i = 0; i < numOfRows; i++) {
        createHeaderCell("#row-header", i, true);
    }

    // Arrays
    const arrayElem = document.querySelector('#array');

    let cols = getNumOfCols();
    let rows = getNumOfRows();
    const totalCells = cols * rows;

    for (let i = 0; i < totalCells; i++) {
        arrayElem.appendChild(createCell());
    }
}

function createHeaderCell(parent, i, row = false) {
    let cell = document.createElement("div");

    if (!row) {
        cell.classList.add("col-header-cell");
    }
    else {
        cell.classList.add("row-header-cell");
    }

    cell.textContent = i;
    const header = document.querySelector(parent);
    header.appendChild(cell);
}

function createCell() {
    let cell = document.createElement('div');
    cell.classList.add("cell");
    cell.setAttribute("data-state", state.showNum);
    cell.textContent = getRandomInt(MININT, MAXINT);
    return cell
}

function setEmptyState(e) {
    let elem = e.target;
    elem.setAttribute("data-state", state.empty);
    elem.textContent = ".";
    elem.classList.toggle("empty-state")
    elem.classList.toggle("pointer-state");
}

function setNumState(e) {
    let elem = e.target;
    elem.setAttribute("data-state", state.showNum);
    elem.textContent = getRandomInt(MININT, MAXINT);
    elem.classList.remove("pointer-state", "empty-state");
}

function setCharState(e) {
    let elem = e.target;
    elem.setAttribute("data-state", state.showChar);
    elem.textContent = getRandomChar();
    elem.classList.remove("pointer-state", "empty-state");
}

function setPointerState(e) {
    let elem = e.target;
    elem.setAttribute("data-state", state.showPointer);
    elem.textContent = "△";
    elem.classList.toggle("pointer-state");
}

// WIP - need to be able to update all cells not only by updating data attribute
// but also by running setEmptyState function;
function clearCells() {
    const cells = document.querySelectorAll('.cell');
    for (const elem of cells) {
        elem.setAttribute("data-state", state.empty);
        elem.textContent = ".";
        elem.classList.toggle("empty-state")
        elem.classList.toggle("pointer-state");
    }
}

function updateGrid(e) {
    let inputValue = e.target.value;
}

function addPointer(e) {
    let elem = e.target;
    elem.classList.toggle('index');
}

// eslint-disable-next-line no-unused-vars, no-undef
const sortableArray = Sortable.create(array, {
    swap: true,
    swapClass: 'highlight',
    ghostClass: 'ghost',
    animation: 100,
    easing: 'cubic-bezier(0.65, 0, 0.35, 1)'
});

createGrid();

/** Event handling **/

// Cell state
document.addEventListener('click', e => {
    if (e.target.matches('.cell')) {
        stateControl.next(e);
    }
});

// Pointers on column header
addGlobalEventListener('click', '.col-header-cell', addPointer);