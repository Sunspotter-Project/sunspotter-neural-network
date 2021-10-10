# SunSpotter - Projektarbeit aF&E HS2021 
:cloud_with_rain: :partly_sunny: :sunny: :heartpulse:

Projektarbeit für das Modul angewandte Forschung und Entwicklung von Martina Buchmeier, Matthias Christen und Marion Mürner.
Betreut durch Dr. Elena Gavagnin

## About the Project

This project is part of the ADS module in FS2021. It realises the use of machine learning in the context of webcam images to predict whether a webcam image shows good or bad weather.

![image](https://github.zhaw.ch/muon/ads-fs2021-project-sunspotter/blob/master/drawings/sunspotter-app.png)

## System architecture

The following graphic shows the parts of sun spotter application:

![image](https://github.zhaw.ch/muon/ads-fs2021-project-sunspotter/blob/master/drawings/sunspotter-tech-integration.png)


## Jupyter Notebooks
* Own CNN-Model with classifier see file: [ownCNNClassificationSunSpotter.ipynb](https://github.zhaw.ch/muon/ads-fs2021-project-sunspotter/blob/master/code/jupyterNotebook/ownCNNClassificationSunSpotter.ipynb)
* Transer-Learning attempt with pretrained CNN-Model see file: [transferLearningCNNClassificationSunSpotter.ipynb](https://github.zhaw.ch/muon/ads-fs2021-project-sunspotter/blob/master/code/jupyterNotebook/transferLearningCNNClassificationSunSpotter.ipynb)

## Getting Started

#### Start Sun spotter webapp and TensorBoard

Start the sunspotter app and TensorBoard containers

```./docker-compose up```

or if you want to fore a rebuild of the containers:

```./docker-compose up --build```

#### Open the sun spotter app in your web browser

```http://localhost:3000/webcam/map```

##### Functionalities

1. Scrape webcams: Scrape all webcams from foto-webcam.eu and initializes the database
2. Geocode all webcams: Try to geocode the webcam positions with the webcam name (if the checkbox 'Use geocode services' is checked its done with the geocode service from the openrouteservice.org. Otherwise the positions are read from earlier file cached responses from this service.)
3. Predict all webcams: Runs a weather prediction with Tensorflow for all webcams with their live image from the actual hour (takes some time ~5min)

#### Open the TensorBoard in your web browser

```http://localhost:6006/```

## Contributing
### Useful Commands
#### Start TensorBoard from command line

```tensorboard --logdir /my_logs_transferLearning```
