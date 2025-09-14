from fastapi import FastAPI, File, UploadFile
import cv2
from ml.car_detect import cut_car_box

app = FastAPI()

@app.post("/api/car-checks/{id}/photos")
def quality_check(file: File, data: dict):
    frame = cv2.imread(file)
    
    car_img = cut_car_box(frame)
    if car_img is None:
        return {"error": "No car detected"}
    
    