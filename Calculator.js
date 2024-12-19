// 使用立即執行函式來創建私有作用域
(function() {
  // 定義計算機的狀態管理對象
  const calculatorState = {
    currentInput: '',          // 當前輸入的內容
    previousResult: null,      // 上一次計算的結果
    isNewCalculation: true,    // 是否開始新的計算
    maxDisplayLength: 12       // 顯示的最大位數
  };

  // 當頁面加載完成時初始化計算機
  document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('result');
    if (!display) {
      console.error('找不到顯示元素！');
      return;
    }
    
    display.value = '0';
    document.addEventListener('keydown', handleKeyboardInput);
  });

  // 處理鍵盤輸入
  function handleKeyboardInput(event) {
    const key = event.key;
    
    if (['+', '-', '*', '/', '=', 'Enter'].includes(key)) {
      event.preventDefault();
    }

    if (/^[0-9.]$/.test(key)) {
      addInput(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
      addInput(key);
    } else if (key === 'Enter' || key === '=') {
      calculate();
    } else if (key === 'Escape') {
      clearResult();
    } else if (key === 'Backspace') {
      deleteLast();
    }
  }

  // 安全的計算函數
  function safeEval(expression) {
    // 將表達式分解成數字和運算符
    const tokens = expression.match(/(-?\d+\.?\d*)|([+\-*/])/g);
    if (!tokens) return NaN;

    // 處理第一個數字可能是負數的情況
    let result = parseFloat(tokens[0]);
    let currentOperator = null;

    for (let i = 1; i < tokens.length; i++) {
      const token = tokens[i];
      
      if (['+', '-', '*', '/'].includes(token)) {
        currentOperator = token;
      } else {
        const num = parseFloat(token);
        
        // 執行計算
        switch (currentOperator) {
          case '+':
            result += num;
            break;
          case '-':
            result -= num;
            break;
          case '*':
            result *= num;
            break;
          case '/':
            if (num === 0) throw new Error('除以零');
            result /= num;
            break;
        }
      }
    }
    
    return result;
  }

  // 格式化數字顯示
  function formatNumber(num) {
    if (typeof num === 'number') {
      // 處理科學計數法的情況
      if (Math.abs(num) >= 1e12 || (Math.abs(num) < 0.000001 && num !== 0)) {
        return num.toExponential(6);
      }
      
      // 處理一般數字，保留適當的小數位數
      const numStr = num.toString();
      // 如果是整數，直接返回
      if (Number.isInteger(num)) return numStr;
      // 如果是小數，最多保留8位小數
      return parseFloat(num.toFixed(8)).toString();
    }
    return num;
  }

  // 處理輸入
  window.addInput = function(value) {
    const display = document.getElementById('result');
    
    if (calculatorState.currentInput.length >= calculatorState.maxDisplayLength) {
      return;
    }

    // 處理小數點
    if (value === '.') {
      if (calculatorState.currentInput.includes('.')) {
        return;
      }
      if (calculatorState.currentInput === '' || calculatorState.isNewCalculation) {
        calculatorState.currentInput = '0';
      }
    }

    // 處理運算符
    if (['+', '-', '*', '/'].includes(value)) {
      // 處理負數的特殊情況
      if (value === '-' && (calculatorState.currentInput === '' || 
          calculatorState.currentInput.slice(-1) === '(')) {
        calculatorState.currentInput += value;
        display.value = calculatorState.currentInput;
        return;
      }

      // 不允許連續的運算符
      if (['+', '-', '*', '/'].includes(calculatorState.currentInput.slice(-1))) {
        calculatorState.currentInput = calculatorState.currentInput.slice(0, -1) + value;
        display.value = calculatorState.currentInput;
        return;
      }
      
      if (calculatorState.isNewCalculation && calculatorState.previousResult !== null) {
        calculatorState.currentInput = calculatorState.previousResult.toString();
      }
    }

    // 更新輸入狀態
    if (calculatorState.isNewCalculation && !isNaN(value)) {
      calculatorState.currentInput = value;
      calculatorState.isNewCalculation = false;
    } else {
      calculatorState.currentInput += value;
      calculatorState.isNewCalculation = false;
    }

    display.value = calculatorState.currentInput;
  };

  // 計算結果
  window.calculate = function() {
    const display = document.getElementById('result');
    
    if (!calculatorState.currentInput || calculatorState.currentInput === '.') {
      return;
    }

    try {
      // 確保輸入的最後一個字符不是運算符
      let expression = calculatorState.currentInput;
      if (['+', '-', '*', '/'].includes(expression.slice(-1))) {
        expression = expression.slice(0, -1);
      }

      // 使用安全的計算函數而不是 eval
      const result = safeEval(expression);

      // 檢查計算結果是否有效
      if (isNaN(result) || !isFinite(result)) {
        throw new Error('無效的計算');
      }

      // 格式化並顯示結果
      const formattedResult = formatNumber(result);
      display.value = formattedResult;
      calculatorState.previousResult = result;
      calculatorState.currentInput = formattedResult.toString();
      calculatorState.isNewCalculation = true;
      
    } catch (error) {
      display.value = '錯誤';
      console.error('計算錯誤：', error.message);
      
      calculatorState.currentInput = '';
      calculatorState.previousResult = null;
      calculatorState.isNewCalculation = true;
      
      setTimeout(() => {
        display.value = '0';
      }, 1000);
    }
  };

  // 清除所有輸入
  window.clearResult = function() {
    const display = document.getElementById('result');
    calculatorState.currentInput = '';
    calculatorState.previousResult = null;
    calculatorState.isNewCalculation = true;
    display.value = '0';
  };

  // 刪除最後輸入的字符
  window.deleteLast = function() {
    const display = document.getElementById('result');
    
    if (calculatorState.isNewCalculation) {
      clearResult();
      return;
    }
    
    calculatorState.currentInput = calculatorState.currentInput.slice(0, -1);
    display.value = calculatorState.currentInput || '0';
  };
})();
