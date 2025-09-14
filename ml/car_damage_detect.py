from ultralytics import YOLO
import cv2
import time

model = YOLO("ml\models\car_damage_50.pt") 

imgsz = 640           #320/416/640
conf_thres = 0.3
iou_thres = 0.45     
max_det = 300

device = "cuda:0" if cv2.cuda.getCudaEnabledDeviceCount() > 0 else "cpu"
use_half = True
print("Используется устройство:", device)

def car_damage_check(car_img):
    start = time.time()
    results = model.predict(
        source=car_img,
        imgsz=imgsz,
        device=device,
        half=use_half,
        conf=conf_thres,
        iou=iou_thres,
        max_det=max_det,
        verbose=False
    )

    if results[0].boxes is None or len(results[0].boxes) == 0:
        return False  

    for cls in results[0].boxes.cls.cpu().numpy():
        if model.names[int(cls)].lower() != "car":
            dt = time.time() - start
            print("Время работы Car Damage Detection -", dt)
            return True  

    dt = time.time() - start
    print("Время работы Car Damage Detection -", dt)
    return False
