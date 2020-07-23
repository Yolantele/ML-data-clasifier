const csv = require('csv-parser')
const fs = require('fs')
const translateRow = require('./googleTranslateClient')
const ewc_descriptions = require('../private/originals/EWCcodeDescriptions')
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
  fs.createReadStream('./private/originals/nlData.csv')
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
      let material = material4 && material4.toLowerCase()
      if (!uniqueMaterials.filter((each) => each === material).length)
        uniqueMaterials.push(material)
    })
    .on('end', () => {
      saveFile('nlUniqueMaterials', JSON.stringify(uniqueMaterials))
      console.log(uniqueMaterials)
    })
}

getUniqueMaterials()

fillUnclassifiedFields = () => {
  let richData = []
  fs.createReadStream('./private/originals/nlData.csv')
    .pipe(csv())
    .on('data', (row) => {
      const NA = 'unclassified'
      let {
        reason,
        origin,
        color,
        state,
        size,
        consistency,
        otherCode,
        material4,
        material3,
        material2,
        material,
        mType,
        composite2,
        composite1,
        cType,
        indirectProduct,
        directProduct,
        pType,
        mixedOrPure,
        cleanOrDirty,
        euralDescription,
        euralCode,
        description
      } = row
      if (reason === '') reason = NA
      if (origin === '') origin = NA
      if (color === '') color = NA
      if (state === '') state = NA
      if (size === '') size = NA
      if (consistency === '') consistency = NA
      if (otherCode === '') otherCode = NA
      if (material4 === '') material4 = NA
      if (material3 === '') material3 = NA
      if (material2 === '') material3 = NA
      if (material === '') material = NA
      if (mType === '') mType = NA
      if (composite2 === '') composite2 = NA
      if (composite1 === '') composite1 = NA
      if (cType === '') cType = NA
      if (indirectProduct === '') indirectProduct = NA
      if (directProduct === '') directProduct = NA
      if (pType === '') pType = NA
      if (mixedOrPure === '') mixedOrPure = NA
      if (cleanOrDirty === '') cleanOrDirty = NA
      if (euralDescription === '') euralDescription = NA
      if (euralCode === '') euralCode = NA
      if (description === '') description = NA
      const richRow = {
        reason,
        origin,
        color,
        state,
        size,
        consistency,
        otherCode,
        material4,
        material3,
        material2,
        material,
        mType,
        composite2,
        composite1,
        cType,
        indirectProduct,
        directProduct,
        pType,
        mixedOrPure,
        cleanOrDirty,
        euralDescription,
        euralCode,
        description
      }
      richData.push(richRow)
    })
    .on('end', () => {
      saveFile('nlDataRich', JSON.stringify(richData))
      console.log('all file saved-----')
    })
}
