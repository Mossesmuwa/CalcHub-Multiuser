import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useToast } from "../contexts/ToastContext";
import {
  StarIcon,
  TrashIcon,
  CopyIcon,
  SearchIcon,
  ClearIcon,
  DownloadIcon,
} from "./Icons";
import { HistorySkeleton } from "./Skeleton";

function History({ user, refreshKey, forceFavorites = false }) {
  const [calculations, setCalculations] = useState([]);
  const [search, setSearch] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(forceFavorites);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("calculations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!cancelled && !error) setCalculations(data);
      if (!cancelled) setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user.id, refreshKey]);

  async function toggleFavorite(calc) {
    const wasFavorite = calc.is_favorite;

    // update the screen right away, then confirm with the database
    setCalculations(
      calculations.map((c) =>
        c.id === calc.id ? { ...c, is_favorite: !wasFavorite } : c,
      ),
    );

    const { error } = await supabase
      .from("calculations")
      .update({ is_favorite: !wasFavorite })
      .eq("id", calc.id);

    if (error) {
      // put it back if the database rejected it, and say so
      setCalculations(
        calculations.map((c) =>
          c.id === calc.id ? { ...c, is_favorite: wasFavorite } : c,
        ),
      );
      showToast("Couldn't update favorite — try again", "error");
    } else {
      showToast(
        wasFavorite ? "Removed from favorites" : "Added to favorites",
        "success",
      );
    }
  }

  async function deleteOne(id) {
    const removed = calculations.find((c) => c.id === id);
    setCalculations(calculations.filter((c) => c.id !== id));

    const timeoutId = setTimeout(async () => {
      await supabase.from("calculations").delete().eq("id", id);
    }, 5000);

    showToast("Calculation deleted", "success", {
      label: "Undo",
      onClick: () => {
        clearTimeout(timeoutId);
        setCalculations((current) => [removed, ...current]);
      },
    });
  }

  async function clearAll() {
    if (!window.confirm("Delete your entire history? This can't be undone."))
      return;
    const { error } = await supabase
      .from("calculations")
      .delete()
      .eq("user_id", user.id);
    if (!error) {
      setCalculations([]);
      showToast("History cleared", "success");
    }
  }

  function copyResult(value) {
    navigator.clipboard.writeText(value);
    showToast("Copied to clipboard", "success");
  }

  function exportCsv() {
    if (visible.length === 0) {
      showToast("Nothing to export", "error");
      return;
    }

    const rows = [["Expression", "Result", "Favorite", "Date"]];
    visible.forEach((c) => {
      rows.push([
        c.expression,
        c.result,
        c.is_favorite ? "Yes" : "No",
        new Date(c.created_at).toLocaleString(),
      ]);
    });

    const csv = rows
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "calchub-history.csv";
    link.click();
    URL.revokeObjectURL(url);

    showToast("Downloaded", "success");
  }

  const visible = calculations
    .filter((c) => !showFavoritesOnly || c.is_favorite)
    .filter((c) => c.expression.includes(search) || c.result.includes(search));

  if (loading) {
    return (
      <div className="card" style={{ padding: 22 }}>
        <div className="history-header">
          <h3>{forceFavorites ? "Favorites" : "History"}</h3>
        </div>
        <HistorySkeleton />
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 22 }}>
      <div className="history-header">
        <h3>{forceFavorites ? "Favorites" : "History"}</h3>
        <div className="history-actions">
          {!forceFavorites && (
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={showFavoritesOnly ? "active" : ""}
              title="Favorites only"
              aria-label="Show favorites only"
            >
              <StarIcon filled={showFavoritesOnly} />
            </button>
          )}
          <button
            onClick={exportCsv}
            title="Export as CSV"
            aria-label="Export as CSV"
          >
            <DownloadIcon />
          </button>
          {!forceFavorites && (
            <button
              onClick={clearAll}
              title="Clear all"
              aria-label="Clear all history"
            >
              <TrashIcon />
            </button>
          )}
        </div>
      </div>

      <div className="search-box">
        <SearchIcon />
        <input
          placeholder={
            forceFavorites
              ? "Search your favorites..."
              : "Search your calculations..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            className="search-clear"
            onClick={() => setSearch("")}
            aria-label="Clear search"
          >
            <ClearIcon />
          </button>
        )}
      </div>

      <div className="history-list">
        {visible.length === 0 ? (
          <p className="empty-state">
            {forceFavorites
              ? "No favorites yet — star a calculation to save it here."
              : "No calculations match yet."}
          </p>
        ) : (
          visible.map((calc) => (
            <div className="history-item" key={calc.id}>
              <div className="history-main">
                <span className="history-expr">{calc.expression}</span>
                <span className="history-result">= {calc.result}</span>
                <span className="history-time">
                  {new Date(calc.created_at).toLocaleString()}
                </span>
              </div>
              <div className="history-actions">
                <button
                  onClick={() => toggleFavorite(calc)}
                  className={calc.is_favorite ? "active" : ""}
                  aria-label={
                    calc.is_favorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  <StarIcon filled={calc.is_favorite} />
                </button>
                <button
                  onClick={() => copyResult(calc.result)}
                  aria-label="Copy result"
                >
                  <CopyIcon />
                </button>
                <button
                  onClick={() => deleteOne(calc.id)}
                  aria-label="Delete this calculation"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;
