import { motion } from "framer-motion";

interface BannerAdProps {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  className?: string;
}

export function BannerAd({ title, description, imageUrl, linkUrl, className = "" }: BannerAdProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-lg overflow-hidden ${className}`}
    >
      <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block p-4 hover:bg-secondary/50 transition-colors">
        <div className="flex items-center gap-4">
          {imageUrl && (
            <div className="w-12 h-12 flex-shrink-0 bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
              <img src={imageUrl} alt="Ad" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground mb-1 truncate">{title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
          </div>
          <div className="text-xs text-primary font-medium hidden sm:block">
            Sponsored
          </div>
        </div>
      </a>
    </motion.div>
  );
}
