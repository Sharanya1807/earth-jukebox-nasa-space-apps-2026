import React, { useState } from 'react';
import { Play, Pause, Disc3, Sparkles, Clock, Compass, Volume2 } from 'lucide-react';
import { EarthStory, DatasetId, SoundProfileId } from '../types';
import { EARTH_STORIES } from '../data/stories';
import { EARTH_DATASETS } from '../data/datasets';

interface JukeboxPlayerProps {
  onSelectStory: (story: EarthStory) => void;
  activeStoryId?: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  className?: string;
}

export const JukeboxPlayer: React.FC<JukeboxPlayerProps> = ({
  onSelectStory,
  activeStoryId = 'warming_planet',
  isPlaying,
  onTogglePlay,
  className = '',
}) => {
  const [filterTag, setFilterTag] = useState<string>('all');

  const allTags = ['all', 'Climate Crisis', 'Cryosphere', 'Oceans', 'Biosphere', 'Wildfires', 'Atmosphere'];

  const filteredStories = filterTag === 'all'
    ? EARTH_STORIES
    : EARTH_STORIES.filter(s => s.tags.some(t => t.toLowerCase() === filterTag.toLowerCase()));

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* Category Pills Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Disc3 className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            EARTH JUKEBOX STORIES
            <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
              FEATURED SCIENTIFIC TRACKS
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-mono capitalize transition-all ${
                filterTag === tag
                  ? 'bg-cyan-500 text-space-950 font-bold shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                  : 'bg-space-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Story Cards (Spotify / Mission Control aesthetic) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStories.map((story: EarthStory) => {
          const isCurrent = story.id === activeStoryId;
          const ds = EARTH_DATASETS[story.datasetId];

          return (
            <div
              key={story.id}
              className={`group glass-card rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-300 border ${
                isCurrent
                  ? 'border-cyan-400 bg-space-800/80 shadow-[0_0_25px_rgba(0,229,255,0.25)]'
                  : 'border-slate-800/80 hover:border-cyan-500/40'
              }`}
            >
              {/* Atmospheric Background Glow Accent */}
              <div 
                className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"
                style={{ backgroundColor: ds?.colorHex || '#00e5ff' }}
              />

              <div>
                {/* Header Tag & Time */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-space-950/80 border border-slate-700/60 text-cyan-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {story.timePeriod}
                  </span>
                  <span 
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: ds?.colorHex || '#00e5ff' }}
                    title={ds?.shortName}
                  />
                </div>

                {/* Story Title & Subtitle */}
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {story.title}
                </h3>
                <h4 className="text-xs text-slate-400 mb-2 font-mono">
                  {story.subtitle}
                </h4>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                  {story.summary}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectStory(story);
                    if (!isPlaying) onTogglePlay();
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200 ${
                    isCurrent && isPlaying
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-space-950 shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                  }`}
                >
                  {isCurrent && isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>PAUSE</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>LISTEN</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onSelectStory(story)}
                  className="p-2 rounded-xl bg-space-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors"
                  title="Visualize on 3D Earth"
                >
                  <Compass className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
