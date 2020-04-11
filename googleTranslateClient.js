const { Translate } = require('@google-cloud/translate').v2

const translator = new Translate({
  projectId: 'natural-osprey-273717',
  keyFilename: '/Users/jolantajas/Projects/ML-data-clasifier/service-account.json'
})

module.exports = async row => {
  let values = Object.values(row)
  let keys = Object.keys(row)
  const target = 'en'

  // let [translations] = await translator.translate(row, target) // <--- uncomment, use carefully, expensive API £££
  translations = Array.isArray(translations) ? translations : [translations]
  values = translations

  var translatedRow = {}
  //  Using loop to insert key & value in Object
  for (var i = 0; i < keys.length; i++) {
    translatedRow[keys[i]] = values[i]
  }

  return translatedRow
}
