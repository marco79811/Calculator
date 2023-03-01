let currentInput = '0';
let firstOperand = null;
let operator = null;
let waitForSecondOperand = false;

function appendNumber(number) {
    if (currentInput === '0' || waitForSecondOperand) {
        currentInput = number;
        waitForSecondOperand = false;
    } else {
        currentInput += number;
    }
    updateScreen(currentInput);
}

function handleDecimal() {
    if (waitForSecondOperand) return;
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateScreen(currentInput);
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);
    if (operator && waitForSecondOperand) {
        operator = nextOperator;
        updateOperatorDisplay(operator);
        return;
    }
    if (firstOperand == null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        currentInput = `${parseFloat(result.toFixed(7))}`;
        firstOperand = result;
    }
    operator = nextOperator;
    waitForSecondOperand = true;
    updateScreen(currentInput);
    updateOperatorDisplay(operator);
}

function calculate(firstOperand, secondOperand, operator) {
    switch (operator) {
        case '+':
            return firstOperand + secondOperand;
        case '-':
            return firstOperand - secondOperand;
        case '*':
            return firstOperand * secondOperand;
        case '/':
            return firstOperand / secondOperand;
        default:
            return secondOperand;
    }
}

function updateScreen(displayValue) {
    const screen = document.getElementById('screen');
    screen.innerText = displayValue;
}

function clearScreen() {
    currentInput = '0';
    firstOperand = null;
    operator = null;
    waitForSecondOperand = false;
    updateScreen(currentInput);
    clearOperatorDisplay();
}

function updateOperatorDisplay(operator) {
    const operatorDisplay = document.getElementById('operator');
    operatorDisplay.innerText = operator;
}

function clearOperatorDisplay() {
    const operatorDisplay = document.getElementById('operator');
    operatorDisplay.innerText = '';
}

function evaluate() {
    const inputValue = parseFloat(currentInput);
    if (operator == null || waitForSecondOperand) {
        return;
    }
    if (firstOperand != null) {
        const result = calculate(firstOperand, inputValue, operator);
        currentInput = `${parseFloat(result.toFixed(7))}`;
        updateScreen(currentInput);
        firstOperand = result;
        operator = null;
        waitForSecondOperand = true;
        clearOperatorDisplay();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const numberButtons = document.querySelectorAll('.number');
    const operatorButtons = document.querySelectorAll('.operator');
    const decimalButton = document.querySelector('.decimal');
    const clearButton = document.querySelector('.clear');
    const equalsButton = document.querySelector('.equals');

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.innerText);
        });
    });

    decimalButton.addEventListener('click', handleDecimal);

    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            handleOperator(button.innerText);
        });
    });

    clearButton.addEventListener('click', clearScreen);

    equalsButton.addEventListener('click', evaluate);
});
