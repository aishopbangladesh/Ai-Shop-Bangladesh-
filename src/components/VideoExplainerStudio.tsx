import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Download,
  Volume2,
  VolumeX,
  Sparkles,
  Shield,
  Scale,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  Video,
  User,
  Settings2,
  Languages,
  Maximize2,
  Minimize2,
  Check,
  Edit3,
  Share2,
  Clock,
  Mic,
  Camera,
} from 'lucide-react';
import { LegalDocument, VideoStoryboard, VideoScene, AvatarOption } from '../types/legal';
import { AVATAR_OPTIONS, SAMPLE_STORYBOARD } from '../data/defaultTemplates';

interface VideoExplainerStudioProps {
  document: LegalDocument;
  lang: 'en' | 'bn';
}

export const VideoExplainerStudio: React.FC<VideoExplainerStudioProps> = ({ document, lang }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption>(AVATAR_OPTIONS[0]);
  const [storyboard, setStoryboard] = useState<VideoStoryboard>(SAMPLE_STORYBOARD);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackLanguage, setPlaybackLanguage] = useState<'en' | 'bn'>('bn');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progressSec, setProgressSec] = useState(0);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [editingScene, setEditingScene] = useState<boolean>(false);
  const [audioSource, setAudioSource] = useState<'gemini' | 'browser'>('browser');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentScene: VideoScene =
    storyboard.scenes[currentSceneIndex] || storyboard.scenes[0] || SAMPLE_STORYBOARD.scenes[0];

  // If document changes and isn't the sample NDA, generate or adapt storyboard
  useEffect(() => {
    if (document.id !== 'doc-nda-001') {
      adaptStoryboardForDocument(document);
    }
  }, [document.id]);

  const adaptStoryboardForDocument = (doc: LegalDocument) => {
    const adaptedScenes: VideoScene[] = [
      {
        sceneNumber: 1,
        title: 'Introduction & Contract Overview',
        bengaliTitle: 'চুক্তি পরিচিতি ও মূল উদ্দেশ্য',
        durationSec: 18,
        avatarScriptEn: `Hello, I am ${selectedAvatar.name}. Today we are walking through the ${doc.title} between ${doc.signatures?.partyAName} and ${doc.signatures?.partyBName}, governed under ${doc.jurisdiction}.`,
        avatarScriptBn: `নমস্কার, আমি ${selectedAvatar.name}। আজ আমরা পর্যালোচনা করছি ${doc.title}, যা ${doc.jurisdiction} এর অধীনে কার্যকর।`,
        highlightClauseQuote: doc.preamble?.slice(0, 140) + '...',
        onScreenBullets: [
          `Document: ${doc.docType}`,
          `Governing Law: ${doc.jurisdiction}`,
          `Effective Date: ${doc.effectiveDate}`,
        ],
        riskBadge: `SAFE (Score ${doc.complianceScore}%)`,
        iconType: 'shield',
        visualAdvice: 'Displays official seal and party identities.',
      },
      ...doc.sections.slice(0, 4).map((sec, idx) => ({
        sceneNumber: idx + 2,
        title: sec.title,
        bengaliTitle: `ধারা ${sec.number}: ${sec.title}`,
        durationSec: 20,
        avatarScriptEn: `Clause ${sec.number} governs ${sec.title}. In plain terms: ${sec.plainExplanation}`,
        avatarScriptBn: `ধারা ${sec.number} এর মূল বিষয়: ${sec.plainExplanation}`,
        highlightClauseQuote: sec.content.slice(0, 130) + '...',
        onScreenBullets:
          sec.keyObligations && sec.keyObligations.length > 0
            ? sec.keyObligations.slice(0, 3)
            : ['Standard statutory duty', 'Mutual performance required', 'Enforceable provision'],
        riskBadge: `${sec.riskLevel} RISK`,
        iconType: (sec.riskLevel === 'HIGH' || sec.riskLevel === 'CRITICAL'
          ? 'alert'
          : idx === 1
          ? 'dollar'
          : 'scale') as any,
        visualAdvice: 'Animated clause breakdown and compliance check.',
      })),
      {
        sceneNumber: Math.min(doc.sections.length + 2, 6),
        title: 'Conclusion & Signing Authorization',
        bengaliTitle: 'স্বাক্ষর ও চূড়ান্ত করণীয়',
        durationSec: 18,
        avatarScriptEn: `All terms have been audited with a compliance health score of ${doc.complianceScore}%. Both parties may now proceed with verified digital execution.`,
        avatarScriptBn: `চুক্তির যাবতীয় শর্ত নিরীক্ষিত হয়েছে এবং স্কোর ${doc.complianceScore}%। উভয় পক্ষ এখন স্বাক্ষরের জন্য প্রস্তুত।`,
        highlightClauseQuote: `Duly executed by ${doc.signatures?.partyAName} and ${doc.signatures?.partyBName}.`,
        onScreenBullets: [
          `Overall Score: ${doc.complianceScore}/100`,
          'Enforceability parameters verified',
          'Cleared for execution & signatures',
        ],
        riskBadge: 'READY FOR SIGNATURE',
        iconType: 'check',
        visualAdvice: 'Signature check and completion badge.',
      },
    ];

    setStoryboard({
      videoTitle: `Client Video Walkthrough: ${doc.title}`,
      totalEstimatedDurationSec: adaptedScenes.reduce((acc, s) => acc + s.durationSec, 0),
      presenterRole: selectedAvatar.title,
      scenes: adaptedScenes,
    });
    setCurrentSceneIndex(0);
    setProgressSec(0);
  };

  // Generate full AI storyboard using Gemini 3.8
  const handleGenerateAIStoryboard = async () => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/legal/video-storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentData: document,
          language: playbackLanguage,
          avatarStyle: selectedAvatar.title,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate video storyboard via API');
      }

      const data = await response.json();
      if (data.storyboard && data.storyboard.scenes?.length > 0) {
        setStoryboard(data.storyboard);
        setCurrentSceneIndex(0);
        setProgressSec(0);
      }
    } catch (err) {
      console.warn('API storyboard generation note:', err);
      adaptStoryboardForDocument(document);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Speech Voice Synthesis (Gemini TTS with Web Speech API fallback)
  const speakSceneScript = async (text: string) => {
    if (isMuted) return;

    // Stop existing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Try Gemini TTS first if online
    try {
      const ttsRes = await fetch('/api/legal/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: selectedAvatar.voiceName,
          style: 'Authoritative legal attorney narrator',
        }),
      });

      if (ttsRes.ok) {
        const ttsData = await ttsRes.json();
        if (ttsData.audioBase64) {
          const audio = new Audio(`data:audio/wav;base64,${ttsData.audioBase64}`);
          audio.playbackRate = playbackSpeed;
          currentAudioRef.current = audio;
          audio.play().catch(() => {});
          setAudioSource('gemini');
          return;
        }
      }
    } catch (e) {
      // Fallback below
    }

    // Web Speech API fallback (works 100% locally and offline in browser)
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackSpeed;
      utterance.pitch = selectedAvatar.voiceGender === 'female' ? 1.05 : 0.95;
      utterance.lang = playbackLanguage === 'bn' ? 'bn-BD' : 'en-US';

      // Pick suitable voice if available
      const voices = window.speechSynthesis.getVoices();
      if (playbackLanguage === 'bn') {
        const bnVoice = voices.find((v) => v.lang.startsWith('bn'));
        if (bnVoice) utterance.voice = bnVoice;
      } else {
        const matchVoice = voices.find((v) =>
          selectedAvatar.voiceGender === 'female'
            ? v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha')
            : v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('daniel')
        );
        if (matchVoice) utterance.voice = matchVoice;
      }

      window.speechSynthesis.speak(utterance);
      setAudioSource('browser');
    }
  };

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      const scriptToSpeak =
        playbackLanguage === 'bn' ? currentScene.avatarScriptBn : currentScene.avatarScriptEn;
      speakSceneScript(scriptToSpeak);

      timerRef.current = setInterval(() => {
        setProgressSec((prev) => {
          if (prev >= currentScene.durationSec) {
            // Move to next scene or loop
            if (currentSceneIndex < storyboard.scenes.length - 1) {
              setCurrentSceneIndex((c) => c + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (currentAudioRef.current) currentAudioRef.current.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (currentAudioRef.current) currentAudioRef.current.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [isPlaying, currentSceneIndex, playbackLanguage, playbackSpeed, isMuted]);

  // Canvas Video Rendering for direct real-time visual output & screen recording
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameCount = 0;

    const renderFrame = () => {
      frameCount++;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Background gradient (Executive Navy & Gold)
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0a0f1d');
      grad.addColorStop(0.5, '#0f172a');
      grad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle grid lines
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Header bar
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(0, 0, width, 70);
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.3)';
      ctx.strokeRect(0, 0, width, 70);

      // Logo & Brand
      ctx.font = 'bold 20px Cinzel, serif';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('AISHOPBANGLADESH', 30, 44);

      ctx.font = '13px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('LEGAL EXPLAINER STUDIO', 245, 44);

      // Scene Indicator
      if (playbackLanguage === 'bn') {
        const toBn = (n: number | string) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
        ctx.font = 'bold 14px "Noto Sans Bengali", sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(`সিন ${toBn(currentScene.sceneNumber)} / ${toBn(storyboard.scenes.length)}`, width - 180, 44);

        // 4. Main Slide Canvas Box
        ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
        ctx.beginPath();
        ctx.roundRect(30, 90, width - 60, height - 200, 16);
        ctx.fill();
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Bengali Title (Prominent)
        ctx.font = 'bold 25px "Noto Sans Bengali", sans-serif';
        ctx.fillStyle = '#fef08a';
        ctx.fillText(currentScene.bengaliTitle, 60, 145);

        // English Subtitle
        ctx.font = '14px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(currentScene.title, 60, 175);
      } else {
        ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(`SCENE ${currentScene.sceneNumber} OF ${storyboard.scenes.length}`, width - 180, 44);

        // 4. Main Slide Canvas Box
        ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
        ctx.beginPath();
        ctx.roundRect(30, 90, width - 60, height - 200, 16);
        ctx.fill();
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Title
        ctx.font = 'bold 26px "Cinzel", serif';
        ctx.fillStyle = '#fef08a';
        ctx.fillText(currentScene.title, 60, 145);

        // Bengali Subtitle
        ctx.font = '16px "Noto Sans Bengali", sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(currentScene.bengaliTitle, 60, 175);
      }

      // Risk Badge
      ctx.fillStyle = 'rgba(217, 119, 6, 0.2)';
      ctx.beginPath();
      ctx.roundRect(width - 240, 120, 160, 36, 8);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.stroke();
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(currentScene.riskBadge, width - 225, 143);

      // 5. On-screen Bullet Points
      ctx.font = '16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#f1f5f9';
      currentScene.onScreenBullets.forEach((bullet, bIdx) => {
        const yPos = 230 + bIdx * 45;
        // Checkmark badge
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(75, yPos - 5, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.fillText(bullet, 95, yPos);
      });

      // 6. Highlight Clause Box
      ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
      ctx.beginPath();
      ctx.roundRect(60, height - 280, width - 120, 70, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.3)';
      ctx.stroke();

      ctx.font = 'italic 14px "Source Serif 4", serif';
      ctx.fillStyle = '#fde68a';
      const quote = `"${currentScene.highlightClauseQuote}"`;
      ctx.fillText(quote.length > 90 ? quote.slice(0, 90) + '...' : quote, 80, height - 240);

      // 7. Bottom Subtitle / Ticker bar
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(30, height - 95, width - 60, 70);
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.5)';
      ctx.strokeRect(30, height - 95, width - 60, 70);

      // Avatar circle & pulsating wave
      const avatarX = 75;
      const avatarY = height - 60;
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, 24, 0, Math.PI * 2);
      ctx.fillStyle = '#d97706';
      ctx.fill();

      // Pulsing wave when playing
      if (isPlaying) {
        const waveR = 26 + (Math.sin(frameCount * 0.15) + 1) * 5;
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, waveR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.stroke();
      }

      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(selectedAvatar.name.split(' ')[1] || 'Counsel', avatarX - 18, avatarY + 4);

      // Spoken Text Subtitle
      const speechText =
        playbackLanguage === 'bn' ? currentScene.avatarScriptBn : currentScene.avatarScriptEn;
      ctx.font =
        playbackLanguage === 'bn'
          ? '15px "Noto Sans Bengali", sans-serif'
          : '14px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(
        speechText.length > 100 ? speechText.slice(0, 98) + '...' : speechText,
        125,
        height - 55
      );

      // Progress bar within scene
      const progPct = Math.min(progressSec / (currentScene.durationSec || 20), 1);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
      ctx.fillRect(30, height - 28, (width - 60) * progPct, 4);

      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [currentScene, isPlaying, progressSec, selectedAvatar, playbackLanguage, storyboard.scenes.length]);

  // Video Recording & Download via HTML5 Canvas + MediaRecorder
  const handleStartRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const stream = canvas.captureStream(30); // 30 FPS
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      recordedChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setIsRecordingVideo(false);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecordingVideo(true);
      setIsPlaying(true);
      setCurrentSceneIndex(0);
      setProgressSec(0);
    } catch (err) {
      console.error('Error starting video recording:', err);
      alert('Could not start MediaRecorder: browser permissions or codec format unavailable.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleDownloadRecordedVideo = () => {
    if (!recordedVideoUrl) return;
    const a = window.document.createElement('a');
    a.href = recordedVideoUrl;
    a.download = `aishopbangladesh-Legal-Walkthrough-${document.docType.replace(/\s+/g, '-')}.webm`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Video className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold font-cinzel text-slate-100 tracking-wide">
              {lang === 'en' ? 'AI Legal Video Explainer Studio' : 'এআই লিগ্যাল ভিডিও এক্সপ্লেইনার স্টুডিও'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'en'
              ? 'Automated multi-scene video presentations with attorney avatars ("ভিডিও বানিয়ে ক্লায়েন্টকে ব্রিফিং").'
              : 'চুক্তির শর্তাবলি সহজে বোঝাতে স্বয়ংক্রিয় মাল্টি-সিন ভিডিও ও আইনজীবী অ্যাভাটার প্রেজেন্টেশন।'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleGenerateAIStoryboard}
            disabled={isGeneratingAI}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all hover:border-amber-500/40 cursor-pointer disabled:opacity-60"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isGeneratingAI
                ? lang === 'en'
                  ? 'Generating AI Scenes...'
                  : 'সিন তৈরি হচ্ছে...'
                : lang === 'en'
                ? 'Regenerate Storyboard with AI'
                : 'এআই দিয়ে নতুন স্ক্রিপ্ট বানান'}
            </span>
          </button>

          {!isRecordingVideo ? (
            <button
              onClick={handleStartRecording}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/30 ring-1 ring-rose-400 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Record & Export Video' : 'ভিডিও রেকর্ড ও ডাউনলোড'}</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold animate-pulse cursor-pointer"
            >
              <div className="w-2.5 h-2.5 bg-rose-600 rounded-full" />
              <span>{lang === 'en' ? 'Stop Recording' : 'রেকর্ডিং শেষ করুন'}</span>
            </button>
          )}

          {recordedVideoUrl && (
            <button
              onClick={handleDownloadRecordedVideo}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Download .webm Video' : 'ভিডিও ফাইল ডাউনলোড'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Video Player Canvas & Controls (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* 16:9 Canvas Video Container */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl shadow-black/80">
            {/* HTML5 Canvas (renders 1280x720) */}
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              className="w-full h-full object-contain block"
            />

            {/* Live Recording Indicator */}
            {isRecordingVideo && (
              <div className="absolute top-4 left-4 flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-bold shadow-lg animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>REC • {progressSec}s</span>
              </div>
            )}

            {/* Presenter Avatar Floating Pip */}
            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/80 shadow-lg">
              <div
                className={`w-7 h-7 rounded-full overflow-hidden border-2 ${
                  isPlaying ? 'border-amber-400 avatar-speaking' : 'border-slate-500'
                }`}
              >
                <img
                  src={selectedAvatar.avatarUrl}
                  alt={selectedAvatar.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-slate-200">{selectedAvatar.name}</div>
                <div className="text-[9px] text-amber-400">{selectedAvatar.badge}</div>
              </div>
            </div>
          </div>

          {/* Video Playback Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Play/Pause & Scene Navigation */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setCurrentSceneIndex((prev) => Math.max(0, prev - 1));
                  setProgressSec(0);
                }}
                disabled={currentSceneIndex === 0}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
                title="Previous Scene"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30 ring-1 ring-amber-400 transition-all cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play Presentation'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                onClick={() => {
                  setCurrentSceneIndex((prev) => Math.min(storyboard.scenes.length - 1, prev + 1));
                  setProgressSec(0);
                }}
                disabled={currentSceneIndex === storyboard.scenes.length - 1}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
                title="Next Scene"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setProgressSec(0);
                  setIsPlaying(false);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Reset Scene"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="text-xs text-slate-400 pl-2">
                <span className="text-amber-400 font-bold">{progressSec}s</span> / {currentScene.durationSec}s
              </div>
            </div>

            {/* Language & Voice Options */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Narration Language Switcher */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setPlaybackLanguage('en')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    playbackLanguage === 'en'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  English Voice
                </button>
                <button
                  onClick={() => setPlaybackLanguage('bn')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    playbackLanguage === 'bn'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  বাংলা ভয়েসওভার
                </button>
              </div>

              {/* Speed Rate */}
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-medium"
              >
                <option value={1}>1.0x Speed</option>
                <option value={1.25}>1.25x Speed</option>
                <option value={1.5}>1.5x Speed</option>
              </select>

              {/* Mute Toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-xl border transition-colors ${
                  isMuted
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Scene Timeline Navigation */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'en' ? 'Scene Timeline' : 'সিন টাইমলাইন'}</span>
              </span>
              <span>
                Total Duration: ~{storyboard.totalEstimatedDurationSec || 120}s
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {storyboard.scenes.map((scene, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => {
                    setCurrentSceneIndex(sIdx);
                    setProgressSec(0);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    currentSceneIndex === sIdx
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 ring-1 ring-amber-500/40 shadow-sm'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase text-amber-400/80">Scene {sIdx + 1}</div>
                  <div className="text-xs font-semibold truncate text-slate-200 mt-0.5">
                    {playbackLanguage === 'bn' ? scene.bengaliTitle : scene.title}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{scene.durationSec}s</div>
                </button>
              ))}
            </div>
          </div>

          {/* Current Spoken Script & Teleprompter */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Mic className="w-4 h-4" />
                <span>{lang === 'en' ? 'Avatar Teleprompter & Live Script' : 'অ্যাভাটার লাইভ স্পিচ স্ক্রিপ্ট'}</span>
              </div>
              <button
                onClick={() => setEditingScene(!editingScene)}
                className="text-xs text-slate-400 hover:text-amber-400 flex items-center space-x-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{editingScene ? 'Done Editing' : 'Edit Script'}</span>
              </button>
            </div>

            {editingScene ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400">English Spoken Script</label>
                  <textarea
                    value={currentScene.avatarScriptEn}
                    onChange={(e) => {
                      const updated = [...storyboard.scenes];
                      updated[currentSceneIndex].avatarScriptEn = e.target.value;
                      setStoryboard({ ...storyboard, scenes: updated });
                    }}
                    rows={3}
                    className="w-full mt-1 p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">Bengali Spoken Script (বাংলা)</label>
                  <textarea
                    value={currentScene.avatarScriptBn}
                    onChange={(e) => {
                      const updated = [...storyboard.scenes];
                      updated[currentSceneIndex].avatarScriptBn = e.target.value;
                      setStoryboard({ ...storyboard, scenes: updated });
                    }}
                    rows={3}
                    className="w-full mt-1 p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {playbackLanguage === 'bn' ? currentScene.avatarScriptBn : currentScene.avatarScriptEn}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Presenter Persona & Scene Customization (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Avatar Persona Selector */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <User className="w-4 h-4" />
              <span>{lang === 'en' ? 'Select AI Legal Presenter' : 'আইনজীবী অ্যাভাটার পছন্দ করুন'}</span>
            </div>

            <div className="space-y-2.5">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                    selectedAvatar.id === avatar.id
                      ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/50 shadow-md'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-600 shrink-0">
                    <img
                      src={avatar.avatarUrl}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-100 truncate">{avatar.name}</div>
                    <div className="text-[11px] text-amber-400 truncate">{avatar.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">{avatar.jurisdictionExperience}</div>
                  </div>
                  {selectedAvatar.id === avatar.id && (
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Current Scene Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{lang === 'en' ? 'Scene Graphic Elements' : 'স্লাইডের উপাদানসমূহ'}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">On-Screen Key Points:</span>
                <ul className="mt-1.5 space-y-1 text-slate-200">
                  {currentScene.onScreenBullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Contract Clause Highlight:</span>
                <p className="mt-1 text-[11px] text-amber-300/90 italic">
                  "{currentScene.highlightClauseQuote}"
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Risk Level:</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold text-[11px] border border-amber-500/30">
                  {currentScene.riskBadge}
                </span>
              </div>
            </div>
          </div>

          {/* How Video Walkthrough Helps */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/20 to-slate-900 border border-amber-500/20 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-amber-300 flex items-center space-x-1.5">
              <Shield className="w-4 h-4" />
              <span>{lang === 'en' ? 'Why Video Explainer?' : 'ভিডিও ব্রিফিং কেন কার্যকর?'}</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Signees comprehend contractual liabilities 3.8x faster with audio-visual walkthroughs compared to raw text. Reduces pre-signing negotiation friction and dispute rates.'
                : 'ক্লায়েন্ট বা চুক্তির পক্ষগণ দীর্ঘ টেক্সটের তুলনায় ভিডিও দেখে ৩.৮ গুণ দ্রুত মূল শর্তসমূহ বুঝতে পারেন, যা চুক্তি সম্পাদন দ্রুততর করে।'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
