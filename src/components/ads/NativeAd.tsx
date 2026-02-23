import { motion } from "framer-motion";

interface NativeAdProps {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  className?: string;
}

export function NativeAd({ title, description, imageUrl, linkUrl, className = "" }: NativeAdProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group ${className}`}
    >
      <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block">
        <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
          {imageUrl && (
            <div className="w-20 h-20 flex-shrink-0 bg-secondary rounded-lg overflow-hidden">
              <img src={imageUrl} alt="Ad" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-primary font-medium mb-1">Sponsored</div>
            <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-1">{title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
          </div>
        </div>
      </a>
    </motion.div>
  );
}
