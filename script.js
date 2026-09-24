// basic operations 
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return "Good try, Einstein!"; 
  }
  return a / b;
}

// operate function
function operate(operator, a, b) {
  a = Number(a);
  b = Number(b);

  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
    default:
      return null;
  }
}

// calculator state variables
let firstOperand = "";
let secondOperand = "";
let currentOperator = null;
let shouldResetScreen = false;

// references to DOM elements
const currentOperandDisplay = document.getElementById("current-operand");
const previousOperandDisplay = document.getElementById("previous-operand");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const actionButtons = document.querySelectorAll("[data-action]");

// truncate long responses so they don't overflow the screen
function roundResult(number) {
  return Math.round(number * 100000) / 100000;
}

// reset calculator (AC)
function clearAll() {
  firstOperand = "";
  secondOperand = "";
  currentOperator = null;
  shouldResetScreen = false;
  currentOperandDisplay.textContent = "0";
  previousOperandDisplay.textContent = "";
}

// delete the last digit entered (DEL / Backspace)
function deleteNumber() {
  if (shouldResetScreen) return;
  if (currentOperandDisplay.textContent === "Good try, Einstein!") {
    clearAll();
    return;
  }

  if (currentOperandDisplay.textContent.length === 1) {
    currentOperandDisplay.textContent = "0";
  } else {
    currentOperandDisplay.textContent = currentOperandDisplay.textContent.slice(0, -1);
  }
}

function appendNumber(number) {
  // If an operator or the equals sign is pressed, the screen is cleared
  if (shouldResetScreen) {
    resetScreen();
  }

  // handling of the decimal point
  if (number === ".") {
    // if it already has a decimal point, it stops
    if (currentOperandDisplay.textContent.includes(".")) return;

    // if the display is blank or shows "0", it automatically becomes "0."
    if (currentOperandDisplay.textContent === "" || currentOperandDisplay.textContent === "0") {
      currentOperandDisplay.textContent = "0.";
      return;
    }
  }

  // if a number is pressed and the screen showed only "0", replace it
  if (currentOperandDisplay.textContent === "0") {
    currentOperandDisplay.textContent = "";
  }

  // add the number or character
  currentOperandDisplay.textContent += number;
}


function resetScreen() {
  currentOperandDisplay.textContent = "";
  shouldResetScreen = false;
}

// eye-friendly symbol for top view
function getDisplaySymbol(operator) {
  if (operator === "/") return "÷";
  if (operator === "*") return "×";
  if (operator === "-") return "−";
  return "+";
}

// handling operators (+, -, *, /)
function setOperation(operator) {
  if (currentOperator !== null && !shouldResetScreen) {
    evaluate();
  }

  firstOperand = currentOperandDisplay.textContent;
  currentOperator = operator;
  previousOperandDisplay.textContent = `${firstOperand} ${getDisplaySymbol(operator)}`;
  shouldResetScreen = true;
}

// perform the operation (=)
function evaluate() {
  if (currentOperator === null || shouldResetScreen) return;

  secondOperand = currentOperandDisplay.textContent;
  const result = operate(currentOperator, firstOperand, secondOperand);

  if (typeof result === "string") {
    // if the division-by-zero error message was returned
    currentOperandDisplay.textContent = result;
    previousOperandDisplay.textContent = "";
    firstOperand = "";
    currentOperator = null;
    shouldResetScreen = true;
    return;
  }

  const rounded = roundResult(result);
  currentOperandDisplay.textContent = rounded;
  previousOperandDisplay.textContent = `${firstOperand} ${getDisplaySymbol(currentOperator)} ${secondOperand} =`;
  firstOperand = rounded;
  currentOperator = null;
  shouldResetScreen = true;
}

// event listeners for screen clicks
numberButtons.forEach((button) => {
  button.addEventListener("click", () => appendNumber(button.dataset.number));
});

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => setOperation(button.dataset.operator));
});

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "clear") clearAll();
    if (action === "backspace") deleteNumber();
    if (action === "equals") evaluate();
  });
});

// keyboard support
window.addEventListener("keydown", (e) => {
  if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
    appendNumber(e.key);
  } else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
    setOperation(e.key);
  } else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault(); // avoid pressing the last focused button by default
    evaluate();
  } else if (e.key === "Backspace") {
    deleteNumber();
  } else if (e.key === "Escape") {
    clearAll();
  }
});
