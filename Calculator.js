
// 定義變量 input 來保存使用者的輸入值
let input = '';

// 獲取用於顯示計算結果的 input 元素
const result = document.getElementById('result');

// 定義函數 addInput 來添加使用者的輸入
function addInput(value) {
  input += value;
  result.value = input;
}

// 定義函數 calculate 來計算結果
function calculate() {
  // 使用 try...catch 捕捉可能出現的錯誤
  try {
    // 調用 eval 函數來計算用戶輸入的表達式
    // 如果表達式不合法，eval 會拋出一個錯誤
    // 在這裡使用了 + 運算符將字符串轉為數字
    const resultValue = +eval(input);
    // 將計算結果顯示在 input 元素中
    result.value = resultValue;
    // 重置 input 字符串
    input = '';
  } catch (error) {
    // 如果出現錯誤，顯示錯誤信息並重置 input 字串
    alert('輸入錯誤！');
    input = '';
    result.value = '';
  }
}

// 定義函數 clearResult 來清除計算結果
function clearResult() {
  input = '';
  result.value = '';
}

// 定義函數 deleteLast 來刪除最後一個字符
function deleteLast() {
  input = input.slice(0, -1);
  result.value = input;
}

