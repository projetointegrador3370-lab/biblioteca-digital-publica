function AudioPlayer({ audioUrl }) {
  if (!audioUrl) {
    return <p>Este livro não possui audiobook disponível.</p>;
  }

  return (
    <div className="audio-player">
      <h3>Audiobook</h3>
      <audio controls src={audioUrl}>
        Seu navegador não suporta áudio.
      </audio>
    </div>
  );
}

export default AudioPlayer;
