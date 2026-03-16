import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Activity, CheckCircle2, Loader2, FileImage, Trash2, RotateCcw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const baseSteps = [
  { text: "正在上传...", min: 2000, max: 2000 },
  { text: "AI识别分析中，正在识别图A...", min: 1000, max: 2000 },
  { text: "AI识别分析中，正在识别图B...", min: 1000, max: 2000 },
  { text: "AI识别分析中，正在识别图C...", min: 1000, max: 2000 },
  { text: "AI识别分析中，正在识别图D...", min: 1000, max: 2000 },
  { text: "AI识别分析中，正在识别图E...", min: 1000, max: 2000 },
  { text: "AI识别分析中，正在识别图F...", min: 1000, max: 2000 },
  { text: "识别完成", min: 2000, max: 2000 },
];

const finalResults = [
  "图 A：右侧基底节区（丘脑 / 内囊区域）出血。未见黑洞征、斑点征或岛征。",
  "图 B：右侧基底节区（范围更大，累及壳核 / 内囊）出血。可见黑洞征。",
  "图 C：左侧基底节区出血。未见黑洞征、斑点征或岛征。",
  "图 D：右侧枕叶及脑室旁区域出血，可见斑点征。",
  "图 E：左侧顶叶皮层下及脑室旁出血。可见斑点征。",
  "图 F：左侧基底节出血。未见黑洞征、斑点征或岛征。"
];

export default function App() {
  const [images, setImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const [activeSteps, setActiveSteps] = useState<{text: string, duration: number}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
      setShowResults(false);
      setCurrentStepIndex(-1);
    }
  };

  const clearImages = () => {
    setImages([]);
    setShowResults(false);
    setCurrentStepIndex(-1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const startAnalysis = async () => {
    if (images.length === 0) {
      alert("请先上传影像图片");
      return;
    }
    
    const runSteps = baseSteps.map(step => ({
      text: step.text,
      duration: Math.floor(Math.random() * (step.max - step.min + 1)) + step.min
    }));
    setActiveSteps(runSteps);

    setIsAnalyzing(true);
    setShowResults(false);
    setCurrentStepIndex(0);

    for (let i = 0; i < runSteps.length; i++) {
      setCurrentStepIndex(i);
      await new Promise(resolve => setTimeout(resolve, runSteps[i].duration));
    }

    setIsAnalyzing(false);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Activity size={24} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-800">医学影像AI智能分析系统</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!isAnalyzing && !showResults ? (
            <motion.div
              key="upload-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Upload size={20} className="text-blue-600" />
                  影像上传
                </h2>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer group mb-6"
                >
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <ImageIcon size={32} className="text-blue-600" />
                  </div>
                  <p className="text-slate-700 font-medium mb-1">点击或拖拽选取本地图片</p>
                  <p className="text-slate-500 text-sm">支持 JPG, PNG, DICOM 格式</p>
                </div>

                {images.length > 0 && (
                  <motion.div layout className="mt-2">
                    <h3 className="text-sm font-medium text-slate-700 mb-3">已上传影像 ({images.length})</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                      {images.map((img, idx) => (
                        <motion.div layout key={idx} className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative group">
                          <img src={img} alt={`Uploaded ${idx}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <FileImage className="text-white" size={24} />
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(idx);
                            }}
                            className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-10"
                            title="删除图片"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={startAnalysis}
                  disabled={images.length === 0}
                  className={`w-full py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 transition-all shadow-sm
                    ${images.length === 0 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-[0.98]'
                    }`}
                >
                  <Activity size={24} />
                  影像识别
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col">
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Activity size={20} className="text-blue-600" />
                  分析结果
                </h2>

                <div className="flex-1 flex flex-col">
                  {/* Analyzing Progress */}
                  {isAnalyzing && currentStepIndex >= 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center py-8">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                        <div className="relative bg-blue-50 p-3 rounded-full border border-blue-100">
                          <Loader2 className="animate-spin text-blue-600" size={32} />
                        </div>
                      </div>
                      <motion.div
                        key={currentStepIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-lg font-medium text-blue-700 text-center px-4"
                      >
                        {activeSteps[currentStepIndex]?.text}
                      </motion.div>
                      
                      {/* Progress bar */}
                      <div className="w-full max-w-md mt-6 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <motion.div 
                          className="bg-blue-600 h-full"
                          initial={{ width: `${(currentStepIndex / activeSteps.length) * 100}%` }}
                          animate={{ width: `${((currentStepIndex + 1) / activeSteps.length) * 100}%` }}
                          transition={{ duration: (activeSteps[currentStepIndex]?.duration || 1000) / 1000, ease: "linear" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Results */}
                  <AnimatePresence>
                    {showResults && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-3"
                      >
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-lg flex items-center gap-2 mb-4">
                          <CheckCircle2 className="text-emerald-600" size={20} />
                          <div>
                            <p className="font-medium text-sm">分析完成，已成功识别影像特征</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {finalResults.map((result, idx) => {
                            const [title, ...descParts] = result.split('：');
                            const desc = descParts.join('：');
                            return (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-colors text-sm"
                              >
                                <span className="font-semibold text-slate-800 block mb-0.5">{title}</span>
                                <span className="text-slate-600 leading-snug">{desc}</span>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {showResults && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={clearImages}
                  className="w-full py-3 rounded-xl font-medium text-base flex items-center justify-center gap-2 transition-all shadow-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 active:scale-[0.98]"
                >
                  <RotateCcw size={20} />
                  开始新的分析
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
