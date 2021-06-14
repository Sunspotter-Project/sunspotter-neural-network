# SunSpotter - Projektarbeit ADS FS2021 
:cloud_with_rain: :partly_sunny: :sunny: :heartpulse:

Projektarbeit für das Modul Applied Data Science von Claudio Hauser, Matthias Christen und Marion Mürner

## Titel
### Subtitel

#### Importing a Keras model into TensorFlow.js
https://www.tensorflow.org/js/tutorials/conversion/import_keras

```tensorflowjs_converter --input_format keras sunSpotter_keras_transferLearning_model.h5 tfjs_model```

#### Start TensorBoard from command line

```tensorboard --logdir /my_logs_transferLearning```

#### Start Sun spotter webapp

```./app>docker-compose up```

or if you want to fore a rebuild of the container:

```./app>docker-compose up --build```

Open the sun spotter app in your web browser

```http://localhost:3000/webcam/map```


