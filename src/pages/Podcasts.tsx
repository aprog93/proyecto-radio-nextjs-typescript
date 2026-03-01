import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { fetchPodcasts, fetchPodcastEpisodes, type AzuraPodcast, type AzuraPodcastEpisode } from "@/lib/azuracast";
import { Loader2, Play, Mic, Calendar, Clock, ChevronLeft, Headphones } from "lucide-react";

const Podcasts = () => {
  const { t } = useTranslation();
  const [podcasts, setPodcasts] = useState<AzuraPodcast[]>([]);
  const [selectedPodcast, setSelectedPodcast] = useState<AzuraPodcast | null>(null);
  const [episodes, setEpisodes] = useState<AzuraPodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Fetch podcasts on mount
  useEffect(() => {
    let active = true;

    const loadPodcasts = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPodcasts(page, 12);
        if (active) {
          setPodcasts(data.podcasts || []);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load podcasts");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPodcasts();

    return () => {
      active = false;
    };
  }, [page]);

  // Fetch episodes when a podcast is selected
  useEffect(() => {
    let active = true;

    const loadEpisodes = async () => {
      if (!selectedPodcast) return;

      setLoadingEpisodes(true);

      try {
        const data = await fetchPodcastEpisodes(selectedPodcast.id, 1, 20);
        if (active) {
          setEpisodes(data.episodes || []);
        }
      } catch (err) {
        if (active) {
          console.error("Failed to load episodes:", err);
        }
      } finally {
        if (active) {
          setLoadingEpisodes(false);
        }
      }
    };

    loadEpisodes();

    return () => {
      active = false;
    };
  }, [selectedPodcast]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
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
  if (error && podcasts.length === 0) {
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
            Podcasts
          </h1>
          <p className="text-muted-foreground mb-10">
            Escucha nuestros podcasts y episodios exclusivos
          </p>

          {/* Selected Podcast View */}
          {selectedPodcast ? (
            <div>
              {/* Back button */}
              <button
                onClick={() => setSelectedPodcast(null)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Volver a todos los podcasts
              </button>

              {/* Podcast header */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                  {selectedPodcast.art ? (
                    <img
                      src={selectedPodcast.art}
                      alt={selectedPodcast.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Mic className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    {selectedPodcast.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {selectedPodcast.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Headphones className="w-4 h-4" />
                      {selectedPodcast.episodes_count} episodios
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {selectedPodcast.language}
                    </span>
                  </div>
                </div>
              </div>

              {/* Episodes list */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                Episodios
              </h3>

              {loadingEpisodes ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : episodes.length > 0 ? (
                <div className="space-y-4">
                  {episodes.map((episode) => (
                    <motion.div
                      key={episode.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
                    >
                      <button className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 hover:bg-primary/20 transition-colors">
                        <Play className="w-5 h-5 text-primary ml-1" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {episode.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {episode.description}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{formatDate(episode.publish_date)}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(episode.length)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No hay episodios disponibles
                </p>
              )}
            </div>
          ) : (
            /* Podcasts grid */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {podcasts.length > 0 ? (
                podcasts.map((podcast, i) => (
                  <motion.button
                    key={podcast.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedPodcast(podcast)}
                    className="text-left rounded-2xl border border-border bg-card overflow-hidden group hover:border-primary/30 transition-colors"
                  >
                    <div className="h-40 bg-secondary flex items-center justify-center overflow-hidden">
                      {podcast.art ? (
                        <img
                          src={podcast.art}
                          alt={podcast.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Mic className="w-12 h-12 text-primary/30" />
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-1">
                        {podcast.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {podcast.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Headphones className="w-3 h-3" />
                        {podcast.episodes_count} episodios
                      </div>
                    </div>
                  </motion.button>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Mic className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No hay podcasts disponibles actualmente
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Podcasts;
