import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Camera as CameraIcon } from 'lucide-react';
import Tesseract from 'tesseract.js';

export default function CameraScanner({ onClose, onContinue }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [status, setStatus] = useState('loading_cv'); // loading_cv, scanning, analyzing, result
  const [aiResult, setAiResult] = useState('');
  const [extractedData, setExtractedData] = useState({ category: 'Anotação', text: '', date: '', location: '', participants: '' });
  
  const cvRef = useRef(null);
  const animationRef = useRef(null);
  const documentCornersRef = useRef(null);

  // Load OpenCV.js dynamically
  useEffect(() => {
    if (window.cv) {
      cvRef.current = window.cv;
      setStatus('scanning');
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.7.0/opencv.js';
    script.async = true;
    script.onload = () => {
      // OpenCV takes a moment to fully initialize even after script load
      const checkCv = setInterval(() => {
        if (window.cv && window.cv.Mat) {
          clearInterval(checkCv);
          cvRef.current = window.cv;
          setStatus('scanning');
        }
      }, 100);
    };
    script.onerror = () => {
      console.error('Failed to load OpenCV');
      setStatus('scanning'); // Fallback to basic scanning
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (status !== 'scanning') return;

    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            processVideo();
          };
        }
      } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
      }
    }
    
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [status]);

  const processVideo = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !cvRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video.videoWidth === 0) {
      animationRef.current = requestAnimationFrame(processVideo);
      return;
    }

    // Match canvas to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const cv = cvRef.current;
    let src = cv.imread(canvas);
    let gray = new cv.Mat();
    let blur = new cv.Mat();
    let edges = new cv.Mat();
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    
    // Process image to find edges
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
    cv.Canny(blur, edges, 75, 200);
    
    // Find contours
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    
    let maxArea = 0;
    let maxContour = null;
    
    // Find the largest 4-sided contour
    for (let i = 0; i < contours.size(); ++i) {
      let cnt = contours.get(i);
      let area = cv.contourArea(cnt);
      
      // Filter out small noises (assume paper is at least 10% of image area)
      if (area > (canvas.width * canvas.height * 0.1)) {
        let peri = cv.arcLength(cnt, true);
        let approx = new cv.Mat();
        cv.approxPolyDP(cnt, approx, 0.02 * peri, true);
        
        if (approx.rows === 4 && area > maxArea) {
          maxArea = area;
          if (maxContour) maxContour.delete();
          maxContour = approx;
        } else {
          approx.delete();
        }
      }
      cnt.delete();
    }
    
    // Draw the contour if found
    if (maxContour) {
      // Extract points
      const points = [];
      for (let i = 0; i < 4; i++) {
        points.push({
          x: maxContour.data32S[i * 2],
          y: maxContour.data32S[i * 2 + 1]
        });
      }
      
      // Save for capture
      documentCornersRef.current = points;
      
      // Draw polygon on top of canvas (green/blue semi-transparent)
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < 4; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#3b82f6'; // Tailwind blue-500
      ctx.stroke();
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.fill();
      
      maxContour.delete();
    } else {
      documentCornersRef.current = null;
    }
    
    // Cleanup
    src.delete(); gray.delete(); blur.delete(); edges.delete(); contours.delete(); hierarchy.delete();
    
    animationRef.current = requestAnimationFrame(processVideo);
  }, []);

  // Helper to order points: top-left, top-right, bottom-right, bottom-left
  const orderPoints = (pts) => {
    let sorted = [...pts].sort((a, b) => a.x - b.x);
    let leftMost = sorted.slice(0, 2);
    let rightMost = sorted.slice(2, 4);
    
    let tl = leftMost.sort((a, b) => a.y - b.y)[0];
    let bl = leftMost[1];
    
    let tr = rightMost.sort((a, b) => a.y - b.y)[0];
    let br = rightMost[1];
    
    return [tl, tr, br, bl];
  };

  const handleCapture = async () => {
    setStatus('analyzing');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const cv = cvRef.current;
    let imageDataUrl = '';

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    if (cv && documentCornersRef.current) {
      // Perform Homography (Perspective Transform)
      let src = cv.imread(canvas);
      
      let rect = orderPoints(documentCornersRef.current);
      let tl = rect[0], tr = rect[1], br = rect[2], bl = rect[3];
      
      // Compute widths/heights
      let widthA = Math.sqrt(Math.pow(br.x - bl.x, 2) + Math.pow(br.y - bl.y, 2));
      let widthB = Math.sqrt(Math.pow(tr.x - tl.x, 2) + Math.pow(tr.y - tl.y, 2));
      let maxWidth = Math.max(Math.floor(widthA), Math.floor(widthB));

      let heightA = Math.sqrt(Math.pow(tr.x - br.x, 2) + Math.pow(tr.y - br.y, 2));
      let heightB = Math.sqrt(Math.pow(tl.x - bl.x, 2) + Math.pow(tl.y - bl.y, 2));
      let maxHeight = Math.max(Math.floor(heightA), Math.floor(heightB));

      let dst = new cv.Mat();
      let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
        tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y
      ]);
      let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
        0, 0, maxWidth - 1, 0, maxWidth - 1, maxHeight - 1, 0, maxHeight - 1
      ]);
      
      let M = cv.getPerspectiveTransform(srcTri, dstTri);
      cv.warpPerspective(src, dst, M, new cv.Size(maxWidth, maxHeight));
      
      // Draw warped image back to a canvas to get Data URL
      const warpedCanvas = document.createElement('canvas');
      cv.imshow(warpedCanvas, dst);
      imageDataUrl = warpedCanvas.toDataURL('image/jpeg');
      
      src.delete(); dst.delete(); srcTri.delete(); dstTri.delete(); M.delete();
    } else {
      // Fallback: just use full frame
      imageDataUrl = canvas.toDataURL('image/jpeg');
    }

    try {
      // Run OCR using Tesseract
      const { data: { text } } = await Tesseract.recognize(imageDataUrl, 'por', {
        logger: m => console.log(m)
      });
      
      console.log('OCR Result:', text);

      // Robust Heuristic AI Parser
      let category = 'Anotação';
      const lowerText = text.toLowerCase();
      
      if (lowerText.match(/r[eoé]uni[aãäâo]o/i) || lowerText.match(/reuni/i)) category = 'Reunião';
      else if (lowerText.match(/visita/i) || lowerText.match(/t[eéè]cnica/i)) category = 'Visita Técnica';
      else if (lowerText.match(/rascunho/i)) category = 'Rascunho';

      // Extract date (DD/MM/YYYY or DD/MM or DD.MM)
      const dateMatch = text.match(/(\d{1,2})[\/\-\.](\d{1,2})(?:[\/\-\.](\d{2,4}))?/);
      let parsedDate = '';
      if (dateMatch) {
        const d = dateMatch[1].padStart(2, '0');
        const m = dateMatch[2].padStart(2, '0');
        const y = dateMatch[3] ? (dateMatch[3].length === 2 ? '20' + dateMatch[3] : dateMatch[3]) : new Date().getFullYear();
        parsedDate = `${y}-${m}-${d}T12:00`;
      }

      setExtractedData({
        category,
        text,
        date: parsedDate,
        location: '',
        participants: ''
      });
      
      setAiResult(category);
      setStatus('result');
    } catch (err) {
      console.error(err);
      setAiResult('Erro na leitura');
      setStatus('result');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: '#000', zIndex: 9999, display: 'flex', flexDirection: 'column', color: 'white'
    }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', zIndex: 10 }}>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
          <X size={32} />
        </button>
        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Scanner Inteligente</div>
        <div style={{ width: '32px' }}></div>
      </div>

      {status === 'loading_cv' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
           <div className="spinner" style={{ marginBottom: '1.5rem', width: '40px', height: '40px' }}></div>
           <p style={{ opacity: 0.8 }}>Iniciando Inteligência Visual...</p>
        </div>
      )}

      {status === 'scanning' && (
        <>
          <div style={{ position: 'relative', flex: 1, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <video 
              ref={videoRef} 
              playsInline 
              muted
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0 }} 
            />
            
            {/* The visible canvas that shows the video + contours */}
            <canvas 
              ref={canvasRef}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Static UI Overlay (corners) */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', padding: '2rem' }}>
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                 <div className="scanner-corner top-left"></div>
                 <div className="scanner-corner top-right"></div>
                 <div className="scanner-corner bottom-left"></div>
                 <div className="scanner-corner bottom-right"></div>
              </div>
            </div>
          </div>

          <div style={{
            position: 'absolute', bottom: '2rem', left: 0, right: 0,
            display: 'flex', justifyContent: 'center', zIndex: 10
          }}>
            <button onClick={handleCapture} style={{
              width: '75px', height: '75px', borderRadius: '50%',
              backgroundColor: 'var(--primary-blue)', border: '4px solid white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
            }}>
              <CameraIcon size={36} color="white" />
            </button>
          </div>
        </>
      )}

      {status === 'analyzing' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--secondary-blue)' }}>
           <div className="spinner" style={{ marginBottom: '2rem' }}></div>
           <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Analisando documento...</h3>
           <p style={{ opacity: 0.8, marginTop: '0.5rem', textAlign: 'center', padding: '0 2rem' }}>
             Lendo texto e alinhando perspectiva...
           </p>
        </div>
      )}

      {status === 'result' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', padding: '2rem' }}>
           <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
           </div>
           <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary-blue)', marginBottom: '0.5rem' }}>Sucesso!</h3>
           <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1rem', color: '#6B7280' }}>
             O documento foi identificado automaticamente como:<br/>
             <strong style={{ color: 'var(--primary-blue)', fontSize: '1.3rem', display: 'block', marginTop: '0.5rem' }}>{aiResult}</strong>
           </p>

           <button 
             onClick={() => onContinue(extractedData)} 
             style={{
               width: '100%', padding: '1.2rem', borderRadius: '12px',
               backgroundColor: 'var(--primary-blue)', color: 'white', border: 'none',
               fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer',
               boxShadow: '0 4px 10px rgba(66, 133, 244, 0.3)'
             }}
           >
             Continuar para Edição
           </button>
        </div>
      )}

    </div>
  );
}
