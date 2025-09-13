import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Upload, CheckCircle, Car, AlertCircle, ArrowLeft } from "lucide-react";

export default function App() {
  const [step, setStep] = useState("start");
  const [photo, setPhoto] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50 p-6">
      <Card className="w-full max-w-md shadow-2xl rounded-3xl border border-gray-200">
        <CardContent className="flex flex-col items-center p-8 space-y-8">
          {/* Навбар */}
          {step !== "start" && (
            <div className="absolute top-4 left-4">
              <Button
                variant="outline"
                className="flex items-center gap-2 text-sm px-3 py-1 rounded-lg"
                onClick={() => setStep("start")}
              >
                <ArrowLeft size={16} /> Назад
              </Button>
            </div>
          )}

          {/* 1. START */}
          {step === "start" && (
            <>
              <Car className="text-green-600 w-16 h-16" />
              <h1 className="text-3xl font-extrabold text-center text-gray-900">
                Проверка автомобиля
              </h1>
              <p className="text-gray-600 text-center max-w-xs">
                Загрузите фото вашего авто и получите быстрый анализ его
                состояния.
              </p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-3 rounded-xl"
                onClick={() => setStep("upload")}
              >
                🚗 Начать проверку
              </Button>
            </>
          )}

          {/* 2. UPLOAD */}
          {step === "upload" && (
            <>
              <Upload className="text-green-600 w-14 h-14" />
              <h1 className="text-2xl font-bold text-gray-900">Загрузите фото</h1>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 p-3 rounded-xl cursor-pointer text-gray-600"
              />
              {photo && (
                <div className="w-full">
                  <img
                    src={photo}
                    alt="preview"
                    className="w-full rounded-xl border mt-3 shadow-md"
                  />
                </div>
              )}
              <Button
                className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl"
                onClick={() => setStep("confirm")}
              >
                📤 Отправить
              </Button>
            </>
          )}

          {/* 3. CONFIRM */}
          {step === "confirm" && (
            <>
              <CheckCircle className="text-green-600 w-14 h-14" />
              <h1 className="text-2xl font-bold text-gray-900">
                Подтвердите проверку
              </h1>
              <p className="text-gray-600 text-center max-w-sm">
                Наш алгоритм проанализирует фото и определит уровень чистоты и
                возможные повреждения.
              </p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl"
                onClick={() => setStep("result")}
              >
                ✅ Подтвердить
              </Button>
            </>
          )}

          {/* 4. RESULT */}
          {step === "result" && (
            <>
              <h1 className="text-2xl font-extrabold text-gray-900">
                Результаты анализа
              </h1>
              {photo && (
                <img
                  src={photo}
                  alt="car"
                  className="w-full rounded-xl border mb-3 shadow-md"
                />
              )}
              <div className="bg-gray-100 w-full p-5 rounded-xl text-left space-y-3">
                <p>
                  Чистота:{" "}
                  <span className="font-semibold text-green-700">
                    Dirty (3/5)
                  </span>
                </p>
                <p>
                  Повреждения:{" "}
                  <span className="font-semibold text-red-600">
                    Scratched (2/5)
                  </span>
                </p>
              </div>
              <Button
                className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl"
                onClick={() => setStep("appeal")}
              >
                ⚠️ Оспорить результат
              </Button>
            </>
          )}

          {/* 5. APPEAL */}
          {step === "appeal" && (
            <>
              <AlertCircle className="text-yellow-600 w-14 h-14" />
              <h1 className="text-2xl font-bold text-gray-900">
                Оспорить результат
              </h1>
              <textarea
                placeholder="Напишите причину..."
                className="w-full border border-gray-300 rounded-xl p-3 h-24 resize-none focus:ring-2 focus:ring-green-500"
              />
              <Button
                className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl"
                onClick={() => setStep("pending")}
              >
                📩 Отправить апелляцию
              </Button>
            </>
          )}

          {/* 6. PENDING */}
          {step === "pending" && (
            <>
              <h1 className="text-2xl font-extrabold text-gray-900">
                ⏳ Ожидание проверки
              </h1>
              <p className="text-gray-600 text-center max-w-sm">
                Ваша апелляция отправлена. Оператор свяжется с вами в ближайшее
                время.
              </p>
              <Button
                variant="outline"
                className="w-full py-3 rounded-xl border border-gray-400"
                onClick={() => setStep("start")}
              >
                🔙 На главную
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
