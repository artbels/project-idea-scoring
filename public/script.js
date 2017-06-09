var columns = [
{ data: 'Project idea', width: 180, renderer: linkRenderer},
{ data: 'Score', type: 'numeric', jsType: 'number', width: 50},
{ data: 'Reason', width: 110, type: 'dropdown', source: ['3 — fun', '2 — skills', '2 — marketing', '1 — money']},
{ data: 'BM', width: 90, type: 'dropdown', source: ['3 — B2G', '2 — B2C', '2 — B2B2C', '1 — B2B']},
{ data: 'One-time payment', width: 150, type: 'dropdown', source: ['5 — $0', '4 — up to $20', '3 — $20 < N > $100', '2 — $100 < N > $1000', '1 — N > $1000']},
{ data: 'Recurring', width: 120, type: 'dropdown', source: ['3 — no recur.', '2 — annual', '1 — monthly']},
{ data: 'GEO', width: 120, type: 'dropdown', source: ['3 — local only', '2 — reg. expansion', '1 — big market']},
{ data: 'Problem', width: 160, type: 'dropdown', source: ['6 — no', '5 — one-time', '4 — small, every month', '3 — small, everyday', '2 — big, every month', '1 — big, everyday']},
{ data: 'Product', width: 100, type: 'dropdown', source: ['3 — hardware', '2 — soft + hard', '2 — content', '1 — software']},
{ data: 'MVP', width: 120, type: 'dropdown', source: ['3 — code', '2 — integrations', '1 — without code']},
{ data: 'Community access', width: 140, type: 'dropdown', source: ['2 — no', '1 — yes']}
]

var htParams = {
  columns: columns,
  colWidths: columns.map(function (a) {
    return a.width
  }),
  minSpareRows: 3,
  afterSelectionByProp: afterSelectionByProp,
  afterChange: afterChange,
  manualColumnResize: true,
  columnSorting: true,
  contextMenu: ['row_above', 'row_below', 'remove_row']
}

var data = [{'Community access': '1 — yes', 'MVP': '1 — without code', 'Product': '1 — software', 'Problem': '4 — small, every month', 'GEO': '3 — local only', 'Recurring': '3 — no recurring', 'One-time payment': '4 — up to $20', 'BM': '2 — B2B2C', 'Reason': '1 — money', 'Score': 20, 'Project idea': 'workcelerator.com'}, {'Community access': '1 — yes', 'MVP': '1 — without code', 'Product': '2 — content', 'Problem': '4 — small, every month', 'GEO': '3 — local only', 'Recurring': '3 — no recurring', 'One-time payment': '5 — $0', 'BM': '2 — B2C', 'Reason': '2 — marketing', 'Score': 23, 'Project idea': 'course.growthup.com'}, {'Community access': '2 — no', 'MVP': '1 — without code', 'Product': '1 — software', 'Problem': '3 — small, everyday', 'GEO': '3 — local only', 'Recurring': '3 — no recurring', 'One-time payment': '5 — $0', 'BM': '2 — B2C', 'Reason': '3 — fun', 'Score': 23, 'Project idea': 'radiolist.com.ua'}]
if (localStorage.data) data = JSON.parse(localStorage.data)

var chartData = {
  labels: ['Reason', 'BM', 'One-time payment',
    'Recurring', 'GEO', 'Problem', 'Product', 'MVP', 'Community access'],
  datasets: [{
    label: '',
    backgroundColor: Chart.helpers.color('rgb(255, 99, 132)').alpha(0.5).rgbString(),
    borderColor: 'rgb(255, 99, 132)',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
  }]
}

var chartRow

var myRadarChart = new Chart('myChart', {
  type: 'radar',
  data: chartData,
  options: {
    title: {
      display: false
    }}
})

HH.draw(data, htParams)

function afterSelectionByProp (r) {
  chartRow = r
  updateChart()
}

function getValuesRow (row) {
  var values = row.slice(2).map(function (a) {
    if (!a) return 0
    return Number(a.split(' — ')[0] || 0)
  })
  return values
}

function updateChart () {
  var row = htParams.instance.getDataAtRow(chartRow)
  var values = getValuesRow(row)

  myRadarChart.data.datasets[0].data = values
  myRadarChart.data.datasets[0].label = row[0]
  myRadarChart.update()
}

function afterChange (changes, src) {
  if (src === 'setDataAtRowProp') return
  localStorage.data = JSON.stringify(data)
  if (!htParams.instance) return
  htParams.instance.getData().forEach(function (row, index) {
    var sum = row.slice(2).reduce(function (a, b) {
      if (!b) return
      return a + Number(b.split(' — ')[0] || 0)
    }, 0)
    if (sum) htParams.instance.setDataAtRowProp(index, 'Score', sum, 'setDataAtRowProp')
  })
  updateChart()
}

function linkRenderer (instance, td, row, col, prop, value) {
  Handsontable.Dom.empty(td)

  if (!/\./.test(value)) {
    td.innerHTML = value
  } else {
    var href = value
    if (!/http/.test(href)) href = 'http://' + href
    var a = document.createElement('a')
    a.href = href
    a.target = '_blank'
    a.innerHTML = value
    td.appendChild(a)

    Handsontable.Dom.addEvent(a, 'mousedown', function (e) {
      e.preventDefault() // prevent selection quirk
    })
  }
  return td
}

