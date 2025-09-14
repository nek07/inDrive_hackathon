// src/pages/AnalysisResults.jsx

import { ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import { ScaleIndicator } from '../components/ScaleIndicator';
import { DetectionGallery } from '../components/DetectionGallery';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

// Mock data
const analysisResults = {
  cleanliness: { score: 3.2, description: "Сильно загрязнен - видны следы грязи и пыли" },
  integrity: { score: 2.1, description: "Незначительные повреждения - мелкие царапины" }
};

const cleanlinessDetections = [
  { id: '1', type: 'Грязь', severity: 'Сильная', imageUrl: 'https://images.unsplash.com/photo-1704906654369-091b259fc086?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', description: 'Бампер и капот' },
  { id: '2', type: 'Пыль', severity: 'Средняя', imageUrl: 'https://images.unsplash.com/photo-1704906654369-091b259fc086?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', description: 'Боковые панели' }
];

const integrityDetections = [
  { id: '3', type: 'Царапина', severity: 'Легкая', imageUrl: 'https://images.unsplash.com/photo-1725199984598-20faa3755843?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', description: 'Передняя дверь' }
];

export default function AnalysisResults() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1>Результаты анализа автомобиля</h1>
            <p className="text-muted-foreground">
              Автоматическая оценка технического состояния по фотографиям
            </p>
          </div>
        </div>

        {/* Analysis Results */}
        <Card className="p-6">
          <div className="space-y-8">
            <div>
              <h2 className="mb-6">Оценка состояния</h2>
              <div className="grid gap-8 md:grid-cols-2">
                <ScaleIndicator
                  title="Чистота"
                  value={analysisResults.cleanliness.score}
                  description={analysisResults.cleanliness.description}
                />
                <ScaleIndicator
                  title="Целостность"
                  value={analysisResults.integrity.score}
                  description={analysisResults.integrity.description}
                />
              </div>
            </div>

            <Separator />

            {/* Detected Issues */}
            <div className="space-y-8">
              <DetectionGallery title="Обнаруженные загрязнения" detections={cleanlinessDetections} />
              <DetectionGallery title="Обнаруженные повреждения" detections={integrityDetections} />
            </div>
          </div>
        </Card>

        {/* Summary Card */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-2">Сводка анализа</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Автомобиль требует очистки и незначительного ремонта. 
                Обнаружены следы сильного загрязнения и мелкие повреждения лакокрасочного покрытия.
              </p>
              <div className="flex gap-2 text-sm">
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">Требует внимания</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">Пригоден к эксплуатации</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <Button variant="destructive" className="flex-1 sm:flex-none">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Оспорить
          </Button>
          <Button className="flex-1 sm:flex-none">
            <Check className="w-4 h-4 mr-2" />
            Подтвердить
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Анализ проведен с использованием AI-технологий</p>
          <p>Время обработки: 1.2 сек • Точность: 94%</p>
        </div>
      </div>
    </div>
  );
}
