let display = document.getElementById("display");

function addToDisplay(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function deleteFromDisplay() {
  display.value = display.value.slice(0, -1);
}

function calculate() {
  display.value = eval(display.value);
}
