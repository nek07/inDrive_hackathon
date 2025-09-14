import time
import numpy as np
import cv2
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from ultralytics import YOLO
from django.http import FileResponse, Http404
import os
from django.conf import settings

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(BASE_DIR, 'cleanControl', 'models', 'best (3).pt')
model_path2 = os.path.join(BASE_DIR, 'cleanControl', 'models', 'damage_detection.pt')
classifier = YOLO(model_path)
damage_model = YOLO(model_path2)
DIRTY_DIR = os.path.join(settings.MEDIA_ROOT, "dirty_cars")
DAMAGE_DIR = os.path.join(settings.MEDIA_ROOT, "damage_cars")
os.makedirs(DIRTY_DIR, exist_ok=True)
os.makedirs(DAMAGE_DIR, exist_ok=True)

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

        # Чтение изображения
        np_img = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        h, w, _ = image.shape

        # Копия для аннотирования
        processed_image = image.copy()
        info = {}

        # ==== Грязь ====
        start_time = time.time()
        result = classifier(image)[0]
        inference_time = round(time.time() - start_time, 3)

        pred_class = int(result.probs.top1)
        confidence = float(result.probs.top1conf)
        pred_class_name = result.names[pred_class]

        top_classes = [
            {"class": result.names[int(idx)], "conf": float(conf)}
            for idx, conf in zip(result.probs.top5[:3], result.probs.top5conf[:3])
        ]

        info.update({
            "status": pred_class_name,
            "confidence": confidence,
            "top_classes": top_classes,
            "width": w,
            "height": h,
            "inference_time": inference_time
        })

        # Добавляем текст на изображение
        cv2.putText(
            processed_image,
            f"Грязь: {pred_class_name}",
            (10, 30),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2
        )

        if pred_class_name in ["dirty", "slightly_dirty", "super_dirty"]:
            filename = f"image{i}_{pred_class_name}.jpg"
            filepath = os.path.join(DIRTY_DIR, filename)
            cv2.imwrite(filepath, processed_image)
            info["url"] = request.build_absolute_uri(settings.MEDIA_URL + f"dirty_cars/{filename}")

        # ==== Повреждения ====
        damage_results = damage_model(image)[0]
        damage_info = []
        for box in damage_results.boxes:
            cls_id = int(box.cls[0])
            cls_name = damage_results.names[cls_id]
            conf = float(box.conf[0])
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            
            # Рисуем рамку и подпись на processed_image
            cv2.rectangle(processed_image, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cv2.putText(
                processed_image,
                f"{cls_name} {conf:.2f}",
                (x1, y1 - 5),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 0, 255),
                1
            )

            damage_info.append({
                "class": cls_name,
                "confidence": conf,
                "bbox": [x1, y1, x2, y2]
            })

        if damage_info:
            filename = f"image{i}_damage.jpg"
            filepath = os.path.join(DAMAGE_DIR, filename)
            cv2.imwrite(filepath, processed_image)
            info["damage_url"] = request.build_absolute_uri(settings.MEDIA_URL + f"damage_cars/{filename}")
            info["damage"] = damage_info

        # ==== Текстовое описание ====
        text_summary = f"Грязь: {pred_class_name}"
        if damage_info:
            damage_list = ", ".join([d["class"] for d in damage_info])
            text_summary += f"; Повреждения: {damage_list}"
        info["summary"] = text_summary

        response[f"image{i}"] = info

    return JsonResponse(response)



def damage_image_view(request, filename):
    filepath = os.path.join(DAMAGE_DIR, filename)
    if not os.path.exists(filepath):
        raise Http404("Файл не найден")
    
    return FileResponse(open(filepath, "rb"), content_type="image/jpeg")