# SunSpotter - Project work aF&E HS2021 
🕶️(:cloud_with_rain: + :sunny:) = :heartpulse:

## Projectwork for the modul applied research and development from 

 👫 Martina Buchmeier buchmmar@students.zhaw.ch \
 👫 Matthias Christen chrismat@students.zhaw.ch \
 👫 Marion Mürner murnemar@students.zhaw.ch \
 👫 Supervised by Dr. Elena Gavagnin gava@zhaw.ch 

_Open SunSpotter application in you web browser_
🔗 https://www.sunspotter.ch/


## About the Project

This project inlcudes a web application through which sunny places can be found. The sunny and cloudy locations are displayed via an image of a cam. In the background of the application a ML algorithm is used to decide which cameras show a sunny or cloudy picture. The alogrithm is trained with scraped webcam images and is used to check the current webcam images and analyse wheter it is a sunny image or a not sunny image. You can see an example of classified images below.

![image](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/drawings/classesSunnyNotSunny.PNG)

The following picture shows a Mockup of the landing page an its components:
![image](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/drawings/mockup.JPG)

Here you can get a glimps of the real web interface. Each icon on the map represents a webcam. A sunny icon indicates good weather and a cloudy icon indicates bad weather.
![image](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/drawings/LandingPageSunSpotter.png)

## Repositories & Structure

The repositories are divided into two parts:
| Repository   | Description |
|----------|:-------------|
| [afell-hs2021-project-sunspotter](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter) | Current and _Main_ Repository, contains the documentation and the python code for the machine learninig algortihm (Jupyter-Notebooks) and the project organization parts like Github-Project and issues.|
| [sunspotter-src](https://github.com/ZHAW-WI-AFEII-Project-HS2021/sunspotter-src) | Web-Client Repository, contains the code for the webclient.|

The most important folders are: 

| Folder   | Description | Repository |
|----------|:-------------|----------|
| [code/jupyterNotebook](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/tree/main/code/jupyterNotebook) | Contains the jupyternotebooks for the model and exports of trained models. | [afell-hs2021-project-sunspotter](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter)  |
| [planning](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/tree/main/planning) | Contains the gant chart of the project. | [afell-hs2021-project-sunspotter](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter) |
| [db](https://github.com/ZHAW-WI-AFEII-Project-HS2021/sunspotter-src/tree/main/db)|  Contains the database and configuration. | [sunspotter-src](https://github.com/ZHAW-WI-AFEII-Project-HS2021/sunspotter-src)|
| [helios](https://github.com/ZHAW-WI-AFEII-Project-HS2021/sunspotter-src/tree/main/helios)|  Contains the code for the prediction on the web server. | [sunspotter-src](https://github.com/ZHAW-WI-AFEII-Project-HS2021/sunspotter-src)|
| [meteo/CH](https://github.com/ZHAW-WI-AFEII-Project-HS2021/sunspotter-src/tree/main/meteo/CH)|  Contains the meteo measurements - used to determine sun set and sun rise. | [sunspotter-src](https://github.com/ZHAW-WI-AFEII-Project-HS2021/sunspotter-src)|
| [runner](https://github.com/ZHAW-WI-AFEII-Project-HS2021/sunspotter-src/tree/main/runner)|  Contains the docker configuration.| [sunspotter-src](https://github.com/ZHAW-WI-AFEII-Project-HS2021/sunspotter-src)|
| [sunspotter](https://github.com/ZHAW-WI-AFEII-Project-HS2021/sunspotter-src/tree/main/sunspotter)|  Contains the code for the Sunspotter WebApp.| [sunspotter-src](https://github.com/ZHAW-WI-AFEII-Project-HS2021/sunspotter-src)|
| [voyager](https://github.com/ZHAW-WI-AFEII-Project-HS2021/sunspotter-src/tree/main/voyager)|  Contains the code for the scraping of the webcam data.| [sunspotter-src](https://github.com/ZHAW-WI-AFEII-Project-HS2021/sunspotter-src)|

 
Here you can find the whole project with the issues: [SunSpotter aF&E - Project](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/projects/1)

## System architecture

### Client Web Application - Overview
The following graphic shows the parts of SunSpotter application.

![image](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/drawings/WebClientArchitecture.png)

### Client Web Application - Scaling

The Apache server can perform load balancing for several Sunspotter WebApp instances, if there is a lot of load.
Even though webcams are currently only scraped and predicted for Switzerland, it is planned that one Helios and one Voyager instance per country will be responsible for scraping and predicting. The following graphic visualizes the scaling.

![image](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/drawings/WebAppScalability.png)

## Machine Learning - Jupyter Notebooks
To solve the classification problem of sunny and not sunny webcam images, transfer learning is used. In particulary Keras and Tensorflow with its pre-trained models from TensorHub were used to develop the image classifier model for Sunspotter.

* _Productive Code_ Transer-Learning with pretrained CNN-Model see file: [transferLearningCNNClassificationSunSpotter.ipynb](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/code/jupyterNotebook/transferLearningCNNClassificationSunSpotter.ipynb)
  * CNN model used from Tensorflow Hub" mobilenet_v3_small_075_224": "https://tfhub.dev/google/imagenet/mobilenet_v3_small_075_224/feature_vector/5",
  * Fully connected layer with two classes prediction "notSunny" and "sunny"
* _Used Just for experimentation_ The own CNN-Model with classifier see file: [ownCNNClassificationSunSpotter.ipynb](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/code/jupyterNotebook/ownCNNClassificationSunSpotter.ipynb)
  
### Model
Latest model can be found here: [sunSpotter_keras_transferLearning_model_mobilenet_v3_small_075_224_20220111.h5](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/code/jupyterNotebook/sunSpotter_keras_transferLearning_model_mobilenet_v3_small_075_224_20220111.h5)

#### Data

Trainnig _3162_ images belonging to 2 classes \
Validation _790_ images belonging to 2 classes \
Test _252_ images belonging to 2 classes

#### Summary of the Model
![image](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/drawings/ModellSummary.PNG)

#### Model Performance
In the following list one can see how the accurracy and the loss function developed over the epochs.
![image](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/drawings/TrainingOutputEvolutionOfAccurracyAndLoss.PNG)

And the the view of accurracy and loss visualizes as a graph.
![image](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/drawings/DiagrammOutputEvolutionOfAccurracyAndLoss.PNG)

The Performance of the model was measured with a confusion matrix, prediction was made with the test dataset. Most important metric for sunspotter is the _precision for class sunny_! This is because we want to show the user, where he or she should go the get some sun.


| ![image](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/drawings/ConfusionMatrixTestDataSet.PNG) |
| :--: |


## Collaboration
### Getting Started Todo @chrismat

##### Start Sun spotter webapp 
🚧 under construction...
Start the sunspotter app container

```./docker-compose up```

or if you want to fore a rebuild of the container:

```./docker-compose up --build```

##### Open the sun spotter app in your web browser

🚧 under construction...
```http://sunspotter.ch:443```

###### Functionalities

1. Scrape webcams: Scrape random webcams from windy.com and initializes the database
2. Geocode all webcams: Try to geocode the webcam positions with the webcam name (if the checkbox 'Use geocode services' is checked its done with the geocode service from the openrouteservice.org. Otherwise the positions are read from earlier file cached responses from this service.)
3. Predict all webcams: Runs a weather prediction with Tensorflow for all webcams with their live image from the actual hour (takes some time ~5min)
