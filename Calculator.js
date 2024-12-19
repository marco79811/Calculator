// 建立一個立即執行函式來避免全局變量污染
(function() {
  // 使用 let 來宣告可變的計算機狀態
  let state = {
    currentInput: '',
    previousResult: null,
    isNewCalculation: true
  };

  // 當 DOM 載入完成後初始化計算機
  document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('result');
    if (!display) {
      console.error('找不到顯示元素！');
      return;
    }
    
    // 設置初始顯示值
    display.value = '0';
  });

  // 處理數字和運算符的輸入
  function addInput(value) {
    const display = document.getElementById('result');
    
    // 處理輸入值為小數點的特殊情況
    if (value === '.') {
      if (state.currentInput.includes('.')) {
        return; // 避免重複的小數點
      }
      if (state.currentInput === '' || state.isNewCalculation) {
        state.currentInput = '0';
      }
    }
    
    // 處理運算符輸入
    if (['+', '-', '*', '/'].includes(value)) {
      if (state.currentInput === '' && state.previousResult === null) {
        return; // 避免以運算符開始
      }
      if (state.isNewCalculation) {
        state.currentInput = display.value;
        state.isNewCalculation = false;
      }
    }
    
    // 更新輸入狀態
    if (state.isNewCalculation && !isNaN(value)) {
      state.currentInput = value;
      state.isNewCalculation = false;
    } else {
      state.currentInput += value;
    }
    
    display.value = state.currentInput;
  }

  // 計算結果
  function calculate() {
    const display = document.getElementById('result');
    
    if (!state.currentInput) {
      return; // 沒有輸入時不進行計算
    }

    try {
      // 使用 Function 構造函數替代 eval，更安全
      const calculateFn = new Function('return ' + state.currentInput);
      const result = calculateFn();
      
      // 格式化結果，處理精度問題
      const formattedResult = Number.isInteger(result) 
        ? result 
        : parseFloat(result.toFixed(8));
      
      display.value = formattedResult;
      state.previousResult = formattedResult;
      state.currentInput = formattedResult.toString();
      state.isNewCalculation = true;
    } catch (error) {
      display.value = '錯誤';
      state.currentInput = '';
      state.previousResult = null;
      state.isNewCalculation = true;
      
      // 提供更具體的錯誤信息
      console.error('計算錯誤：', error.message);
      setTimeout(() => {
        display.value = '0';
      }, 1000);
    }
  }

  // 清除所有輸入
  function clearResult() {
    const display = document.getElementById('result');
    state.currentInput = '';
    state.previousResult = null;
    state.isNewCalculation = true;
    display.value = '0';
  }

  // 刪除最後一個輸入的字符
  function deleteLast() {
    const display = document.getElementById('result');
    if (state.isNewCalculation) {
      return; // 如果是新的計算，不需要刪除
    }
    
    state.currentInput = state.currentInput.slice(0, -1);
    display.value = state.currentInput || '0';
  }

  // 將函數暴露到全局作用域
  window.addInput = addInput;
  window.calculate = calculate;
  window.clearResult = clearResult;
  window.deleteLast = deleteLast;
})();
