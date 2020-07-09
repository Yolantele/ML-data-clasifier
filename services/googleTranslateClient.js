const { Translate } = require('@google-cloud/translate').v2

const translator = new Translate({
  projectId: 'natural-osprey-273717',
  keyFilename: '/Users/jolantajas/Projects/geoFluxus/ML-data-clasifier/service-account.json'
})

module.exports = async (row) => {
  try {
    let values = Object.values(row)
    let keys = Object.keys(row)
    const target = 'en'

    let [translations] = await translator.translate(row, target) // <--- uncomment, use carefully, expensive API £££

    translations = Array.isArray(translations) ? translations : [translations]
    values = translations

    var translatedRow = {}
    //  Using loop to insert key & value in Object
    for (var i = 0; i < keys.length; i++) {
      translatedRow[keys[i]] = values[i]
    }
    translatedRow = Object.values(translatedRow)[0]
    // console.log(translatedRow)
    return translatedRow
  } catch (e) {
    console.log('translation error -----', e)
  }
}
