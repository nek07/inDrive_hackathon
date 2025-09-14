// pages/ResultsPage.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Eye, ArrowLeft, Target, Clock, Image, Zap } from "lucide-react";
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

// Функции для цветов, иконок и перевода статусов
const getStatusColor = (status: string) => {
    switch (status) {
        case 'clean':
        case 'super clean':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case 'slightly dirty':
            return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'dirty':
            return 'bg-orange-50 text-orange-700 border-orange-200';
        case 'super dirty':
            return 'bg-red-50 text-red-700 border-red-200';
        default:
            return 'bg-slate-50 text-slate-700 border-slate-200';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'clean':
        case 'super clean':
            return CheckCircle;
        case 'slightly dirty':
        case 'dirty':
        case 'super dirty':
            return AlertCircle;
        default:
            return Eye;
    }
};

const translateStatus = (status: string) => {
    const translations: { [key: string]: string } = {
        'clean': 'Чистый',
        'super clean': 'Очень чистый',
        'slightly dirty': 'Слегка грязный',
        'dirty': 'Грязный',
        'super dirty': 'Очень грязный'
    };
    return translations[status] || status;
};

interface DamageInfo {
    class: string;
    confidence: number;
    bbox: number[];
}

interface ImageResult {
    status: string;
    confidence: number;
    top_classes: { class: string; conf: number }[];
    width: number;
    height: number;
    inference_time: number;
    url?: string;
    damage_url?: string;
    damage?: DamageInfo[];
    summary: string;
}

export default function ResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const results: Record<string, ImageResult> = location.state || {};

    const images = Object.entries(results);
    const totalImages = images.length;
    const averageInferenceTime = images.length
        ? images.reduce((acc, [_, data]) => acc + data.inference_time, 0) / totalImages
        : 0;
    const averageConfidence = images.length
        ? images.reduce((acc, [_, data]) => acc + data.confidence, 0) / totalImages
        : 0;
    const totalDamages = images.reduce((acc, [_, data]) => acc + (data.damage?.length || 0), 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="hover:bg-slate-100 rounded-xl p-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-semibold text-slate-900 mb-1">
                            Анализ автомобилей
                        </h1>
                        <p className="text-slate-600 font-medium">
                            AI-анализ завершён • {totalImages} изображений обработано
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-6 border-0 shadow-sm bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Target className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-600">Точность</p>
                                <p className="text-2xl font-bold text-slate-900">{(averageConfidence * 100).toFixed(1)}%</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-0 shadow-sm bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Zap className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-600">Время</p>
                                <p className="text-2xl font-bold text-slate-900">{averageInferenceTime.toFixed(2)}с</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-0 shadow-sm bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <Image className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-600">Изображений</p>
                                <p className="text-2xl font-bold text-slate-900">{totalImages}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-0 shadow-sm bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-600">Повреждений</p>
                                <p className="text-2xl font-bold text-slate-900">{totalDamages}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Results Grid */}
                <div className="space-y-6">
                    {images.map(([key, data]) => {
                        const StatusIcon = getStatusIcon(data.status);
                        return (
                            <Card
                                key={key}
                                className="overflow-hidden border-0 shadow-sm bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="p-8 space-y-6">
                                    {/* Card Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                                                <StatusIcon className="w-6 h-6 text-slate-700" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                                </h3>
                                                <p className="text-sm text-slate-500 font-medium">
                                                    {data.width} × {data.height}px • {(data.inference_time * 1000).toFixed(0)}ms
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className={`${getStatusColor(data.status)} px-4 py-2 text-sm font-medium border rounded-xl`}>
                                            {translateStatus(data.status)}
                                        </Badge>
                                    </div>

                                    {/* Images Section */}
                                    <div className="grid gap-6 lg:grid-cols-2">
                                        {/* {data.url && (
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                                    Исходное изображение
                                                </h4>
                                                <div className="relative group">
                                                    <img
                                                        src={data.url}
                                                        alt={key}
                                                        className="w-full h-56 object-cover rounded-2xl shadow-sm group-hover:shadow-md transition-shadow"
                                                    />
                                                    <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/5 transition-colors" />
                                                </div>
                                            </div>
                                        )} */}
                                        {data.damage_url && (
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                                    Обнаруженные повреждения
                                                </h4>
                                                <div className="relative group">
                                                    <img
                                                        src={data.damage_url}
                                                        alt={`${key} damage`}
                                                        className="w-full h-56 object-cover rounded-2xl shadow-sm border border-red-200 group-hover:shadow-md transition-shadow"
                                                    />
                                                    <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/5 transition-colors" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Analysis Summary */}
                                    <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-slate-700">Результат анализа</span>
                                            <span className="text-sm font-bold text-blue-600">
                                                {(data.confidence * 100).toFixed(1)}% уверенности
                                            </span>
                                        </div>

                                        {data.damage && data.damage.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4 text-amber-600" />
                                                <span className="text-sm font-medium text-slate-700">
                                                    Найдено повреждений: {data.damage.length}
                                                </span>
                                            </div>
                                        )}

                                        <p className="text-slate-700 font-medium leading-relaxed">
                                            {data.summary}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Bottom Action */}
                <div className="flex justify-center pt-8 gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/")}
                        className="px-8 py-3 rounded-xl font-medium border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                        Вернуться к загрузке
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => alert("Запрос на оспаривание отправлен")} // Здесь можно заменить на нужный роут или функцию
                        className="px-8 py-3 rounded-xl font-medium border-red-400 text-red-600 hover:bg-red-50 transition-colors"
                    >
                        Оспорить
                    </Button>
                </div>

            </div>
        </div>
    );
}