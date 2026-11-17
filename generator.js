const nameInput = document.querySelector('#nameInput');
const inputCount = document.querySelector('#inputCount');
const resultValue = document.querySelector('#resultValue');
const resultStatus = document.querySelector('#resultStatus');
const generateButton = document.querySelector('#generateButton');
const copyButton = document.querySelector('#copyButton');
const resetButton = document.querySelector('#resetButton');

let generatedName = '';

function updateCount() {
  inputCount.textContent = `${nameInput.value.length} / 20`;
}

function styliseName(value) {
  // Convert standard English A-Z letters to their full-width Unicode forms.
  let converted = '';
  for (const character of value.toUpperCase()) {
    const code = character.codePointAt(0);
    converted += code >= 65 && code <= 90
      ? String.fromCodePoint(code + 0xFEE0)
      : character;
  }
  return `${converted} 情`;
}

function generateName() {
  const originalName = nameInput.value.trim();
  if (!originalName) {
    resultValue.textContent = 'ENTER YOUR NAME FIRST';
    resultStatus.textContent = 'INPUT REQUIRED';
    copyButton.disabled = true;
    generatedName = '';
    nameInput.focus();
    return;
  }

  generatedName = styliseName(originalName);
  resultValue.textContent = generatedName;
  resultStatus.textContent = 'READY TO COPY';
  copyButton.disabled = false;
}

async function copyGeneratedName() {
  if (!generatedName) return;
  try {
    await navigator.clipboard.writeText(generatedName);
    copyButton.innerHTML = '✓ <span>COPIED</span>';
    resultStatus.textContent = 'COPIED SUCCESSFULLY';
  } catch (error) {
    // Clipboard access may be blocked on non-secure pages or unsupported browsers.
    resultStatus.textContent = 'COPY NOT AVAILABLE — SELECT THE NAME';
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(resultValue);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

function resetGenerator() {
  nameInput.value = '';
  generatedName = '';
  resultValue.textContent = 'YOUR NAME 情';
  resultStatus.textContent = 'AWAITING INPUT';
  copyButton.disabled = true;
  copyButton.innerHTML = '⧉ <span>COPY NAME</span>';
  updateCount();
  nameInput.focus();
}

nameInput.addEventListener('input', updateCount);
nameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') generateName();
});
generateButton.addEventListener('click', generateName);
copyButton.addEventListener('click', copyGeneratedName);
resetButton.addEventListener('click', resetGenerator);
updateCount();
