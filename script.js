/**
 * SMART GLASS CALCULATOR - LOGIC ENGINE
 * Senior Frontend Architect Implementation
 */

class SmartCalculator {
    constructor() {
        this.expression = '';
        this.result = '0';
        this.history = [];
        this.isNewCalculation = true;

        this.expressionDisplay = document.getElementById('expressionDisplay');
        this.resultDisplay = document.getElementById('resultDisplay');
        this.footerMsg = document.querySelector('.footer-msg');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardSupport();
        this.startDigitalClock();
        this.handleStartupAnimation();
        this.initCursorGlow();
    }

    // --- Core Logic ---

    handleInput(value) {
        if (this.isNewCalculation && !this.isOperator(value)) {
            this.expression = '';
            this.isNewCalculation = false;
        }

        // Prevent multiple decimals in one number
        if (value === '.' && this.getLastNumber().includes('.')) return;

        // Prevent consecutive operators
        if (this.isOperator(value) && this.isOperator(this.expression.slice(-1))) {
            this.expression = this.expression.slice(0, -1) + value;
        } else {
            this.expression += value;
        }

        this.updateDisplay();
        this.updateAIStatus(`Processing: ${value}`);
    }

    calculate() {
        try {
            if (this.expression === '') return;

            // Clean expression for eval (replace symbols if necessary)
            let cleanExpr = this.expression.replace(/×/g, '*').replace(/÷/g, '/');
            
            // Handle percentage
            if (cleanExpr.includes('%')) {
                cleanExpr = cleanExpr.replace(/(\d+)%/g, '($1/100)');
            }

            const evalResult = eval(cleanExpr);
            
            if (!isFinite(evalResult)) throw new Error('Infinite');

            this.result = this.formatResult(evalResult);
            this.expressionDisplay.innerText = this.expression + ' =';
            this.resultDisplay.innerText = this.result;
            
            this.expression = this.result.toString();
            this.isNewCalculation = true;
            
            this.updateAIStatus('Calculation Complete');
            this.animateResult();
        } catch (error) {
            this.resultDisplay.innerText = 'ERROR';
            this.updateAIStatus('System Error: Invalid Input');
            setTimeout(() => this.clearAll(), 1500);
        }
    }

    clearAll() {
        this.expression = '';
        this.result = '0';
        this.updateDisplay();
        this.updateAIStatus('Memory Cleared');
    }

    deleteLast() {
        this.expression = this.expression.slice(0, -1);
        this.updateDisplay();
        this.updateAIStatus('Input Modified');
    }

    formatResult(num) {
        if (num.toString().length > 10) {
            return num.toPrecision(8).replace(/\.?0+$/, '');
        }
        return num;
    }

    updateDisplay() {
        this.expressionDisplay.innerText = this.expression;
        this.resultDisplay.innerText = this.expression === '' ? '0' : this.expression;
        
        // Auto-scale font size if text is too long
        const len = this.resultDisplay.innerText.length;
        if (len > 8) {
            this.resultDisplay.style.fontSize = '2rem';
        } else if (len > 12) {
            this.resultDisplay.style.fontSize = '1.5rem';
        } else {
            this.resultDisplay.style.fontSize = '3rem';
        }
    }

    // --- Helpers ---

    isOperator(char) {
        return ['+', '-', '*', '/', '%', '×', '÷'].includes(char);
    }

    getLastNumber() {
        const parts = this.expression.split(/[\+\-\*\/]/);
        return parts[parts.length - 1];
    }

    // --- UI/UX Enhancements ---

    setupEventListeners() {
        document.querySelectorAll('.btn-calc').forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.value;
                const action = btn.dataset.action;

                this.playClickFeedback(btn);

                if (action === 'calculate') this.calculate();
                else if (action === 'clear') this.clearAll();
                else if (action === 'delete') this.deleteLast();
                else if (value) this.handleInput(value);
            });
        });
    }

    setupKeyboardSupport() {
        window.addEventListener('keydown', (e) => {
            const key = e.key;
            if (/[0-9]/.test(key)) this.handleInput(key);
            if (['+', '-', '*', '/'].includes(key)) this.handleInput(key);
            if (key === 'Enter' || key === '=') this.calculate();
            if (key === 'Escape') this.clearAll();
            if (key === 'Backspace') this.deleteLast();
            if (key === '.') this.handleInput('.');
            if (key === '%') this.handleInput('%');
        });
    }

    playClickFeedback(btn) {
        btn.classList.add('btn-active');
        setTimeout(() => btn.classList.remove('btn-active'), 100);
        
        // Ripple effect simulation
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    animateResult() {
        this.resultDisplay.style.textShadow = '0 0 20px var(--neon-cyan)';
        setTimeout(() => {
            this.resultDisplay.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.2)';
        }, 500);
    }

    updateAIStatus(msg) {
        this.footerMsg.innerText = msg;
        this.footerMsg.style.color = 'var(--neon-cyan)';
        setTimeout(() => {
            this.footerMsg.style.color = 'var(--text-secondary)';
        }, 1000);
    }

    handleStartupAnimation() {
        const screen = document.getElementById('startupScreen');
        setTimeout(() => {
            screen.style.opacity = '0';
            setTimeout(() => screen.style.display = 'none', 1000);
        }, 2000);
    }

    startDigitalClock() {
        const clockEl = document.getElementById('digitalClock');
        setInterval(() => {
            const now = new Date();
            clockEl.innerText = now.toLocaleTimeString([], { hour12: false });
        }, 1000);
    }

    initCursorGlow() {
        const cursor = document.getElementById('cursorGlow');
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Effect on click
        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
            cursor.style.boxShadow = '0 0 40px var(--neon-purple), 0 0 80px var(--neon-purple)';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.boxShadow = '0 0 20px var(--neon-cyan), 0 0 40px var(--neon-cyan)';
        });
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    new SmartCalculator();
});
