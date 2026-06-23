import React, { useState } from 'react';
import { PORTFOLIO_PROJECTS } from '@/data/mock';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, Target, Settings } from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('TẤT CẢ');
  const [selectedProject, setSelectedProject] = useState<typeof PORTFOLIO_PROJECTS[0] | null>(null);

  // Vietnamese translation mapping for tabs
  const categoryTranslationMap: Record<string, string> = {
    'ALL': 'TẤT CẢ',
    'Cloud Architecture': 'Kiến trúc Cloud',
    'DevOps & Security': 'DevOps & Bảo mật',
    'Cloud Engineering': 'Kỹ nghệ Cloud',
    'Cybersecurity': 'An toàn mạng'
  };

  const categories = ['TẤT CẢ', 'Kiến trúc Cloud', 'DevOps & Bảo mật', 'Kỹ nghệ Cloud', 'An toàn mạng'];

  const getTranslatedCategoryName = (englishCat: string) => {
    return categoryTranslationMap[englishCat] || englishCat;
  };

  const filteredProjects = activeCategory === 'TẤT CẢ'
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter(p => getTranslatedCategoryName(p.category) === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Dự án Thực tế & Kiến trúc Hệ thống
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Khám phá các giải pháp di trú hạ tầng đám mây chịu lỗi, tự động hóa vận hành CI/CD và kiến trúc bảo mật đã triển khai thành công.
        </p>
      </div>

      {/* Category selector tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              activeCategory === cat
                ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/10'
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((proj) => (
            <motion.div
              layout
              key={proj.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedProject(proj)}
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden cursor-pointer flex flex-col group h-full border border-slate-200/50 dark:border-slate-800/50"
            >
              <div className="aspect-video w-full overflow-hidden bg-slate-900 border-b border-slate-200/40 dark:border-slate-800/40 relative">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-slate-955/80 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                  {getTranslatedCategoryName(proj.category)}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider">{proj.client}</span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors leading-snug">
                    {proj.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-850">
                  <span className="text-xs font-bold text-brand-500 dark:text-brand-400">{proj.metrics}</span>
                  <span className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-brand-500 dark:group-hover:text-brand-400 group-hover:bg-brand-500/10 transition-all">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Case Study Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 z-50 bg-slate-950"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed inset-x-4 bottom-4 top-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl glass-panel border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-2xl z-[60] overflow-hidden flex flex-col"
            >
              {/* Modal Header Image */}
              <div className="relative h-48 md:h-64 bg-slate-900 border-b border-slate-200/30 dark:border-slate-800/30 shrink-0">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-955/80 via-slate-955/20 to-transparent" />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 bg-slate-955/80 backdrop-blur-md hover:bg-slate-900 text-white rounded-lg transition-colors border border-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-500 px-2 py-0.5 rounded">{getTranslatedCategoryName(selectedProject.category)}</span>
                  <h2 className="text-base sm:text-2xl font-bold tracking-tight">{selectedProject.title}</h2>
                </div>
              </div>

              {/* Scrollable details */}
              <div className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-slate-100 dark:border-slate-850 pb-6">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đối tác Khách hàng</h4>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{selectedProject.client}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hiệu quả đạt được</h4>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-450 mt-1">{selectedProject.metrics}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Công nghệ sử dụng</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedProject.tech.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-900 rounded text-[9px] font-semibold font-mono">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Target className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Thách thức Vận hành</h3>
                      <p className="text-xs sm:text-sm text-slate-555 dark:text-slate-450 mt-1 leading-relaxed">{selectedProject.challenge}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Settings className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Giải pháp Kỹ thuật Triển khai</h3>
                      <p className="text-xs sm:text-sm text-slate-555 dark:text-slate-455 mt-1 leading-relaxed">{selectedProject.solution}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-4 bg-slate-50 dark:bg-slate-955/60 border-t border-slate-200/50 dark:border-slate-800/50 shrink-0 text-center">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Đóng dự án
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PortfolioPage;
