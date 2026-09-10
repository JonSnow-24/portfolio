// Get display element
let display = document.getElementById("display");

// Math helper functions (Degree based)
function sin(deg) { return Math.sin(deg * Math.PI / 180); }
function cos(deg) { return Math.cos(deg * Math.PI / 180); }
function tan(deg) { return Math.tan(deg * Math.PI / 180); }
function log(val) { return Math.log10(val); }
function sqrt(val) { return Math.sqrt(val); }
function asin(val) { return Math.asin(val) * 180 / Math.PI; }
function acos(val) { return Math.acos(val) * 180 / Math.PI; }
function atan(val) { return Math.atan(val) * 180 / Math.PI; }
const PI = Math.PI;
const E = Math.E;

function appendValue(value) {
    let current = display.value;

    // Auto-add degree symbol for trig functions
    if (/[0-9]/.test(value)) {
        let lastTrig = current.lastIndexOf('sin(');
        lastTrig = Math.max(lastTrig, current.lastIndexOf('cos('));
        lastTrig = Math.max(lastTrig, current.lastIndexOf('tan('));

        if (lastTrig !== -1 && !current.includes(')', lastTrig)) {
            // We are inside a trig function
            if (current.endsWith('°')) {
                display.value = current.slice(0, -1) + value + '°';
            } else {
                display.value = current + value + '°';
            }
            return;
        }
    }

    display.value += value;
}

function clearDisplay() {
    display.value = "";
}

// Toggle Scientific
function toggleSci() {
    const screen = document.getElementById("calcScreen");
    screen.classList.toggle("sci-active");
}

// Keyboard support
document.addEventListener("keydown", function (e) {
    if (/^[0-9+\-*/().]$/.test(e.key)) {
        appendValue(e.key);
    } else if (e.key === "Enter") {
        calculate();
    } else if (e.key === "Backspace") {
        backspace();
    } else if (e.key === "Escape") {
        clearDisplay();
    }
});

// Backspace
function backspace() {
    display.value = display.value.slice(0, -1);
}

// Percentage
function percentage() {
    try {
        let value = display.value;

        if (value.includes('+') || value.includes('-') || value.includes('*') || value.includes('/')) {
            let parts = value.split(/[\+\-\*\/]/);
            let last = parts[parts.length - 1];
            let base = eval(value.replace(last, ''));

            display.value = base + (base * last / 100);
        } else {
            display.value = eval(value) / 100;
        }
    } catch {
        display.value = "Error";
    }
}

// Toggle History

let historyBox = document.getElementById("history");

function calculate() {
    try {
        let expression = display.value;

        // Handle degree notations
        expression = expression.replace(/°/g, '').replace(/degree/g, '');

        // Auto-close parentheses
        let openCount = (expression.match(/\(/g) || []).length;
        let closeCount = (expression.match(/\)/g) || []).length;
        while (openCount > closeCount) {
            expression += ')';
            openCount--;
        }

        let result = eval(expression);

        // ✅ history me add karo
        if (historyBox.innerHTML === "<div>No history yet</div>") {
            historyBox.innerHTML = "";
        }

        historyBox.innerHTML += `
<div onclick="useHistory('${result}')">
  ${expression} = ${result}
</div>`;
        display.value = result;

    } catch {
        display.value = "Error";
    }
}

historyBox.innerHTML = "<div>No history yet</div>";

function useHistory(value) {
    display.value = value;
    showButtons();
}

function showHistory() {
    const screen = document.getElementById("calcScreen");
    screen.classList.add("history-active");
    
    document.getElementById("buttonsSection").style.display = "none";
    document.getElementById("historySection").style.display = "flex";
    document.getElementById("historyBtn").style.display = "none";
    document.getElementById("sciBtn").style.display = "none";

    if (historyBox.innerHTML === "") {
        historyBox.innerHTML = "<div>No history yet</div>";
    }
}

function showButtons() {
    const screen = document.getElementById("calcScreen");
    screen.classList.remove("history-active");

    document.getElementById("historySection").style.display = "none";
    document.getElementById("buttonsSection").style.display = "grid";
    document.getElementById("historyBtn").style.display = "flex";
    document.getElementById("sciBtn").style.display = "inline-block";
}

function clearHistory() {
    historyBox.innerHTML = "<div>No history yet</div>";
}