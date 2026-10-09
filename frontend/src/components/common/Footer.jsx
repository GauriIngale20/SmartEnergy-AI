import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} SmartEnergy AI</span>
      <span>
        Smarter energy. Better tomorrow. <Leaf size={14} />
      </span>
    </footer>
  );
}