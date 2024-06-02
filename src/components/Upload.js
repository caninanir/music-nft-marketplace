import React, { useState } from 'react';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Upload() {
  const [song, setSong] = useState(null);
  const [cover, setCover] = useState(null);

  const handleSongChange = (e) => {
    setSong(e.target.files[0]);
  };

  const handleCoverChange = (e) => {
    setCover(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!song || !cover) {
      alert("Please select both a song and a cover image.");
      return;
    }

    try {
      // Upload song
      const songRef = ref(storage, `songs/${song.name}`);
      await uploadBytes(songRef, song);
      const songURL = await getDownloadURL(songRef);

      // Upload cover
      const coverRef = ref(storage, `covers/${cover.name}`);
      await uploadBytes(coverRef, cover);
      const coverURL = await getDownloadURL(coverRef);

      alert("Files uploaded successfully!");
      console.log("Song URL:", songURL);
      console.log("Cover URL:", coverURL);

      // TODO: Store these URLs in Firestore along with song metadata,
      // and use songURL and coverURL for smart contract minting.
    } catch (error) {
      console.error("File upload failed:", error);
      alert("File upload failed.");
    }
  };

  return (
    <div>
      <h2>Upload Song</h2>
      <input type="file" accept="audio/*" onChange={handleSongChange} />
      <input type="file" accept="image/*" onChange={handleCoverChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}