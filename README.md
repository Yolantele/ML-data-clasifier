# Tabular Waste Data Classifications Model

## Uses Dutch Waste Data

- Construction and demolition waste
- Packaging waste and recyclables
- Electronic and electrical equipment
- Vehicle and oily wastes
- Healthcare and related wastes

###### data ommitted within repo for data sensitivity reasons

## Training of the Fast AI Machine Learning classification model:

### See the ML model [here](https://github.com/Yolantele/ML-data-clasifier/blob/master/tabular_neural_net_classification_model.ipynb)

**This project uses [Fast AI Tabular Neural Nets](https://docs.fast.ai/tabular.html) for ML classification model:**

- Using neural nets for analyzing tabular data
- Loading data into Pandas DataFrame
- Using categorical variables for embedings ([more on embedings](https://towardsdatascience.com/neural-network-embeddings-explained-4d028e6f0526))
- using continuous variables (numeric values) for neural nets
- using 3 data sets: train, validation and test data

###### \*unfortunately for data privacy reasons the data required is not included in this repo. Please reach out or message if you will

## Treating The Data:

**1.Translation services**

- [Google tranlsate API](https://cloud.google.com/translate/docs) and service account
- client was set up to provide the translations from **nl** to **en**

**2. Augmenting data**

- Treating Boolean-like field value overwrrides - fields of 2 options of strings become integers - `0` and `1`
- Fields such as `pureOrMixed` string values of `pure` and `mixed` become integers 1 or 0 to be set later as continuous variables in tabular learner
- Prefilling the fields where possible - such as waste `description` field, prefilled with `euralCodeDescription` when underdefined

**3. Creating 3 sets of data: train, validate and test data**

- loaded to pandas DataFrame
- for training of ML model - uses train and validation data with rich fields
- for testing of ML model - uses test data with missing fields
