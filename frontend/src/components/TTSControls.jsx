function TTSControls({ text }) {
  const speak = () => {
    if (!text || !text.trim()) {
      alert('Não foi possível extrair texto para leitura automática.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => window.speechSynthesis.pause();
  const resume = () => window.speechSynthesis.resume();
  const stop = () => window.speechSynthesis.cancel();

  return (
    <div className="tts-controls">
      <h3>Leitura automática</h3>
      <button onClick={speak}>Ler texto</button>
      <button onClick={pause}>Pausar</button>
      <button onClick={resume}>Continuar</button>
      <button onClick={stop}>Parar</button>
    </div>
  );
}

export default TTSControls;
