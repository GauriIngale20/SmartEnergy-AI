import { useEffect, useState } from "react";

export default function AnimatedCounter({
value = 0,
duration = 900,
prefix = "",
suffix = "",
decimals = 0
}) {
const target = Number(value);
const safeTarget = Number.isFinite(target) ? target : 0;
const [displayValue, setDisplayValue] = useState(0);

useEffect(() => {
let animationFrame;
let startTime;

```
const startValue = 0;
const endValue = safeTarget;
const totalDuration = Math.max(0, Number(duration) || 0);

if (totalDuration === 0) {
  setDisplayValue(endValue);
  return undefined;
}

function animate(timestamp) {
  if (startTime === undefined) startTime = timestamp;

  const progress = Math.min(
    (timestamp - startTime) / totalDuration,
    1
  );

  const easedProgress = 1 - Math.pow(1 - progress, 3);
  const currentValue =
    startValue + (endValue - startValue) * easedProgress;

  setDisplayValue(currentValue);

  if (progress < 1) {
    animationFrame = requestAnimationFrame(animate);
  }
}

animationFrame = requestAnimationFrame(animate);

return () => cancelAnimationFrame(animationFrame);
```

}, [safeTarget, duration]);

return ( <span>
{prefix}
{displayValue.toLocaleString("en-IN", {
minimumFractionDigits: decimals,
maximumFractionDigits: decimals
})}
{suffix} </span>
);
}
