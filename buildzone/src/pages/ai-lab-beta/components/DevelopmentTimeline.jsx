import React from 'react';
import { Calendar, CheckCircle2, Circle, Clock } from 'lucide-react';

const DevelopmentTimeline = ({ agents }) => {
  const getTimelineData = () => {
    return agents?.map?.((agent) => ({
      id: agent?.id,
      name: agent?.name,
      quarter: agent?.estimatedLaunch,
      progress: agent?.progress,
      status: agent?.status,
      icon: agent?.icon
    }))?.sort?.((a, b) => {
      const quarterOrder = { 'Q2 2025': 1, 'Q3 2025': 2, 'Q4 2025': 3 };
      return quarterOrder?.[a?.quarter] - quarterOrder?.[b?.quarter];
    }) ?? [];
  };

  const timelineData = getTimelineData();

  const getStatusIcon = (progress, status) => {
    if (progress === 100) {
      return <CheckCircle2 className="w-5 h-5 text-success" />;
    } else if (progress > 50) {
      return <Clock className="w-5 h-5 text-primary" />;
    } else {
      return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-success';
    if (progress >= 50) return 'bg-primary';
    if (progress >= 25) return 'bg-warning';
    return 'bg-muted-foreground';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Development Timeline</h2>
      </div>

      <div className="space-y-4">
        {timelineData?.map?.((item, index) => {
          const IconComponent = item?.icon;
          const isLast = index === timelineData?.length - 1;

          return (
            <div key={item?.id} className="relative">
              {/* Timeline Line */}
              {!isLast && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border" />
              )}

              {/* Timeline Item */}
              <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-soft transition-shadow">
                {/* Status Icon */}
                <div className="flex-shrink-0 relative">
                  <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center">
                    {getStatusIcon(item?.progress, item?.status)}
                  </div>
                  {/* Progress Ring */}
                  <svg
                    className="absolute -inset-1 w-14 h-14 transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-muted stroke-current"
                      strokeWidth="2"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`${getProgressColor(item?.progress)} stroke-current`}
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="transparent"
                      strokeDasharray={`${item?.progress}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-foreground">{item?.name}</h3>
                    <span className="text-sm text-primary font-medium">{item?.quarter}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">AI Agent</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item?.progress}% Complete
                    </div>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${getProgressColor(item?.progress)}`}
                      style={{ width: `${item?.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        }) ?? null}
      </div>

      {/* Timeline Legend */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="text-muted-foreground">Released</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">In Development</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Planned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-primary rounded-full" />
            <span className="text-muted-foreground">Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentTimeline;