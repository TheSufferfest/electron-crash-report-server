'use strict'

const _ = require('lodash')
const createElement = require('virtual-dom/create-element')
const db = require('./db')
const h = require('virtual-dom/h')

function render (response) {
  function tr (row) {
    return h('tr', [
      h('td', h('a', {
        href: `/${row.id}`
      }, row.id)),
      h('td', row.doc.error),
      h('td', row.doc.process_type),
      h('td', row.doc.platform),
      h('td', row.doc.version),
      h('td', h('a', {
        href: `/${row.id}/${_.first(Object.keys(row.doc._attachments))}`
      }, h('img', {
        alt: 'download dump file',
        src: 'data-transfer-download.svg'
      })))
    ])
  }

  return h('html', [
    h('title', 'Crash Reports'),
    h('meta', { charset: 'utf-8' }),
    h('meta', {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    }),
    h('link', { rel: 'stylesheet', href: 'style.css' }),
    h('table', [
      h('thead', [
        h('tr', [
          h('th', 'id'),
          h('th', 'error'),
          h('th', 'process'),
          h('th', 'platform'),
          h('th', 'version'),
          h('th', 'dump')
        ])
      ]),
      h('tbody', response.rows.map(tr))
    ])
  ])
}

module.exports = function listCrashReports (req, res) {
  db.allDocs({
    descending: true,
    include_docs: true
  }).then(function (response) {
    const tree = render(response)
    const vdom = createElement(tree)
    const html = `<!DOCTYPE html>${vdom.toString()}`
    res.set('Content-Type', 'text/html')
    res.send(html)
  })
}
