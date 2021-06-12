import json
import requests
import sqlite3
import os 
from os import listdir
from datetime import datetime
from datetime import timedelta
from random import *

#from tensorflow import keras
#from tensorflow.keras import layers
#from tensorflow.keras.models import Sequential
#import tensorflow_hub as hub

downloadImage = 0
saveImage = 0

# create directory paths
project_folder = "ads-fs2021-project-sunspotter"
file_path = os.path.realpath(__file__)
idxOfProjectFolder = file_path.index(project_folder)
base_path = file_path[0:idxOfProjectFolder] + project_folder + "\\"
img_predicted_path = base_path + 'app\\sunspotter\\public\\images\\predicted\\'
db_path = base_path + "app\\sunspotter\\db\\"
tfmodel_path = base_path + "code\\jupyterNotebook\\"

# delete all predicted imagesn
for file_name in listdir(img_predicted_path):
    if file_name.endswith('.jpg'):
        os.remove(img_predicted_path + file_name)

#model = keras.models.load_model(tfmodel_path + "sunSpotter_keras_transferLearning_model.h5",custom_objects={'KerasLayer':hub.KerasLayer})
con = sqlite3.connect(db_path + 'webcam.db')

datetime = datetime.now() - timedelta(minutes=15)
urlTemplate = datetime.strftime("https://www.foto-webcam.eu/webcam/{0}/%Y/%m/%d/%H00_la.jpg");

cur = con.cursor()
# delete and create prediction table
try:
    cur.execute("DROP TABLE prediction")
except:
    print("Table prediction doesn't exists.")
cur.execute("CREATE TABLE prediction(ID integer NOT NULL PRIMARY KEY, fkwebcam integer, result number, imgurl text, timestamp text)")
con.commit()

pkprediction = 0
# loop over all webcams and download the image from the actual hour (e.g: 12:00)
webcamrows = cur.execute('SELECT ID, webcamid FROM webcam')
for webcamrow in webcamrows.fetchall():
    pkwebcam = webcamrow[0]
    webcamid = webcamrow[1]
    # download the image
    downloadurl = urlTemplate.format(webcamid)
    print("Download: " + downloadurl)
    if downloadImage:
        response = requests.get(downloadurl)
        status_code = response.status_code
    else:
        status_code = 200
    if status_code == 200:
        filename = webcamid + "-%Y-%m-%d_%H-00.jpg"
        filename = img_predicted_path + datetime.strftime(filename)
        # save the file to local disk
        print("Write file: " + filename)
        if saveImage:
            f = open(filename,'wb')
            f.write(response.content)
            f.close()
        utcnowStr = datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f%z")
        # make a prediction
        # TODO
        prediction = randint(0, 1)

        # save the prediction to the database
        cur.execute("INSERT INTO prediction values (?, ?, ?, ?, ?)", (pkprediction, pkwebcam, prediction, filename, utcnowStr))
        pkprediction = pkprediction + 1
con.commit()
con.close()