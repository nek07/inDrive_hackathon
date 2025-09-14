import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Detection {
  id: string;
  type: string;
  severity: string;
  imageUrl: string;
  description: string;
}

interface DetectionGalleryProps {
  detections: Detection[];
  title: string;
}

export function DetectionGallery({ detections, title }: DetectionGalleryProps) {
  if (detections.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">{title}</h3>
        <div className="flex items-center justify-center h-32 bg-muted rounded-lg border border-dashed border-border">
          <p className="text-muted-foreground">Проблем не обнаружено</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-foreground">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {detections.map((detection) => (
          <div key={detection.id} className="group relative">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted border border-border hover:border-primary transition-colors">
              <ImageWithFallback
                src={detection.imageUrl}
                alt={`${detection.type} - ${detection.severity}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium text-foreground">{detection.type}</p>
              <p className="text-xs text-muted-foreground">{detection.description}</p>
            </div>
            
            {/* Severity indicator */}
            <div className="absolute top-2 right-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                <span className="text-xs font-medium text-foreground">{detection.severity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}