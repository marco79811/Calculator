// 使用立即執行函式來創建私有作用域，避免變量污染全局環境
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
    
    // 設置初始顯示值
    display.value = '0';
    
    // 添加鍵盤事件監聽
    document.addEventListener('keydown', handleKeyboardInput);
  });

  // 處理鍵盤輸入
  function handleKeyboardInput(event) {
    const key = event.key;
    
    // 防止鍵盤事件觸發頁面滾動
    if (['+', '-', '*', '/', '=', 'Enter'].includes(key)) {
      event.preventDefault();
    }

    // 匹配數字鍵和運算符
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

  // 格式化顯示的數字
  function formatNumber(num) {
    if (typeof num === 'number') {
      // 處理科學計數法的情況
      if (Math.abs(num) >= 1e12 || (Math.abs(num) < 0.000001 && num !== 0)) {
        return num.toExponential(6);
      }
      
      // 處理一般數字，去除末尾的0和不必要的小數點
      return num.toString().replace(/\.?0+$/, '');
    }
    return num;
  }

  // 處理輸入
  window.addInput = function(value) {
    const display = document.getElementById('result');
    
    // 如果輸入太長，不再接受新的輸入
    if (calculatorState.currentInput.length >= calculatorState.maxDisplayLength) {
      return;
    }

    // 處理小數點
    if (value === '.') {
      if (calculatorState.currentInput.includes('.')) {
        return; // 避免重複的小數點
      }
      if (calculatorState.currentInput === '' || calculatorState.isNewCalculation) {
        calculatorState.currentInput = '0';
      }
    }

    // 處理運算符
    if (['+', '-', '*', '/'].includes(value)) {
      // 不允許連續的運算符
      if (['+', '-', '*', '/'].includes(calculatorState.currentInput.slice(-1))) {
        calculatorState.currentInput = calculatorState.currentInput.slice(0, -1) + value;
        display.value = calculatorState.currentInput;
        return;
      }
      
      // 如果是新計算，且有之前的結果，使用之前的結果繼續計算
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

      // 使用 Function 構造函數代替 eval，更安全
      const calculateFn = new Function('return ' + expression);
      let result = calculateFn();

      // 處理除以零的情況
      if (!isFinite(result)) {
        throw new Error('除以零');
      }

      // 格式化結果
      result = formatNumber(result);
      
      // 更新顯示和狀態
      display.value = result;
      calculatorState.previousResult = result;
      calculatorState.currentInput = result.toString();
      calculatorState.isNewCalculation = true;
      
    } catch (error) {
      display.value = '錯誤';
      console.error('計算錯誤：', error.message);
      
      // 重置狀態
      calculatorState.currentInput = '';
      calculatorState.previousResult = null;
      calculatorState.isNewCalculation = true;
      
      // 1秒後清除錯誤顯示
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
