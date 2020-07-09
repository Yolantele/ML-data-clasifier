// Imports the Google Cloud client library
const speech = require('@google-cloud/speech')
const client = new speech.SpeechClient({
  projectId: 'natural-osprey-273717',
  keyFilename: '/Users/jolantajas/Projects/geoFluxus/ML-data-clasifier/service-account.json'
})

const config = {
  encoding: 'FLC',
  sampleRateHertz: 16000,
  languageCode: 'en-US'
}

const audio = {
  uri: 'gs://data-gf/audio-half-2.mp3'
}

const REQUEST = {
  config,
  audio
}
const transcribe = async (request = REQUEST) => {
  // Detects speech in the audio file
  const [operation] = await client.longRunningRecognize(request)
  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise()
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join('\n')
  console.log(`Transcribed-----`)
  saveFile('transcription-2', transcription)
}
