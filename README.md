# SunSpotter - Project
😎(:cloud_with_rain: + :sunny:) = :heartpulse:

## Contributors of the Project

 👫 Martina Buchmeier marberbu@hotmail.ch \
 👫 Matthias Christen matthias.christen@posity.ch \
 👫 Marion Mürner marion.muerner@posity.ch \
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
| [sunspotter-neural-network](https://github.com/Sunspotter-Project/sunspotter-neural-network) | Current and _Main_ Repository, contains the documentation and the python code for the machine learninig algortihm (Jupyter-Notebooks) and the project organization parts like Github-Project and issues.|
| [sunspotter-dev](https://github.com/Sunspotter-Project/sunspotter-dev) | Web-Client Repository, contains the code for the webclient and the sunspotter services.|

The most important folders or submodules are: 

| Folder/Submodule | Description | Repository |
|----------|:-------------|----------|
| [code/jupyterNotebook](https://github.com/Sunspotter-Project/sunspotter-neural-network/tree/main/code/jupyterNotebook) | Contains the jupyternotebooks for the model and exports of trained models. | [sunspotter-neural-network](https://github.com/Sunspotter-Project/sunspotter-neural-network)  |
| [db](https://github.com/Sunspotter-Project/db)|  Contains the database and configuration. |[sunspotter-dev](https://github.com/Sunspotter-Project/sunspotter-dev)|
| [helios](https://github.com/Sunspotter-Project/helios)|  Contains the code for the prediction on the web server. | [sunspotter-dev](https://github.com/Sunspotter-Project/sunspotter-dev)|
| [runner](https://github.com/Sunspotter-Project/runner)|  Contains the code for the runner which triggers the helios and voyager instances.| [sunspotter-dev](https://github.com/Sunspotter-Project/sunspotter-dev)|
| [sunspotter](https://github.com/Sunspotter-Project/webapp)|  Contains the code for the Sunspotter WebApp.| [sunspotter-dev](https://github.com/Sunspotter-Project/sunspotter-dev)|
| [voyager](https://github.com/Sunspotter-Project/voyager)|  Contains the code for the scraping of the webcam data.| [sunspotter-dev](https://github.com/Sunspotter-Project/sunspotter-dev)|
| [shared](https://github.com/Sunspotter-Project/shared)|  Contains the code shared between all code projects.|[sunspotter-dev](https://github.com/Sunspotter-Project/sunspotter-dev)|

 
Here you can find the whole project with the issues: [Sunspotter - Project](https://github.com/Sunspotter-Project/sunspotter-neural-network/projects/1)

## System architecture

### Client Web Application - Overview
The following graphic shows the parts of SunSpotter application.

![image](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/drawings/WebClientArchitecture.png)

### Client Web Application - Scaling

The Apache server can perform load balancing for several Sunspotter WebApp instances, if there is a lot of load.
Even though webcams are currently only scraped and predicted for Switzerland, it is planned that one Helios and one Voyager instance per country will be responsible for scraping and predicting. The following graphic visualizes the scaling.

![image](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/drawings/WebAppScalability.png)

## Machine Learning - Jupyter Notebooks
Transfer Learning is used to solve the classification problem of sunny and not sunny webcam images. Particulary Keras and Tensorflow with its pre-trained models from TensorHub were used to develop the image classifier model for SunSpotter.

* _Productive Code_ of Transfer-Learning with pretrained CNN-Model is in the file: [transferLearningCNNClassificationSunSpotter.ipynb](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/code/jupyterNotebook/transferLearningCNNClassificationSunSpotter.ipynb)
  * CNN model used from Tensorflow Hub" mobilenet_v3_small_075_224": "https://tfhub.dev/google/imagenet/mobilenet_v3_small_075_224/feature_vector/5",
  * Fully connected layer with two classes prediction "notSunny" and "sunny".
* _Used Just for experimentation_ the own CNN-Model with classifier in the file: [ownCNNClassificationSunSpotter.ipynb](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/code/jupyterNotebook/ownCNNClassificationSunSpotter.ipynb)
  
### Model
The latest model can be found here: [sunSpotter_keras_transferLearning_model_mobilenet_v3_small_075_224_20220111.h5](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/code/jupyterNotebook/sunSpotter_keras_transferLearning_model_mobilenet_v3_small_075_224_20220111.h5)

#### Data

Training _3162_ images belonging to 2 classes \
Validation _790_ images belonging to 2 classes \
Test _252_ images belonging to 2 classes

#### Summary of the Model
![image](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/drawings/ModellSummary.PNG)

#### Model Performance
The following list shows how the accurracy and the loss function developed over the epochs.
![image](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/drawings/TrainingOutputEvolutionOfAccurracyAndLoss.PNG)

The view of accurracy and loss visualizes as a graph:
![image](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/drawings/DiagrammOutputEvolutionOfAccurracyAndLoss.PNG)

The performance of the model was measured with a confusion matrix. The prediction was made with the test dataset. Most important metric for SunSpotter is the _precision for class sunny_!. This is because of we want to show the user, where to go to get some sun.


| ![image](https://github.com/ZHAW-WI-AFEII-Project-HS2021/afeII-hs2021-project-sunspotter/blob/main/drawings/ConfusionMatrixTestDataSet.PNG) |
| :--: |


## Collaboration and Getting Started

See the [README.md](https://github.com/Sunspotter-Project/sunspotter-dev) in the sunspotter-dev repository or contact one of us ㋡
