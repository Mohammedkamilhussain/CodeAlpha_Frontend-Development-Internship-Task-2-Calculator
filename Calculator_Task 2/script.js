const display = document.getElementById('display');
const keys = document.querySelector('.keys');

let current = '0';
let operator = null;
let previous = null;
let waitingForNew = false;

function updateDisplay(){
  display.textContent = current;
}

function inputDigit(d){
  if(waitingForNew){
    current = d;
    waitingForNew = false;
  } else {
    current = (current === '0') ? d : current + d;
  }
}

function inputDecimal(){
  if(waitingForNew){ current = '0.'; waitingForNew=false; return; }
  if(!current.includes('.')) current += '.';
}

function clearAll(){ current='0'; operator=null; previous=null; waitingForNew=false; }

function backspace(){
  if(current.length <= 1) current='0'; else current = current.slice(0,-1);
}

function applyOperator(nextOp){
  const inputValue = parseFloat(current);
  if(previous == null){
    previous = inputValue;
  } else if(operator){
    previous = calculate(previous, inputValue, operator);
    current = String(previous);
  }
  waitingForNew = true;
  operator = nextOp;
}

function calculate(a,b,op){
  if(op === '+') return a + b;
  if(op === '-') return a - b;
  if(op === '*') return a * b;
  if(op === '/') return b === 0 ? NaN : a / b;
  return b;
}

keys.addEventListener('click', e=>{
  if(!e.target.matches('button')) return;
  const action = e.target.dataset.action;
  const key = e.target.textContent;

  if(!action){
    // it's a digit
    inputDigit(key);
    updateDisplay();
    return;
  }

  switch(action){
    case 'decimal': inputDecimal(); break;
    case 'clear': clearAll(); break;
    case 'back': backspace(); break;
    case 'add': applyOperator('+'); break;
    case 'subtract': applyOperator('-'); break;
    case 'multiply': applyOperator('*'); break;
    case 'divide': applyOperator('/'); break;
    case 'equals':
      if(operator && previous != null){
        current = String(calculate(previous, parseFloat(current), operator));
        operator = null;
        previous = null;
        waitingForNew = true;
      }
      break;
    case 'neg':
      current = String(parseFloat(current) * -1); break;
  }
  updateDisplay();
});

// keyboard support
document.addEventListener('keydown', e=>{
  if(e.key >= '0' && e.key <= '9'){ inputDigit(e.key); updateDisplay(); return; }
  if(e.key === '.') { inputDecimal(); updateDisplay(); return; }
  if(e.key === 'Backspace'){ backspace(); updateDisplay(); return; }
  if(e.key === 'Enter' || e.key === '='){ 
    e.preventDefault();
    document.querySelector('[data-action="equals"]').click();
    updateDisplay();
    return;
  }
  if(e.key === '+'){ applyOperator('+'); updateDisplay(); return; }
  if(e.key === '-') { applyOperator('-'); updateDisplay(); return; }
  if(e.key === '*') { applyOperator('*'); updateDisplay(); return; }
  if(e.key === '/') { applyOperator('/'); updateDisplay(); return; }
  if(e.key.toLowerCase() === 'c'){ clearAll(); updateDisplay(); return; }
});
