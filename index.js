const csv = require('csv-parser')
const fs = require('fs')
const translateRow = require('./translator')

let undescribedEuralCodes = []

const codesWithoutDescription = (code, desc) => {
  if (desc.length === 0) undescribedEuralCodes.push(code)
  return [...new Set(undescribedEuralCodes)]
}

const saveFile = (name, obj) => {
  const stringifiedJSON = JSON.stringify(obj)
  fs.writeFile(
    `/Users/jolantajas/Projects/recycling/${name}.json`,
    stringifiedJSON,
    'utf8',
    err => {
      if (err) return console.log(err)
      console.log('The file was saved!')
    }
  )
}

const modifyCSV = async () => {
  try {
    let allRows = []
    fs.createReadStream('./private/nlData.csv')
      .pipe(csv())
      .on('data', async row => {
        let { description, material, euralDescription, euralCode } = row
        // undescribedEuralCodes = codesWithoutDescription(euralCode, euralDescription)
        if (description.length < 7) description = `${description}, ${euralDescription}`
        let translatedRow = translateRow(row) // <--- use google-translate carefully £££
        allRows.push(translatedRow)
        saveFile('enData', allRows) // TODO: amend, as currently saves on each row update
      })
    // .on('end', () => {
    // })
  } catch (e) {
    console.log('error --->', e)
  }
}

modifyCSV()
