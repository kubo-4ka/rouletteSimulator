const itemCountSelect = document.getElementById('itemCount');
const frictionLevelSelect = document.getElementById('frictionLevel');
const trialCountSelect = document.getElementById('trialCount');
const runButton = document.getElementById('runButton');
const resultArea = document.getElementById('resultArea');
const resultChartCanvas = document.getElementById('resultChart');
const resultTable = document.getElementById('resultTable');

for (let i = 2; i <= 12; i++) {
  const opt = document.createElement('option');
  opt.value = i;
  opt.textContent = i;
  itemCountSelect.appendChild(opt);
}
itemCountSelect.value = 6;

runButton.addEventListener('click', () => {
  const itemCount = Number(itemCountSelect.value);
  const frictionLevel = frictionLevelSelect.value;
  const trials = Number(trialCountSelect.value);

  const items = Array.from({ length: itemCount }, (_, i) => `${i + 1}`);
  const frictionMap = { slow: 0.996, normal: 0.98, fast: 0.955 };
  const stopThresholdMap = { slow: 0.0005, normal: 0.002, fast: 0.01 };

  const friction = frictionMap[frictionLevel] || 0.98;
  const stopThreshold = stopThresholdMap[frictionLevel] || 0.002;

  const counts = Array(itemCount).fill(0);

  for (let t = 0; t < trials; t++) {
    let angle = 0;
    let velocity = Math.random() * 0.2 + 0.3;
    while (velocity > stopThreshold) {
      angle += velocity;
      velocity *= friction;
    }
    const index = Math.floor(((2 * Math.PI - angle % (2 * Math.PI)) % (2 * Math.PI)) / (2 * Math.PI / itemCount));
    counts[index]++;
  }

  const labels = items;
  const data = counts;
  const percentages = counts.map(c => ((c / trials) * 100).toFixed(6) + '%');

  if (window.resultChartInstance) {
    window.resultChartInstance.destroy();
  }

  window.resultChartInstance = new Chart(resultChartCanvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: '出現回数',
        data: data,
        backgroundColor: '#5c2d91'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  let tableHtml = '<tr><th>項目</th><th>回数</th><th>割合</th></tr>';
  for (let i = 0; i < labels.length; i++) {
    tableHtml += `<tr><td>${labels[i]}</td><td>${counts[i]}</td><td>${percentages[i]}</td></tr>`;
  }
  resultTable.innerHTML = tableHtml;

  resultArea.classList.remove('hidden');
});
