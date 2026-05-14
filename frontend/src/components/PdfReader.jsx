import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfReader({ pdfUrl, onTextExtracted }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [loadingPdf, setLoadingPdf] = useState(true);
  const [pdfError, setPdfError] = useState('');

  const isGoogleDriveUrl = pdfUrl?.includes('drive.google.com');

  const getGoogleDrivePreviewUrl = (url) => {
    if (!url) return '';

    if (url.includes('uc?export=view&id=')) {
      const fileId = url.split('id=')[1];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }

    if (url.includes('/file/d/')) {
      const fileId = url.split('/file/d/')[1]?.split('/')[0];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }

    return url;
  };

  const previewUrl = isGoogleDriveUrl ? getGoogleDrivePreviewUrl(pdfUrl) : pdfUrl;

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoadingPdf(false);
    setPdfError('');
  };

  const onDocumentLoadError = (error) => {
    console.error('Erro ao carregar PDF:', error);
    setLoadingPdf(false);
    setPdfError('Não foi possível carregar o PDF dentro da página.');
  };

  useEffect(() => {
    const extractText = async () => {
      try {
        if (isGoogleDriveUrl) {
          onTextExtracted('');
          return;
        }

        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const textItems = textContent.items.map((item) => item.str).join(' ');
          fullText += ` ${textItems}`;
        }

        onTextExtracted(fullText.trim());
      } catch (error) {
        console.error('Erro ao extrair texto do PDF:', error);
        onTextExtracted('');
      }
    };

    if (pdfUrl) {
      setLoadingPdf(true);
      setPdfError('');
      extractText();
    }
  }, [pdfUrl, isGoogleDriveUrl, onTextExtracted]);

  const previousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const nextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.7));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 1.6));
  };

  if (isGoogleDriveUrl) {
    return (
      <div className="pdf-reader">
        <div className="pdf-drive-info">
          <p>
            Este PDF está armazenado no Google Drive. A visualização será feita
            por preview seguro do próprio Google.
          </p>

          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            Abrir PDF em nova guia
          </a>
        </div>

        <iframe
          src={previewUrl}
          title="Visualização do PDF"
          className="pdf-drive-frame"
          allow="autoplay"
        />
      </div>
    );
  }

  return (
    <div className="pdf-reader">
      <div className="pdf-toolbar">
        <div className="pdf-toolbar-group">
          <button type="button" onClick={previousPage} disabled={pageNumber <= 1}>
            Página anterior
          </button>

          <span>
            Página {pageNumber} de {numPages || '-'}
          </span>

          <button
            type="button"
            onClick={nextPage}
            disabled={!numPages || pageNumber >= numPages}
          >
            Próxima página
          </button>
        </div>

        <div className="pdf-toolbar-group">
          <button type="button" onClick={zoomOut}>
            Zoom -
          </button>

          <span>{Math.round(scale * 100)}%</span>

          <button type="button" onClick={zoomIn}>
            Zoom +
          </button>
        </div>
      </div>

      {loadingPdf ? <p className="pdf-status">Carregando PDF...</p> : null}

      {pdfError ? (
        <div className="pdf-error">
          <p>{pdfError}</p>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            Abrir PDF em nova guia
          </a>
        </div>
      ) : null}

      <div className="pdf-document-area">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading=""
          error=""
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </div>
  );
}

export default PdfReader;