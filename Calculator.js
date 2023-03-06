// 獲取輸入框
var inputBox = document.getElementById("inputBox");

// 加
function add() {
  inputBox.value += "+";
}

// 減
function subtract() {
  inputBox.value += "-";
}

// 乘
function multiply() {
  inputBox.value += "×";
}

// 除
function divide() {
  inputBox.value += "/";
}

// 清除輸入框
function clearInput() {
  inputBox.value = "";
}

// 計算
function calculate() {
  try {
    var result = eval(inputBox.value);
    inputBox.value = result;
  } catch (error) {
    alert("Error");
  }
}
