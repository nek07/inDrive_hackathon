from ultralytics import YOLO
import cv2
import time

model = YOLO("ml/models/yolo11n.pt") 

device = "cuda:0" if cv2.cuda.getCudaEnabledDeviceCount() > 0 else "cpu"
use_half = True 
print("Используется устройство:", device)

car_ids = [i for i,name in model.names.items() if name.lower() == "car"]
if len(car_ids) == 0:
    raise RuntimeError("Класс 'car' не найден в model.names")
car_id = car_ids[0]

imgsz = 640           #320/416/640
conf_thres = 0.65 
iou_thres = 0.45     
max_det = 300


def cut_car_box(frame):
    """Возвращает вырезанную машину из кадра или None, если машины нет"""
    start = time.time()
    results = model.predict(
        source=frame,
        imgsz=imgsz,
        device=device,
        half=use_half,
        conf=conf_thres,
        iou=iou_thres,
        max_det=max_det,
        classes=[car_id],
        verbose=False
    )

    if results[0].boxes is None or len(results[0].boxes) == 0:
        return None  

    boxes = results[0].boxes.xyxy.cpu().numpy()
    confs = results[0].boxes.conf.cpu().numpy()


    areas = (boxes[:, 2] - boxes[:, 0]) * (boxes[:, 3] - boxes[:, 1])
    max_idx = areas.argmax()
    x1, y1, x2, y2 = map(int, boxes[max_idx])

    car_img = frame[y1:y2, x1:x2].copy()

    dt = time.time() - start
    print("Время работы Car Detection -", dt)

    return car_img

