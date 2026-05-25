"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared";
import { Badge } from "@/shared/ui/badge";

interface ActivityItem {
  tipo_actividad: string;
  fecha_actividad: string;
  categoria: string;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-muted-foreground">No hay actividades recientes.</p>
          ) : (
            activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {activity.categoria === "ALERT" ? (
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      !
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      i
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.tipo_actividad}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.fecha_actividad).toLocaleString()}
                  </p>
                </div>
                <Badge variant={activity.categoria === "ALERT" ? "destructive" : "secondary"}>
                  {activity.categoria}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}