import { useState } from "react";
import { PhotoUploadCard } from "./components/PhotoUploadCard";
import { Button } from "./components/ui/button";
import {  Upload } from "lucide-react";

interface PhotoData {
  id: string;
  title: string;
  image: string | null;
}

const initialPhotos: PhotoData[] = [
  { id: "front", title: "Фото спереди", image: null },
  { id: "back", title: "Фото сзади", image: null },
  { id: "left", title: "Фото слева", image: null },
  { id: "right", title: "Фото справа", image: null },
  { id: "interior", title: "Салон", image: null },
  { id: "dashboard", title: "Приборная панель", image: null },
  { id: "trunk", title: "Багажник", image: null },
  { id: "engine", title: "Двигатель", image: null },
];

export default function App() {
  const [photos, setPhotos] = useState<PhotoData[]>(initialPhotos);

  const handleImageSelect = (photoId: string, file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === photoId 
          ? { ...photo, image: imageUrl }
          : photo
      )
    );
  };

  const handleSubmit = () => {
    const uploadedPhotos = photos.filter(photo => photo.image !== null);
    console.log("Прикрепленные фото:", uploadedPhotos);
    // Здесь можно добавить логику отправки фото на сервер
    alert(`Прикреплено ${uploadedPhotos.length} из ${photos.length} фотографий`);
  };

  const uploadedCount = photos.filter(photo => photo.image !== null).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-md mx-auto sm:max-w-6xl sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Заголовок */}
        <div className="mb-6 sm:mb-10 px-4 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Прикрепление документов
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Загрузите фотографии автомобиля для проверки технического состояния
          </p>
        </div>

        {/* Сетка фотографий */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 px-4">
          {photos.map((photo) => (
            <PhotoUploadCard
              key={photo.id}
              title={photo.title}
              image={photo.image}
              onImageSelect={(file) => handleImageSelect(photo.id, file)}
            />
          ))}
        </div>

        {/* Кнопка прикрепить */}
        <div className="px-4">
          <Button 
            onClick={handleSubmit}
            disabled={uploadedCount === 0}
            className={`
              w-full py-4 rounded-xl font-semibold transition-all duration-300 ease-in-out shadow-lg
              ${uploadedCount === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-[#32CD32] hover:bg-[#28a428] text-white hover:shadow-xl hover:shadow-[#32CD32]/25 hover:scale-[1.02]'
              }
            `}
          >
            <Upload className="w-5 h-5 mr-2" />
            Прикрепить
          </Button>
          
          {uploadedCount === 0 ? (
            <p className="text-sm text-gray-500 mt-4 text-center">
              Выберите хотя бы одну фотографию для продолжения
            </p>
          ) : (
            <p className="text-sm text-gray-600 mt-4 text-center">
              {uploadedCount < photos.length 
                ? `Загружено ${uploadedCount} из ${photos.length} фотографий`
                : 'Все фотографии загружены!'
              }
            </p>
          )}
        </div>
      </div>
    </div>
  );
}