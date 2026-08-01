import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Logo from "../components/Logo";
import { ArrowLeftIcon, UserIcon } from "../components/Icons";
import { useToast } from "../contexts/ToastContext";

function Profile({ user }) {
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name || "");
          setAvatarUrl(data.avatar_url || "");
        }
      });
  }, [user.id]);

  async function saveName() {
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", user.id);
    if (!error) showToast("Profile updated", "success");
  }

  async function handlePictureChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Please choose a PNG, JPG, or WEBP image", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be under 2MB", "error");
      return;
    }

    setUploading(true);
    const path = `${user.id}/avatar.${file.name.split(".").pop()}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      showToast("Couldn't upload — please try again", "error");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${data.publicUrl}?t=${Date.now()}`;

    await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("id", user.id);
    setAvatarUrl(url);
    setUploading(false);
    showToast("Picture updated", "success");
    window.dispatchEvent(new Event("avatar-changed"));
  }

  async function clearHistory() {
    if (
      !window.confirm(
        "Delete your entire calculation history? This can't be undone.",
      )
    )
      return;
    const { error } = await supabase
      .from("calculations")
      .delete()
      .eq("user_id", user.id);
    if (!error) showToast("History cleared", "success");
  }

  async function removeAllFavorites() {
    if (!window.confirm("Unstar all favorited calculations?")) return;
    const { error } = await supabase
      .from("calculations")
      .update({ is_favorite: false })
      .eq("user_id", user.id)
      .eq("is_favorite", true);
    if (!error) showToast("Favorites cleared", "success");
  }

  async function clearNotes() {
    if (!window.confirm("Delete all your notes? This can't be undone.")) return;
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("user_id", user.id);
    if (!error) showToast("Notes cleared", "success");
  }

  async function removeAvatar() {
    if (!avatarUrl) return;
    await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", user.id);
    setAvatarUrl("");
    showToast("Picture removed", "success");
    window.dispatchEvent(new Event("avatar-changed"));
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "This permanently deletes your account and everything in it — history, notes, favorites. This cannot be undone. Continue?",
    );
    if (!confirmed) return;

    const { error } = await supabase.rpc("delete_own_account");

    if (error) {
      showToast("Couldn't delete account — please try again", "error");
      return;
    }

    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <div className="navbar">
        <Logo />
        <Link to="/" className="icon-button">
          <ArrowLeftIcon />
        </Link>
      </div>

      <div className="settings-grid">
        <div className="card" style={{ padding: 28 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 26,
            }}
          >
            <div
              className="avatar-circle"
              onClick={() => fileInput.current.click()}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Your profile" />
              ) : (
                <UserIcon size={30} />
              )}
              <div className="avatar-overlay">
                {uploading ? "..." : "Change"}
              </div>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePictureChange}
              style={{ display: "none" }}
            />
            {avatarUrl && (
              <button className="btn-text" onClick={removeAvatar}>
                Remove picture
              </button>
            )}
          </div>

          <div className="field">
            <label>Email</label>
            <input value={user.email} disabled />
          </div>
          <div className="field">
            <label>Display name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={saveName}>
            Save changes
          </button>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <h3 className="settings-title">Data</h3>

          <div className="settings-row">
            <div>
              <div className="settings-row-title">
                Clear calculation history
              </div>
              <div className="settings-row-desc">
                Removes every saved calculation.
              </div>
            </div>
            <button className="btn-outline" onClick={clearHistory}>
              Clear
            </button>
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-row-title">Remove all favorites</div>
              <div className="settings-row-desc">
                Unstars everything, keeps the calculations.
              </div>
            </div>
            <button className="btn-outline" onClick={removeAllFavorites}>
              Clear
            </button>
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-row-title">Delete all notes</div>
              <div className="settings-row-desc">
                Removes every note you've written.
              </div>
            </div>
            <button className="btn-outline" onClick={clearNotes}>
              Clear
            </button>
          </div>

          <h3 className="settings-title danger-title">Danger zone</h3>
          <div className="settings-row">
            <div>
              <div className="settings-row-title">Delete account</div>
              <div className="settings-row-desc">
                Permanently erases your data and signs you out.
              </div>
            </div>
            <button className="btn-danger" onClick={handleDeleteAccount}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
