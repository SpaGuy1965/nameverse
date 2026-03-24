import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Layout from "@/components/Layout";
import { Heart, BookOpen, Trash2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

import { SESSION_ID } from "@/lib/session";

export default function Favorites() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ["/api/favorites", SESSION_ID],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/favorites?sessionId=${SESSION_ID}`);
      return res.json();
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (nameId: number) => {
      await apiRequest("DELETE", "/api/favorites", { sessionId: SESSION_ID, nameId });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/favorites", SESSION_ID] });
      toast({ title: "Removed from favorites" });
    },
  });

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6 animate-fade-slide-up">
          <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/30">
            <Heart size={20} className="text-red-500" fill="currentColor" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Your Favorites</h2>
            <p className="text-sm text-muted-foreground">Biblical names you've saved</p>
          </div>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        )}

        {!isLoading && (!favorites || favorites.length === 0) && (
          <div className="text-center py-16 animate-fade-slide-up">
            <Heart size={40} className="mx-auto text-muted-foreground mb-4 opacity-30" />
            <p className="text-muted-foreground font-medium mb-2">No favorites yet</p>
            <p className="text-sm text-muted-foreground mb-6">Generate a name and tap the heart to save it here.</p>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              Get a name <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {!isLoading && favorites && favorites.length > 0 && (
          <div className="space-y-3 animate-fade-slide-up">
            {favorites.map((fav: any) => (
              <div
                key={fav.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                data-testid={`card-favorite-${fav.nameId}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                      {fav.name.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">({fav.name.pronunciation})</span>
                  </div>
                  <p className="text-xs text-muted-foreground italic mb-2">"{fav.name.meaning}"</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {fav.name.story}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <BookOpen size={11} className="text-primary" />
                    <span className="text-xs text-primary font-medium">{fav.name.verseRef}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeMutation.mutate(fav.nameId)}
                  data-testid={`button-remove-favorite-${fav.nameId}`}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
