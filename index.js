const csv = require('csv-parser')
const fs = require('fs')
const translateRow = require('./googleTranslateClient')
const ewc_descriptions = require('./private/originals/EWCcodeDescriptions')
// console.log('go to index.js to uncomment function callls')

let results = []

const pickClassifiedCSV = async () => {
  fs.createReadStream('./private/originals/nlData.csv')
    .pipe(csv())
    .on('data', row => {
      let { description, euralDescription, euralCode, material, mixedOrPure, cleanOrDirty } = row
      if (euralDescription.length === 0) {
        euralDescription = ewc_descriptions[String(euralCode)]
      }
      if (description.length < 5) description = `${description}, ${euralDescription}`

      // change string values of yes/no type to integers for ML model training:

      if (mixedOrPure == 'mixed') row.mixedOrPure = '1'
      if (mixedOrPure == 'pure') row.mixedOrPure = '0'
      if (cleanOrDirty == 'contaminated') row.cleanOrDirty = '1'
      if (cleanOrDirty == 'clean') row.cleanOrDirty = '0'
      // console.log(row)
      if (material.length === 0) results.push(row) // if material is given
      // saveFile('nlMaterialData', JSON.stringify(results))
    })
    .on('end', () => {
      fs.writeFileSync('nlWithoutMaterialData', JSON.stringify(results))
    })
}
pickClassifiedCSV()

let undescribedEuralCodes = []

const codesWithoutDescription = (code, desc) => {
  if (desc.length === 0) undescribedEuralCodes.push(code)
  return [...new Set(undescribedEuralCodes)]
}

const saveFile = (name, obj) => {
  fs.writeFile(`/Users/jolantajas/Projects/recycling/${name}.json`, obj, 'utf8', err => {
    if (err) return console.log(err)
    console.log(`The stringified json file ${name} was saved!`)
  })
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
        allRows = JSON.stringify(allRows)
        saveFile('enData', allRows) // TODO: amend, as currently saves on each row update
      })
    // .on('end', () => {
    // })
  } catch (e) {
    console.log('error --->', e)
  }
}

const getEuralCodeDescriptions = () => {
  let allCodes = {}
  fs.createReadStream('./private/evcTable.csv')
    .pipe(csv())
    .on('data', row => {
      let { EWC, EWC_name } = row
      allCodes[EWC] = EWC_name
    })
    .on('end', () => {
      saveFile('EWCcodeDescriptions', JSON.stringify([allCodes]))
    })
}
