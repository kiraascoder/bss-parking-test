import * as React from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlertMessageProps {
  variant?: "default" | "destructive" | "success" | "warning";
  title?: string;
  description: string;
  className?: string;
}

const variantConfig = {
  default: {
    container: "border-border bg-background",
    icon: Info,
    iconColor: "text-foreground",
    titleColor: "text-foreground",
    descColor: "text-muted-foreground",
  },
  destructive: {
    container: "border-destructive/50 bg-destructive/10",
    icon: AlertCircle,
    iconColor: "text-destructive",
    titleColor: "text-destructive",
    descColor: "text-destructive/80",
  },
  success: {
    container: "border-green-500/50 bg-green-500/10",
    icon: CheckCircle2,
    iconColor: "text-green-600 dark:text-green-400",
    titleColor: "text-green-900 dark:text-green-100",
    descColor: "text-green-700 dark:text-green-200",
  },
  warning: {
    container: "border-yellow-500/50 bg-yellow-500/10",
    icon: AlertTriangle,
    iconColor: "text-yellow-600 dark:text-yellow-400",
    titleColor: "text-yellow-900 dark:text-yellow-100",
    descColor: "text-yellow-700 dark:text-yellow-200",
  },
};

export function AlertMessage({
  variant = "default",
  title,
  description,
  className,
}: AlertMessageProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        config.container,
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", config.iconColor)} />
        <div className="flex-1 space-y-1">
          {title && (
            <p className={cn("font-semibold text-sm", config.titleColor)}>
              {title}
            </p>
          )}
          <p className={cn("text-sm", title ? config.descColor : config.titleColor)}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
