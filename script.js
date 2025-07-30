const recoveryPhraseInput = document.getElementById("recoveryPhrase");
const wordCountDisplay = document.getElementById("wordCount");
const validationInfo = document.getElementById("validationInfo");
const validateBtn = document.getElementById("validateBtn");
const clearBtn = document.getElementById("clearBtn");
const previewSection = document.getElementById("previewSection");
const previewContainer = document.getElementById("previewContainer");
const printBtn = document.getElementById("printBtn");
const downloadBtn = document.getElementById("downloadBtn");

let currentPhrase = [];
let isValidPhrase = false;

recoveryPhraseInput.addEventListener("input", handlePhraseInput);
validateBtn.addEventListener("click", validatePhrase);
clearBtn.addEventListener("click", clearPhrase);
printBtn.addEventListener("click", printPhrase);
downloadBtn.addEventListener("click", downloadPDF);

function handlePhraseInput() {
  const text = recoveryPhraseInput.value.trim();
  const words = text
    ? text
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 0)
    : [];

  wordCountDisplay.textContent = words.length;
  currentPhrase = words;

  isValidPhrase = false;
  previewSection.style.display = "none";

  if (words.length === 0) {
    updateValidationInfo("info", "Please enter your recovery phrase");
  } else if (![12, 15, 18, 21, 24].includes(words.length)) {
    updateValidationInfo(
      "error",
      `Invalid phrase length. Expected 12, 15, 18, 21, or 24 words, got ${words.length} words.`
    );
  } else {
    updateValidationInfo(
      "info",
      `${words.length} words entered. Click "Validate Phrase" to check validity.`
    );
  }
}

function validatePhrase() {
  if (currentPhrase.length === 0) {
    updateValidationInfo("error", "Please enter a recovery phrase first.");
    return;
  }

  if (![12, 15, 18, 21, 24].includes(currentPhrase.length)) {
    updateValidationInfo(
      "error",
      `Invalid phrase length. Expected 12, 15, 18, 21, or 24 words, got ${currentPhrase.length} words.`
    );
    return;
  }

  isValidPhrase = true;
  updateValidationInfo(
    "success",
    `✓ Valid ${currentPhrase.length}-word recovery phrase detected!`
  );
  generatePreview();
}

function updateValidationInfo(type, message) {
  validationInfo.className = `validation-info ${type}`;
  validationInfo.innerHTML = `<i class="fas fa-${getIconForType(
    type
  )}"></i><span>${message}</span>`;
}

function getIconForType(type) {
  switch (type) {
    case "success":
      return "check-circle";
    case "error":
      return "exclamation-circle";
    default:
      return "info-circle";
  }
}

function generatePreview() {
  if (!isValidPhrase) return;

  const previewHTML = `
        <div class="phrase-preview">
            ${currentPhrase
              .map(
                (word, index) => `
                <div class="word-item">
                    <div class="word-number">${index + 1}</div>
                    <div class="word-text">${word}</div>
                </div>
            `
              )
              .join("")}
        </div>
        <div class="preview-info">
            <p><strong>Phrase Length:</strong> ${currentPhrase.length} words</p>
            <p><strong>Ready to Print:</strong> Your recovery phrase is formatted and ready for secure printing.</p>
        </div>
    `;

  previewContainer.innerHTML = previewHTML;
  previewSection.style.display = "block";

  previewSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearPhrase() {
  if (confirm("Are you sure you want to clear the recovery phrase?")) {
    recoveryPhraseInput.value = "";
    currentPhrase = [];
    isValidPhrase = false;
    wordCountDisplay.textContent = "0";
    previewSection.style.display = "none";
    updateValidationInfo("info", "Please enter your recovery phrase");
    recoveryPhraseInput.focus();
  }
}

function printPhrase() {
  if (!isValidPhrase) {
    alert("Please validate your recovery phrase first.");
    return;
  }

  if (
    !confirm(
      "Are you sure you want to print your recovery phrase? Make sure you are using a secure, offline printer."
    )
  ) {
    return;
  }

  generatePrintContent();

  document.getElementById("printDate").textContent =
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  window.print();
}

function generatePrintContent() {
  const printPhraseGrid = document.getElementById("printPhraseGrid");

  const gridHTML = currentPhrase
    .map(
      (word, index) => `
        <div class="print-word-item">
            <div class="print-word-number">${index + 1}</div>
            <div class="print-word-text">${word}</div>
        </div>
    `
    )
    .join("");

  printPhraseGrid.innerHTML = gridHTML;
}

function downloadPDF() {
  if (!isValidPhrase) {
    alert("Please validate your recovery phrase first.");
    return;
  }

  if (
    !confirm(
      "Are you sure you want to download your recovery phrase as PDF? Ensure you store it securely."
    )
  ) {
    return;
  }

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("🛡️ CryptoVault Recovery Phrase", 20, 30);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated on: ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      20,
      40
    );

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Recovery Phrase:", 20, 60);

    let yPosition = 75;
    const wordsPerRow = 3;

    for (let i = 0; i < currentPhrase.length; i += wordsPerRow) {
      const rowWords = currentPhrase.slice(i, i + wordsPerRow);
      let xPosition = 20;

      rowWords.forEach((word, index) => {
        const wordNumber = i + index + 1;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`${wordNumber}.`, xPosition, yPosition);
        doc.setFont("courier", "bold");
        doc.setFontSize(12);
        doc.text(word, xPosition + 15, yPosition);
        xPosition += 60;
      });

      yPosition += 15;
    }

    yPosition += 20;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Recovery Instructions:", 20, yPosition);

    yPosition += 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const instructions = [
      "1. Keep this document in a secure, fireproof location",
      "2. Make multiple copies and store them separately",
      "3. Never store digitally or take photos",
      "4. Words must be entered in the exact order shown",
      "5. Verify each word carefully when recovering your wallet",
    ];

    instructions.forEach((instruction) => {
      doc.text(instruction, 25, yPosition);
      yPosition += 10;
    });

    yPosition += 15;
    doc.setDrawColor(255, 0, 0);
    doc.setFillColor(255, 240, 240);
    doc.rect(15, yPosition - 5, 180, 25, "FD");

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 0, 0);
    doc.text("⚠️ WARNING:", 20, yPosition + 5);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Anyone with access to this recovery phrase can access your",
      20,
      yPosition + 15
    );
    doc.text(
      "cryptocurrency. Keep it absolutely secure and private.",
      20,
      yPosition + 25
    );

    doc.save("cryptovault-recovery-phrase.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error generating PDF. Please try printing instead.");
  }
}

window.addEventListener("load", () => {
  setTimeout(() => {
    if (currentPhrase.length === 0) {
      updateValidationInfo(
        "info",
        "🔒 Remember: This tool works entirely in your browser. No data is sent to external servers."
      );
    }
  }, 2000);
});

window.addEventListener("beforeunload", (event) => {
  if (recoveryPhraseInput.value.trim().length > 0) {
    event.preventDefault();
    event.returnValue =
      "You have entered a recovery phrase. Are you sure you want to leave?";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "Enter") {
    event.preventDefault();
    validatePhrase();
  }

  if (event.ctrlKey && event.key === "p" && isValidPhrase) {
    event.preventDefault();
    printPhrase();
  }

  if (event.key === "Escape" && recoveryPhraseInput.value.trim().length > 0) {
    clearPhrase();
  }
});

window.addEventListener("load", () => {
  recoveryPhraseInput.focus();
});
