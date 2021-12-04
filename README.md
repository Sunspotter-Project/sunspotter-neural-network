# SunSpotter - Project work aF&E HS2021 
🕶️(:cloud_with_rain: + :sunny:) = :heartpulse:

Projectwork for the modul applied research and development from Martina Buchmeier, Matthias Christen and Marion Mürner.
Supervised by Dr. Elena Gavagnin.

## About the Project

This project inlcudes a web application through which sunny places can be found. The sunny locations are displayed via an image of a cam. In the background of the application a ML algorithm is used to decide which cameras are selected. The alogrithm is trained with scraped webcam images and is used to check the current webcam images. 

![image](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/drawings/mockup.JPG)

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

1. Scrape webcams: Scrape random webcams from windy.com and initializes the database
2. Geocode all webcams: Try to geocode the webcam positions with the webcam name (if the checkbox 'Use geocode services' is checked its done with the geocode service from the openrouteservice.org. Otherwise the positions are read from earlier file cached responses from this service.)
3. Predict all webcams: Runs a weather prediction with Tensorflow for all webcams with their live image from the actual hour (takes some time ~5min)

#### Open the TensorBoard in your web browser

```http://localhost:6006/```

## Contributing
### Useful Commands
#### Start TensorBoard from command line

```tensorboard --logdir /my_logs_transferLearning```
