# Tabular Waste Data Classifications Model

## Uses dutch waste data

data ommitted within repo for data sensitivity reasons)

## Process

### Augmenting data:

**1.Translation services**

- Google tranlsate API and service account
- client was set up to provide the translations from **nl** to **en**

**2. Boolean-like field value overwrrides**

- translating fields of 2 options of strings values into integers - 0, 1
- such as `pureOrMixed` string values of `pure` and `mixed` become integers 1 or 0

**3. Enriching data**

- Prefilling the fields where possible
- such as waste `description` field, prefilled with `euralCodeDescription` when underdefined

**4. Creating both train and test data frames**

- for training of ML model - uses train data with rich fields
- for testing of ML model - uses test data with missing fields

### Training Fast AI Machine Learning classification model:

**5. [Fast AI Tabular Neural Nets](https://docs.fast.ai/tabular.html) for ML classification model**

- Using neural nets for analyzing tabular data
- Loading data into Pandas DataFrame
- Using categorical variables for embedings ([more on embedings](https://towardsdatascience.com/neural-network-embeddings-explained-4d028e6f0526))
- using continuous variables (numeric values) for neural nets

**6. Demo time\* !**

###### \*unfortunately for data privacy reasons the data required is not included in this repo. Please reach out or message if you will
