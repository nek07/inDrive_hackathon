// pages/UploadPage.tsx
import { useState } from "react";
import { PhotoUploadCard } from "../components/PhotoUploadCard";
import { Button } from "../components/ui/button";
import { Upload } from "lucide-react";

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
    //   { id: "interior", title: "Салон", image: null },
    //   { id: "dashboard", title: "Приборная панель", image: null },
    //   { id: "trunk", title: "Багажник", image: null },
    //   { id: "engine", title: "Двигатель", image: null },
];

export default function UploadPage() {
    const [photos, setPhotos] = useState<PhotoData[]>(initialPhotos);
    const uploadedCount = photos.filter(photo => photo.image !== null).length;

    const handleImageSelect = (photoId: string, file: File) => {
        const imageUrl = URL.createObjectURL(file);
        setPhotos(prev =>
            prev.map(photo =>
                photo.id === photoId ? { ...photo, image: imageUrl } : photo
            )
        );
    };

    const handleSubmit = async () => {
        // берем только фото, где image не null
        const uploadedPhotos = photos.filter(photo => photo.image !== null);

        if (uploadedPhotos.length === 0) {
            alert("Выберите хотя бы одно фото!");
            return;
        }

        const formData = new FormData();

        for (const photo of uploadedPhotos) {
            if (photo.image) {  // проверка на null
                const res = await fetch(photo.image);
                const blob = await res.blob();
                const file = new File([blob], `${photo.id}.jpg`, { type: "image/jpeg" });
                formData.append("photos", file);
            }
        }

        try {
            const response = await fetch("/car-check/", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log("Ответ с сервера:", data);
            alert("Фотографии отправлены, смотрите консоль для ответа");
        } catch (err) {
            console.error(err);
            alert("Ошибка при отправке фото");
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-md mx-auto sm:max-w-6xl sm:px-6 lg:px-8 py-6 sm:py-12">
                <h1 className="text-3xl font-semibold text-gray-900 mb-4 text-center">
                    Прикрепление документов
                </h1>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {photos.map(photo => (
                        <PhotoUploadCard
                            key={photo.id}
                            title={photo.title}
                            image={photo.image}
                            onImageSelect={(file) => handleImageSelect(photo.id, file)}
                        />
                    ))}
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={uploadedCount === 0}
                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${uploadedCount === 0
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#32CD32] hover:bg-[#28a428] text-white"
                        }`}
                >
                    <Upload className="w-5 h-5 mr-2" />
                    Прикрепить
                </Button>
            </div>
        </div>
    );
}
