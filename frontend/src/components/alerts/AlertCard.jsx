import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

const alertConfig = {
warning: {
icon: AlertTriangle,
className: "warning",
label: "Warning"
},
success: {
icon: CheckCircle,
className: "success",
label: "Success"
},
info: {
icon: Info,
className: "info",
label: "Information"
},
danger: {
icon: XCircle,
className: "danger",
label: "Critical"
}
};

export default function AlertCard({
title = "Energy Alert",
message = "Review your recent energy consumption.",
type = "info",
date = "",
onDismiss
}) {
const config = alertConfig[type] || alertConfig.info;
const Icon = config.icon;

return (
<article className={`alert-card alert-${config.className}`}> <div className="alert-icon"> <Icon size={21} /> </div>

```
  <div className="alert-content">
    <div className="alert-title-row">
      <strong>{title}</strong>
      <span className={`alert-badge ${config.className}`}>
        {config.label}
      </span>
    </div>

    <p>{message}</p>

    {date && <small>{date}</small>}
  </div>

  {onDismiss && (
    <button
      type="button"
      className="icon-button"
      onClick={onDismiss}
      aria-label={`Dismiss ${title}`}
    >
      ×
    </button>
  )}
</article>
```

);
}
