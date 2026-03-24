import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Layout from "@/components/Layout";
import NameCard from "@/components/NameCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";
import type { BiblicalName } from "../../../shared/schema";
import { useToast } from "@/hooks/use-toast";

// Session ID persisted in memory only (no localStorage)
import { SESSION_ID } from "@/lib/session";

const PACKS = [
  { id: "all", label: "All Names" },
  { id: "heroes", label: "Heroes of Faith" },
  { id: "women", label: "Women of the Bible" },
  { id: "kings", label: "Kings & Rulers" },
  { id: "prophets", label: "Prophets" },
  { id: "new_testament", label: "New Testament" },
];

export default function Home() {
  const [selectedPack, setSelectedPack] = useState("all");
  const [currentName, setCurrentName] = useState<BiblicalName | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  // Fetch random name
  const { refetch, isFetching } = useQuery({
    queryKey: ["/api/names/random", selectedPack],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/names/random?pack=${selectedPack}`);
      const data: BiblicalName = await res.json();
      return data;
    },
    enabled: false,
  });

  // Check if current name is a favorite
  const { data: favorites } = useQuery({
    queryKey: ["/api/favorites", SESSION_ID],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/favorites?sessionId=${SESSION_ID}`);
      return res.json();
    },
  });

  useEffect(() => {
    if (currentName && favorites) {
      setIsFavorite(favorites.some((f: any) => f.nameId === currentName.id));
    }
  }, [currentName, favorites]);

  const generateName = useCallback(async () => {
    const result = await refetch();
    if (result.data) {
      setCurrentName(result.data);
      setAnimKey(k => k + 1);
      setHasStarted(true);
      // Record in history
      apiRequest("POST", "/api/history", { sessionId: SESSION_ID, nameId: result.data.id });
      qc.invalidateQueries({ queryKey: ["/api/history", SESSION_ID] });
    }
  }, [refetch, qc]);

  const favMutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        await apiRequest("DELETE", "/api/favorites", { sessionId: SESSION_ID, nameId: currentName!.id });
      } else {
        await apiRequest("POST", "/api/favorites", { sessionId: SESSION_ID, nameId: currentName!.id });
      }
    },
    onSuccess: () => {
      setIsFavorite(f => !f);
      qc.invalidateQueries({ queryKey: ["/api/favorites", SESSION_ID] });
      toast({
        title: isFavorite ? "Removed from favorites" : "Saved to favorites!",
        description: isFavorite ? `${currentName?.name} removed.` : `${currentName?.name} has been saved.`,
      });
    },
  });

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Hero section — shown before first generation */}
        {!hasStarted && (
          <div className="text-center mb-10 animate-fade-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles size={12} />
              Biblical Drive-Thru Name Generator
            </div>
            <h1
              className="text-4xl sm:text-5xl font-black text-foreground mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What's your<br />
              <span className="text-secondary">Bible name?</span>
            </h1>
            <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
              Tap the button to get a random Biblical name — perfect for the drive-thru. Plus, learn the story behind every name while you wait for your order.
            </p>
          </div>
        )}

        {/* Pack selector */}
        <div className="mb-6 animate-fade-slide-in animation-delay-100">
          <div className="flex flex-wrap gap-2 justify-center">
            {PACKS.map(pack => (
              <button
                key={pack.id}
                onClick={() => setSelectedPack(pack.id)}
                data-testid={`button-pack-${pack.id}`}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                  selectedPack === pack.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {pack.label}
              </button>
            ))}
          </div>
        </div>

        {/* Big generate button — shown before first name */}
        {!hasStarted && (
          <div className="flex justify-center mb-10 animate-fade-slide-in animation-delay-200">
            <button
              onClick={generateName}
              disabled={isFetching}
              data-testid="button-generate"
              className="relative group animate-pulse-glow inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-xl hover:bg-primary/90 active:scale-95 transition-all"
            >
              <BookOpen size={24} />
              Give Me a Name!
              <span className="absolute inset-0 rounded-2xl ring-4 ring-primary/0 group-hover:ring-primary/20 transition-all" />
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {isFetching && (
          <div className="w-full max-w-lg mx-auto space-y-4">
            <div className="rounded-2xl border border-border bg-card shadow-lg p-8 space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-16 w-64" />
              <Skeleton className="h-4 w-40" />
              <div className="border-t border-border pt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        )}

        {/* Name card */}
        {!isFetching && currentName && (
          <NameCard
            name={currentName}
            isFavorite={isFavorite}
            onFavorite={() => favMutation.mutate()}
            onNext={generateName}
            isLoading={isFetching}
            animKey={animKey}
          />
        )}

        {/* How it works — shown before first name */}
        {!hasStarted && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center animate-fade-slide-in animation-delay-300">
            {[
              { emoji: "👆", title: "One Tap", desc: "Hit the button and get a random Biblical name instantly" },
              { emoji: "📖", title: "Learn the Story", desc: "Read about the character's life from Scripture while you wait" },
              { emoji: "✝️", title: "Spread the Word", desc: "Share names with family, friends, and your church community" },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="p-4 rounded-xl bg-card border border-border">
                <div className="text-2xl mb-2">{emoji}</div>
                <div className="font-semibold text-sm text-foreground mb-1">{title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
