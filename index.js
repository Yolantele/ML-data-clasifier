const csv = require('csv-parser')
const fs = require('fs')
const translateRow = require('./googleTranslateClient')
const ewc_descriptions = require('./private/originals/EWCcodeDescriptions')

const testTranslate = async () => {
  try {
    let t = await translateRow(
      `,,,,,vast,,,,,organisch materiaal,bloembollen,,,,organisch materiaal,,,puur,,afval van plantaardige weefsels,020103,Bloembollen,,,,`
    )
    console.log('translated to -----', t)
  } catch (e) {
    console.log('error translating-------', e)
  }
}
// testTranslate()

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

const modifyCSV = async () => {
  let allRows = []
  try {
    let t
    fs.createReadStream('./private/originals/small.csv')
      .pipe(csv())
      .on('end', () => console.log('all done ---'))
      .on('data', async (row) => {
        let string = `${Object.values(row)}`
        t = await translateRow(string)
        allRows.push(t)

        fs.writeFileSync('enData_06_18_2020', JSON.stringify(allRows))
      })
  } catch (e) {
    console.log('error mofifyCSV --->', e)
  }
}

// modifyCSV()
