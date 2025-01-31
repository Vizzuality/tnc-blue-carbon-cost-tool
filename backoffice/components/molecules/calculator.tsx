import React, { useEffect, useState } from 'react';
import { addStyles, EditableMathField } from 'react-mathquill';

addStyles();

const Calculator = () => {
  const [latex, setLatex] = useState(
    `\\left(\\frac{implementationLaborCost}{convervationValue}\\right)+someAssumption^2`,
  ); // Stores the formula
  const [result, setResult] = useState(''); // Stores the result of the formula

  // Function to insert a symbol at the current cursor position
  const insertSymbol = (symbol) => {
    setLatex((prev) => prev + symbol);
  };

  useEffect(() => {
    const variables = {
      implementationLaborCost: 1,
      convervationValue: 1,
      someAssumption: 2,
    };
    const jsExpression = latex
      .replace(/\\frac{([^}]*)}{([^}]*)}/g, '($1 / $2)') // Convert fractions
      .replace(/\\times/g, '*') // Convert multiplication
      .replace(/\\div/g, '/') // Convert division
      .replace(/\\left|\\right/g, '') // Remove brackets
      .replace(/\^/g, '**') // Convert exponents
      .replace(/\\sqrt{([^}]*)}/g, 'Math.sqrt($1)') // Convert square roots
      .replace(/\\log{([^}]*)}/g, 'Math.log($1)') // Convert log
      .replace(/\\sin{([^}]*)}/g, 'Math.sin($1)') // Convert sine
      .replace(/\\cos{([^}]*)}/g, 'Math.cos($1)') // Convert cosine
      .replace(/\\tan{([^}]*)}/g, 'Math.tan($1)') // Convert tangent
      .replace(/\\text{([^}]*)}/g, '$1'); // Remove \text{} wrapper);
    // return;
    const result = new Function(
      ...Object.keys(variables),
      `return ${jsExpression};`,
    )(...Object.values(variables));
    setResult(result);
  }, [latex]);

  const allowedVariables = ['cost', 'laborCost'];

  // Function to insert variables into the formula
  const insertVariable = (variable) => {
    setLatex((prevLatex) => prevLatex + ` \\text{${variable}} `);
  };

  const handleLatexChange = (mathField) => {
    let newLatex = mathField.latex();

    // Prevent manual entry of variable names
    allowedVariables.forEach((variable) => {
      const regex = new RegExp(`\\\\text{[^}]*${variable}[^}]*}`, 'g');
      if (!newLatex.includes(`\\text{${variable}}`)) {
        newLatex = newLatex.replace(regex, ''); // Remove invalid manual inputs
      }
    });

    setLatex(newLatex);
  };

  const handleMathFieldChange = (mathField) => {
    mathField.keystroke('Backspace', () => {
      const cursorPosition = mathField.__controller.cursor;
      const cursorLatex = mathField.latex();

      // Check if the cursor is right next to a variable
      allowedVariables.forEach((variable) => {
        const regex = new RegExp(`\\\\text{${variable}}`, 'g');

        if (cursorLatex.match(regex)) {
          // Remove the entire variable
          setLatex((prevLatex) => prevLatex.replace(`\\text{${variable}}`, ''));
        }
      });
    });

    handleLatexChange(mathField);
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', textAlign: 'center' }}>
      {/* <h2>Math Editor (With Toolbar)</h2> */}

      {/* Toolbar with Buttons */}
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => insertSymbol('+')}>+</button>
        <button onClick={() => insertSymbol('-')}>−</button>
        <button onClick={() => insertSymbol('\\times')}>×</button>
        <button onClick={() => insertSymbol('\\div')}>÷</button>
        <button onClick={() => insertSymbol('\\sqrt{}')}>√</button>
        <button onClick={() => insertSymbol('\\frac{}{}')}>Fraction</button>
        <button onClick={() => insertSymbol('^{}')}>Exponent</button>
        <button onClick={() => insertSymbol('\\pi')}>π</button>
        <button onClick={() => insertSymbol('\\sum')}>∑</button>
        <button onClick={() => insertSymbol('\\int')}>∫</button>
      </div>

      {/* Variable Selector */}
      <div style={{ marginBottom: '10px' }}>
        <label>Select a Variable: </label>
        <select onChange={(e) => insertVariable(e.target.value)}>
          <option value="">-- Choose --</option>
          {allowedVariables.map((variable) => (
            <option key={variable} value={variable}>
              {variable}
            </option>
          ))}
        </select>
      </div>

      {/* MathQuill Editable Input */}
      <EditableMathField
        latex={latex}
        onChange={handleMathFieldChange}
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          minHeight: '50px',
          fontSize: '1.5em',
          textAlign: 'left',
          backgroundColor: '#fff',
        }}
      />

      <p>LaTeX Output: {latex}</p>
      <p>Javascript Output: {result}</p>
    </div>
  );
};

export default Calculator;
