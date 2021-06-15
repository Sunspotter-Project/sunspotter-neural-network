# SunSpotter - Projektarbeit ADS FS2021 
:cloud_with_rain: :partly_sunny: :sunny: :heartpulse:

Projektarbeit für das Modul Applied Data Science von Claudio Hauser, Matthias Christen und Marion Mürner

## About the Project

This project is part of the ADS module in FS2021. It realises the use of machine learning in the context of webcam images to predict whether a webcam image shows good or bad weather.

![image](https://github.zhaw.ch/storage/user/1550/files/5e9bac80-cdb4-11eb-9ef5-6f8ba93eb040)


## Getting Started

#### Start Sun spotter webapp

```./app>docker-compose up```

or if you want to fore a rebuild of the container:

```./app>docker-compose up --build```

Open the sun spotter app in your web browser

```http://localhost:3000/webcam/map```

## Contributing
### Useful Commands
#### Start TensorBoard from command line

```tensorboard --logdir /my_logs_transferLearning```
