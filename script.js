// --- 1. Operaciones básicas ---
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

// --- 2. Función operate ---
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

// --- 3. Variables de estado de la calculadora ---
let firstOperand = "";
let secondOperand = "";
let currentOperator = null;
let shouldResetScreen = false;

// Referencias a los elementos del DOM
const currentOperandDisplay = document.getElementById("current-operand");
const previousOperandDisplay = document.getElementById("previous-operand");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const actionButtons = document.querySelectorAll("[data-action]");

// --- 4. Funciones de actualización y flujo ---

// Redondear respuestas largas para que no desborden la pantalla
function roundResult(number) {
  return Math.round(number * 100000) / 100000;
}

// Reiniciar calculadora completamente (AC)
function clearAll() {
  firstOperand = "";
  secondOperand = "";
  currentOperator = null;
  shouldResetScreen = false;
  currentOperandDisplay.textContent = "0";
  previousOperandDisplay.textContent = "";
}

// Eliminar el último dígito ingresado (DEL / Backspace)
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

// Manejo del ingreso de números y del punto decimal
function appendNumber(number) {
  // Si acabamos de pulsar un operador o el signo igual, reiniciamos el número en pantalla
  if (currentOperandDisplay.textContent === "0" || shouldResetScreen) {
    resetScreen();
  }

  // Prevenir múltiples puntos decimales (Extra Credit)
  if (number === "." && currentOperandDisplay.textContent.includes(".")) {
    return;
  }

  currentOperandDisplay.textContent += number;
}

function resetScreen() {
  currentOperandDisplay.textContent = "";
  shouldResetScreen = false;
}

// Símbolo amigable para la vista superior
function getDisplaySymbol(operator) {
  if (operator === "/") return "÷";
  if (operator === "*") return "×";
  if (operator === "-") return "−";
  return "+";
}

// Manejo de operadores (+, -, *, /)
function setOperation(operator) {
  // Si ya hay un operador pendiente y el usuario no está justo cambiando de operador, calculamos
  if (currentOperator !== null && !shouldResetScreen) {
    evaluate();
  }

  firstOperand = currentOperandDisplay.textContent;
  currentOperator = operator;
  previousOperandDisplay.textContent = `${firstOperand} ${getDisplaySymbol(operator)}`;
  shouldResetScreen = true;
}

// Ejecutar la operación (=)
function evaluate() {
  if (currentOperator === null || shouldResetScreen) return;

  secondOperand = currentOperandDisplay.textContent;
  const result = operate(currentOperator, firstOperand, secondOperand);

  if (typeof result === "string") {
    // Si retornó el mensaje de error por división por cero
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

// --- 5. Event Listeners para clicks en pantalla ---
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

// --- 6. Soporte para teclado físico ---
window.addEventListener("keydown", (e) => {
  if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
    appendNumber(e.key);
  } else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
    setOperation(e.key);
  } else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault(); // Evita pulsar por defecto el último botón enfocado
    evaluate();
  } else if (e.key === "Backspace") {
    deleteNumber();
  } else if (e.key === "Escape") {
    clearAll();
  }
});