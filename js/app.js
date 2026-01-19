let csvData = [];

// FILE UPLOAD
document.getElementById('csvFile').addEventListener('change', function (e) {
  const reader = new FileReader();
  reader.onload = () => loadCSV(reader.result);
  reader.readAsText(e.target.files[0]);
});

// PASTE CSV
document.getElementById('csvText').addEventListener('blur', function () {
  if (this.value.trim()) loadCSV(this.value);
});

// LOAD CSV
function loadCSV(text) {
  const rows = text.split(/\r?\n/).filter(r => r.trim());
  csvData = rows.map(r => r.split(','));

  const headers = csvData[0];
  fillSelect('nameCol', headers);
  fillSelect('phoneCol', headers);
  fillSelect('emailCol', headers);
}

// FILL DROPDOWN
function fillSelect(id, headers) {
  const select = document.getElementById(id);
  select.innerHTML = '';
  headers.forEach((h, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = h.trim();
    select.appendChild(opt);
  });
}

// CONVERT TO VCARD
function convert() {
  if (!csvData.length) {
    alert('No CSV data found');
    return;
  }

  const nameIndex = document.getElementById('nameCol').value;
  const phoneIndex = document.getElementById('phoneCol').value;
  const emailIndex = document.getElementById('emailCol').value;

  let vcf = '';

  for (let i = 1; i < csvData.length; i++) {
    const row = csvData[i];
    vcf += `BEGIN:VCARD
VERSION:3.0
FN:${row[nameIndex] || ''}
TEL;TYPE=CELL:${row[phoneIndex] || ''}
EMAIL:${row[emailIndex] || ''}
END:VCARD
`;
  }

  const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  document.getElementById('result').innerHTML = `
    <h3>${csvData.length - 1} Contacts Converted</h3>
    <a href="${url}" download="IVC_contacts.vcf">
      <button>Download vCard</button>
    </a>
  `;
}
