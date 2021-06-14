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

# debug flags
downloadImage = 1
saveImage = 1

# create directory paths
project_folder = "ads-fs2021-project-sunspotter"
file_path = os.path.realpath(__file__)
idxOfProjectFolder = file_path.index(project_folder)
base_path = file_path[0:idxOfProjectFolder] + project_folder + "\\"
img_predicted_path = base_path + 'app\\sunspotter\\public\\images\\predicted\\'
db_path = base_path + "app\\sunspotter\\db\\"
tfmodel_path = base_path + "code\\jupyterNotebook\\"
modelname = 'res_net'

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
    con.execute("DROP TABLE prediction")
except:
    print("Table prediction doesn't exists.")
con.execute("CREATE TABLE prediction (ID integer, fkwebcam integer, result integer, imgurl text, modelname text, timestamp text)")
#con.commit()

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
        filename = datetime.strftime(webcamid + "-%Y-%m-%d_%H-00.jpg")
        full_filename = img_predicted_path + filename
        # save the file to local disk
        print("Write file: " + full_filename)
        if saveImage:
            f = open(full_filename,'wb')
            f.write(response.content)
            f.close()
        utcnowStr = datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f%z")
        # make a prediction
        # TODO
        prediction = randint(0, 1)

        # save the prediction to the database
        cur.execute("INSERT INTO prediction VALUES (?, ?, ?, ?, ?, ?)", (pkprediction, pkwebcam, prediction, filename, modelname, utcnowStr))
        pkprediction = pkprediction + 1
# save all database changes
con.commit()
con.close()