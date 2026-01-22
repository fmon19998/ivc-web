const csvFile = document.getElementById('csvFile');
const csvText = document.getElementById('csvText');
const nameCol = document.getElementById('nameCol');
const phoneCol = document.getElementById('phoneCol');
const result = document.getElementById('result');

let csvData = [];

csvFile.addEventListener('change', e => {
  const reader = new FileReader();
  reader.onload = () => parseCSV(reader.result);
  reader.readAsText(e.target.files[0]);
});

csvText.addEventListener('input', () => {
  parseCSV(csvText.value);
});

function parseCSV(text) {
  const rows = text.trim().split('\n').map(r => r.split(','));
  if (rows.length < 2) return;

  csvData = rows;
  const headers = rows[0];

  nameCol.innerHTML = '';
  phoneCol.innerHTML = '';

  headers.forEach((h, i) => {
    nameCol.innerHTML += `<option value="${i}">${h}</option>`;
    phoneCol.innerHTML += `<option value="${i}">${h}</option>`;
  });
}

function convert() {
  if (!csvData.length) return alert('CSV kosong');

  const nameIndex = nameCol.value;
  const phoneIndex = phoneCol.value;

  let vcf = '';
  for (let i = 1; i < csvData.length; i++) {
    const row = csvData[i];
    if (!row[phoneIndex]) continue;

    vcf += `BEGIN:VCARD
VERSION:3.0
FN:${row[nameIndex] || ''}
TEL:${row[phoneIndex]}
END:VCARD
`;
  }

  const blob = new Blob([vcf], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);

  result.innerHTML = `
    <p>${csvData.length - 1} contacts converted</p>
    <a href="${url}" download="contacts.vcf">
      <button>Download vCard</button>
    </a>
  `;
}
