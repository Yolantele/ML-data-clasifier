const csv = require('csv-parser')
const fs = require('fs')
const translateRow = require('./googleTranslateClient')
const ewc_descriptions = require('./private/originals/EWCcodeDescriptions')
let results = []

const createEuralDescritpionsCSV = async () => {
  try {
    let t
    fs.createReadStream('./private/originals/nlData.csv')
      .pipe(csv())
      .on('data', async (row) => {
        let { euralDescription, material, description = ' a' } = row
        if (
          euralDescription &&
          euralDescription.length > 0 &&
          material &&
          material.length > 0 &&
          description &&
          description.lenght > 0
        )
          // add eural code description to description field - enrich data
          description = description + ' ' + euralDescription

        row = { ...row, description }
        results.push(row)
      })
      .on('end', () =>
        fs.writeFileSync('nlDescriptionWithEuralDescription', JSON.stringify(results))
      )
  } catch (e) {
    console.log('error --->', e)
  }
}

const pickClassifiedCSV = async () => {
  fs.createReadStream('./private/originals/nlData.csv')
    .pipe(csv())
    .on('data', (row) => {
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
      if (material.length === 0) results.push(row) // if material is given
    })
    .on('end', () => {
      saveFile('nlWithoutMaterialData', JSON.stringify(results))
    })
}

let undescribedEuralCodes = []

const codesWithoutDescription = (code, desc) => {
  if (desc.length === 0) undescribedEuralCodes.push(code)
  return [...new Set(undescribedEuralCodes)]
}

const saveFile = (name, obj) => {
  fs.writeFile(
    `/Users/jolantajas/Projects/geoFluxus/ML-data-clasifier/${name}.csv`,
    obj,
    'utf8',
    (err) => {
      if (err) return console.log(err)
      console.log(`The stringified json file ${name} was saved!`)
    }
  )
}

const getEuralCodeDescriptions = () => {
  let allCodes = {}
  fs.createReadStream('./private/evcTable.csv')
    .pipe(csv())
    .on('data', (row) => {
      let { EWC, EWC_name } = row
      allCodes[EWC] = EWC_name
    })
    .on('end', () => {
      saveFile('EWCcodeDescriptions', JSON.stringify([allCodes]))
    })
}

const getUniqueMaterials = () => {
  let uniqueMaterials = []
  fs.createReadStream('./private/sanitized/enData.csv')
    .pipe(csv())
    .on('data', (row) => {
      const {
        material: material1,
        material2,
        material3,
        material4,
        directProduct,
        indirectProduct
      } = row
      let material = indirectProduct && indirectProduct.toLowerCase()
      if (!uniqueMaterials.filter((each) => each === material).length)
        uniqueMaterials.push(material)
    })
    .on('end', () => {
      saveFile('enUniqueMaterials', JSON.stringify(uniqueMaterials))
      console.log(uniqueMaterials)
    })
}

// getUniqueMaterials()
