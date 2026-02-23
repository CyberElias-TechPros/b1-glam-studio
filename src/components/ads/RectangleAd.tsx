import { motion } from "framer-motion";

interface RectangleAdProps {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  className?: string;
}

export function RectangleAd({ title, description, imageUrl, linkUrl, className = "" }: RectangleAdProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block">
        {imageUrl && (
          <div className="aspect-[4/3] bg-secondary overflow-hidden">
            <img src={imageUrl} alt="Ad" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        <div className="p-4">
          <div className="text-xs text-primary font-medium mb-2">Sponsored</div>
          <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        </div>
      </a>
    </motion.div>
  );
}
