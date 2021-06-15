import json
import requests
import sqlite3
import os 
from os import listdir
from datetime import datetime
from datetime import timedelta
from random import *

# data science tools
import tensorflow as tf
import numpy as np
import time
import PIL.Image as Image
import tensorflow_hub as hub
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.models import Sequential

# debug flags
downloadImage = 1
saveImage = 1

# set current working directory to the script directory
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)

# create directory paths
base_path = os.path.join(os.curdir, "..")
print("Base path: " + base_path)
img_predicted_path = os.path.join(base_path, "public", "images", "predicted")
print("Image predicted path: " + img_predicted_path)
db_path = os.path.join(base_path, "db")
print("DB path: " + db_path)
tfmodel_path = os.path.join(base_path, "tf", "models")
print("Tensorflow model path: " + tfmodel_path)
modelname = 'res_net'

# delete all predicted imagesn
for file_name in listdir(img_predicted_path):
    if file_name.endswith('.jpg'):
        os.remove(os.path.join(img_predicted_path, file_name))

# load tensorflow model
pixels = 224
IMAGE_SIZE = (pixels, pixels)
pretrained_model_path = os.path.join(tfmodel_path, "sunSpotter_keras_transferLearning_model_mobilenet_v2_140_224.h5")
model = keras.models.load_model(pretrained_model_path, custom_objects={'KerasLayer':hub.KerasLayer})

dbfile = os.path.join(db_path, "webcam.db")
print("DB file: " + dbfile)
con = sqlite3.connect(dbfile)

datetime = datetime.now() - timedelta(minutes=15)
urlTemplate = datetime.strftime("https://www.foto-webcam.eu/webcam/{0}/%Y/%m/%d/%H00_la.jpg");

cur = con.cursor()
# delete and create prediction table
try:
    con.execute("DROP TABLE prediction")
except:
    print("Table prediction doesn't exists.")
con.execute("CREATE TABLE prediction (ID integer, fkwebcam integer, result integer, confidence real, imgurl text, modelname text, timestamp text)")

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
        try:
            response = requests.get(downloadurl)
            status_code = response.status_code
        except:
            print("Failed to download image from: " + downloadurl)
            status_code = 404
    else:
        status_code = 200
    if status_code == 200:
        filename = datetime.strftime(webcamid + "-%Y-%m-%d_%H-00.jpg")
        full_filename = os.path.join(img_predicted_path, filename)
        # save the file to local disk
        print("Write file: " + full_filename)
        if saveImage:
            f = open(full_filename,'wb')
            f.write(response.content)
            f.close()
        utcnowStr = datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f%z")
        
        # make a prediction for the image
        img = keras.preprocessing.image.load_img(full_filename, target_size=(IMAGE_SIZE))
        img_array = keras.preprocessing.image.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0) # Create a batch
        predictions = model.predict(img_array)
        score = tf.nn.softmax(predictions[0])
        prediction = int(np.argmax(score))
        confidence = float(np.max(score))
        print(score)
        print("This image most likely belongs to {} with a {:.2f} percent confidence.".format(np.argmax(score), 100 * np.max(score)))
        print("This image most unlikely belongs to {} with a {:.2f} percent confidence.".format(np.argmin(score), 100 * np.min(score)))

        # save the prediction to the database
        cur.execute("INSERT INTO prediction VALUES (?, ?, ?, ?, ?, ?, ?)", (pkprediction, pkwebcam, prediction, confidence, filename, modelname, utcnowStr))
        pkprediction = pkprediction + 1
# save all database changes
con.commit()
con.close()
print(str(pkprediction) + " predictions were made")