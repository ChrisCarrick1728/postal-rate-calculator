const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var convert = require('xml-js')

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
    var params = {'cost': '0.00'}
    res.render('pages/index', params)
  })
  .get('/getData', (req, res) => {
    if (JSON.stringify(req.query) == '{}'){
      var params = {'cost': '0.00'}
      res.render('pages/index', params)
    } else {
      var cost = ''
      cost = calculateRate(req.query)
      if (!isNaN(cost)) {
        cost = cost.toFixed(2)
      }
      var params = {'cost': cost.toString()}
      res.render('pages/getData', params)
    }
  })
  .get('/getData_json', (req, res) => {
    var params = {'mailType': req.query.mailType, 'itemWeight': req.query.itemWeight, 'total': calculateRate(req.query)}
    res.writeHead(200, {"Content-Type": "application/json"})
    res.write(JSON.stringify(params))
    res.end()
  })
  .get('/getData_xml', (req, res) => {
    var params = {'postageRate': {'mailType': { "_text": req.query.mailType }, 'itemWeight': { "_text": req.query.itemWeight}, 'total': { "_text": calculateRate(req.query)}}}
    res.writeHead(200, {"Content-Type": "application/xml"})
    res.write(convert.js2xml(params, {compact: true}))
    res.end()
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


function calculateRate(q) {
  //console.log(q)
  if (q.mailType == 'stampedLetter') {
    if (q.itemWeight <= 1) {
      return 0.55
    } else if (q.itemWeight <= 2) {
      return 0.70
    } else if (q.itemWeight <= 3) {
      return 0.85
    } else if (q.itemWeight <= 3.5) {
      return 1.00
    } else {
      return "over weight"
    }
  } else if (q.mailType == 'meteredLetter') {
    if (q.itemWeight <= 1) {
      return 0.50
    } else if (q.itemWeight <= 2) {
      return 0.65
    } else if (q.itemWeight <= 3) {
      return 0.80
    } else if (q.itemWeight <= 3.5) {
      return 0.95
    } else {
      return "over weight"
    }
  } else if (q.mailType == 'largeEnvelopes') {
    if (q.itemWeight <= 1) {
      return 1.00
    } else if (q.itemWeight <= 2) {
      return 1.15
    } else if (q.itemWeight <= 3) {
      return 1.30
    } else if (q.itemWeight <= 4) {
      return 1.45
    } else if (q.itemWeight <= 5) {
      return 1.60
    } else if (q.itemWeight <= 6) {
      return 1.75
    } else if (q.itemWeight <= 7) {
      return 1.90
    } else if (q.itemWeight <= 8) {
      return 2.05
    } else if (q.itemWeight <= 9) {
      return 2.20
    } else if (q.itemWeight <= 10) {
      return 2.35
    } else if (q.itemWeight <= 11) {
      return 2.50
    } else if (q.itemWeight <= 12) {
      return 2.65
    } else if (q.itemWeight <= 13) {
      return 2.80
    } else {
      return "over weight"
    }
  } else if (q.mailType == 'firstClassPackage') {
    if (q.itemWeight <= 4) {
      return 3.66
    } else if (q.itemWeight <= 8) {
      return 4.39
    } else if (q.itemWeight <= 12) {
      return 5.19
    } else if (q.itemWeight <= 13) {
      return 5.71
    } else {
      return "over weight"
    }
  }
}