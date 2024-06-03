
import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import './App.css';

export default function Upload() {
  const [mp3File, setMp3File] = useState(null);
  const [pngFile, setPngFile] = useState(null);
  const [mp3Url, setMp3Url] = useState('');
  const [pngUrl, setPngUrl] = useState('');

  const handleMP3Upload = async (e) => {
    e.preventDefault();
    if (!mp3File) return;
    const storageRef = ref(storage, `songs/${mp3File.name}`);
    await uploadBytes(storageRef, mp3File);
    const url = await getDownloadURL(storageRef);
    setMp3Url(url);
    alert("MP3 file uploaded successfully");
  };

  const handlePNGUpload = async (e) => {
    e.preventDefault();
    if (!pngFile) return;
    const storageRef = ref(storage, `covers/${pngFile.name}`);
    await uploadBytes(storageRef, pngFile);
    const url = await getDownloadURL(storageRef);
    setPngUrl(url);
    alert("PNG file uploaded successfully");
  };

  return (
    <div className="form-container">
      <h2>Upload Files</h2>
      <form onSubmit={handleMP3Upload}>
        <input type="file" onChange={(e) => setMp3File(e.target.files[0])} accept="audio/mp3" />
        <button type="submit">Upload MP3</button>
      </form>

      <form onSubmit={handlePNGUpload}>
        <input type="file" onChange={(e) => setPngFile(e.target.files[0])} accept="image/png" />
        <button type="submit">Upload PNG</button>
      </form>

      {mp3Url && <p>MP3 File URL: {mp3Url}</p>}
      {pngUrl && <p>PNG File URL: {pngUrl}</p>}
    </div>
  );
}