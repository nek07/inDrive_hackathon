import time
import numpy as np
import cv2
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from ultralytics import YOLO

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(BASE_DIR, 'cleanControl', 'models', 'best (3).pt')
classifier = YOLO(model_path)

DIRTY_DIR = os.path.join(settings.MEDIA_ROOT, "dirty_cars")
os.makedirs(DIRTY_DIR, exist_ok=True)

@csrf_exempt
def check_cars(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    response = {}
    for i in range(1, 5):
        file = request.FILES.get(f"image{i}")
        if not file:
            response[f"image{i}"] = {"error": "No file uploaded"}
            continue

        np_img = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        h, w, _ = image.shape

        start_time = time.time()
        result = classifier(image)[0]
        inference_time = round(time.time() - start_time, 3)

        pred_class = int(result.probs.top1)
        confidence = float(result.probs.top1conf)
        pred_class_name = result.names[pred_class]

        # топ-3 классов
        top_classes = [
            {"class": result.names[int(idx)], "conf": float(conf)}
            for idx, conf in zip(result.probs.top5[:3], result.probs.top5conf[:3])
        ]


        info = {
            "status": pred_class_name,
            "confidence": confidence,
            "top_classes": top_classes,
            "width": w,
            "height": h,
            "inference_time": inference_time
        }

        if pred_class_name in ["dirty", "slightly_dirty", "super_dirty"]:
            filename = f"image{i}_{pred_class_name}.jpg"
            filepath = os.path.join(DIRTY_DIR, filename)
            cv2.imwrite(filepath, image)
            info["url"] = request.build_absolute_uri(settings.MEDIA_URL + f"dirty_cars/{filename}")

        response[f"image{i}"] = info

    return JsonResponse(response)
