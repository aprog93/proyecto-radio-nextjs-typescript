import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { fetchOnDemand, type AzuraOnDemand } from "@/lib/azuracast";
import { Loader2, Play, Download, Music, Clock, FileAudio } from "lucide-react";

const OnDemand = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<AzuraOnDemand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Fetch on-demand content
  useEffect(() => {
    let active = true;

    const loadOnDemand = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchOnDemand(page, 20);
        if (active) {
          setItems(data.ondemand || []);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load on-demand content");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOnDemand();

    return () => {
      active = false;
    };
  }, [page]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && items.length === 0) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            On Demand
          </h1>
          <p className="text-muted-foreground mb-10">
            Escucha programas y entrevistas que puedas reproducir en cualquier momento
          </p>

          {/* Content list */}
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 transition-colors group"
                >
                  {/* Play button */}
                  <button className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 hover:bg-primary/20 transition-colors">
                    <Play className="w-5 h-5 text-primary ml-1" />
                  </button>

                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
                    {item.art ? (
                      <img
                        src={item.art}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-6 h-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.artist}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(item.length)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileAudio className="w-3 h-3" />
                        {formatSize(item.size)}
                      </span>
                      <span className="uppercase text-xs">
                        {item.mime.split("/")[1] || item.mime}
                      </span>
                    </div>
                  </div>

                  {/* Download button */}
                  {item.download_url && (
                    <a
                      href={item.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors"
                      download
                    >
                      <Download className="w-5 h-5 text-muted-foreground" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Music className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No hay contenido on-demand disponible actualmente
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OnDemand;
