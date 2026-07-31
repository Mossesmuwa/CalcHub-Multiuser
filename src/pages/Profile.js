import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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

  useEffect(() => {
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .single()
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
    if (!error) showToast("Profile updated");
  }

  async function handlePictureChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const path = `${user.id}/avatar.${file.name.split(".").pop()}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      showToast("Upload failed");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${data.publicUrl}?t=${Date.now()}`; // bust the cache so the new photo shows right away

    await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("id", user.id);
    setAvatarUrl(url);
    setUploading(false);
    showToast("Picture updated");
  }

  return (
    <div className="app-shell">
      <div className="navbar">
        <Logo />
        <Link to="/" className="icon-button">
          <ArrowLeftIcon />
        </Link>
      </div>

      <div
        className="card"
        style={{ padding: 28, maxWidth: 460, margin: "0 auto" }}
      >
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
            <div className="avatar-overlay">{uploading ? "..." : "Change"}</div>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            onChange={handlePictureChange}
            style={{ display: "none" }}
          />
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
    </div>
  );
}

export default Profile;
