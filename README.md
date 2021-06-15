# SunSpotter - Projektarbeit ADS FS2021 
:cloud_with_rain: :partly_sunny: :sunny: :heartpulse:

Projektarbeit für das Modul Applied Data Science von Claudio Hauser, Matthias Christen und Marion Mürner

## About the Project

This project is part of the ADS module in FS2021. It realises the use of machine learning in the context of webcam images to predict whether a webcam image shows good or bad weather.

![image](https://github.zhaw.ch/storage/user/1550/files/5e9bac80-cdb4-11eb-9ef5-6f8ba93eb040)


## Getting Started

#### Start Sun spotter webapp and TensorBoard

Specify in the docker-compose.yml for the volume where the webcam images should be downloaded a local disc path:

```
# all downloaded webcam images get stored in the ./sunspotter/downloads path
#- ./app/sunspotter/downloads:/opt/sunspotter/downloads
- "${pwd}/app/sunspotter/downloads":/opt/sunspotter/downloads
```

Specify in the docker-compose.yml for the volume where the Tensorflow log files are a local disc path:

```
# Set your path to tensorflow logs
#- ./code/jupyterNotebook/my_logs:/tf_logs
- "${pwd}/code/jupyterNotebook/my_logs":/tf_logs
```

Start the sunspotter app and TensorBoard containers

```./docker-compose up```

or if you want to fore a rebuild of the containers:

```./docker-compose up --build```

Open the sun spotter app in your web browser

```http://localhost:3000/webcam/map```

1. Scrape webcams: Scrape all webcams from foto-webcam.eu and initializes the database
2. Geocode all webcams: Try to geocode the webcam positions with the webcam name (if the checkbox 'Use geocode services' is checked its done with the geocode service from the openrouteservice.org. Otherwise the positions are read from earlier file cached responses from this service.)
3. Predict all webcams: Runs a weather prediction with Tensorflow for all webcams with their live image from the actual hour (takes some time ~5min)

Open the TensorBoard in your web browser

```http://localhost:6006/```

## Contributing
### Useful Commands
#### Start TensorBoard from command line

```tensorboard --logdir /my_logs_transferLearning```
