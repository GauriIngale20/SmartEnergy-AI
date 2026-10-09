import { BellRing } from "lucide-react";

export default function NotificationToggle({
title = "Energy Notifications",
description = "Receive alerts about unusual energy usage.",
enabled = true,
onChange
}) {
return ( <div className="notification-toggle"> <div className="notification-toggle-icon"> <BellRing size={20} /> </div>

```
  <div className="notification-toggle-text">
    <strong>{title}</strong>
    <p>{description}</p>
  </div>

  <label className="switch">
    <input
      type="checkbox"
      checked={enabled}
      onChange={(event) => onChange?.(event.target.checked)}
      aria-label={title}
    />
    <span className="switch-slider" />
  </label>
</div>
```

);
}
