import { ArrowRight, Leaf, Sparkles, Zap } from "lucide-react";

export default function EnergyHero({
name = "Smart Energy",
subtitle = "Understand your usage. Discover smarter ways to save.",
onExplore
}) {
return ( <section className="energy-hero"> <div className="energy-hero-content"> <span className="hero-label"> <Sparkles size={15} /> SMARTER ENERGY STARTS HERE </span>

```
    <h1>
      Welcome to <span>{name}</span>
    </h1>

    <p>{subtitle}</p>

    <button
      type="button"
      className="hero-button"
      onClick={onExplore}
    >
      Explore your energy
      <ArrowRight size={17} />
    </button>

    <div className="hero-benefit">
      <Leaf size={16} />
      Small changes can make a difference.
    </div>
  </div>

  <div className="energy-hero-art" aria-hidden="true">
    <div className="hero-orbit orbit-one" />
    <div className="hero-orbit orbit-two" />
    <div className="hero-energy-circle">
      <Zap size={58} fill="currentColor" />
    </div>
    <div className="hero-leaf leaf-one">
      <Leaf size={25} />
    </div>
    <div className="hero-leaf leaf-two">
      <Leaf size={20} />
    </div>
  </div>
</section>
```

);
}
