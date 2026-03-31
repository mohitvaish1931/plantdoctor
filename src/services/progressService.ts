import type { UserProgress, Badge } from '../types';

const STORAGE_KEY = 'learnerbot_progress';

const defaultBadges: Badge[] = [
  {
    id: 'first-chat',
    name: 'First Steps',
    emoji: '👋',
    description: 'Started your first conversation',
    earned: false
  },
  {
    id: 'curious-mind',
    name: 'Curious Mind',
    emoji: '🤔',
    description: 'Asked 10 questions',
    earned: false
  },
  {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    emoji: '📚',
    description: 'Reached Level 5',
    earned: false
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    emoji: '🎯',
    description: 'Completed 5 quizzes',
    earned: false
  },
  {
    id: 'streak-warrior',
    name: 'Streak Warrior',
    emoji: '🔥',
    description: 'Maintained a 7-day streak',
    earned: false
  },
  {
    id: 'learning-champion',
    name: 'Learning Champion',
    emoji: '🏆',
    description: 'Reached Level 10',
    earned: false
  }
];

const defaultProgress: UserProgress = {
  level: 1,
  xp: 0,
  streak: 0,
  badges: defaultBadges,
  totalQuestions: 0,
  correctAnswers: 0
};

class ProgressService {
  private progress: UserProgress;

  constructor() {
    this.progress = this.loadProgress();
  }

  private loadProgress(): UserProgress {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all badges exist
        const mergedBadges = defaultBadges.map(defaultBadge => {
          const savedBadge = parsed.badges?.find((b: Badge) => b.id === defaultBadge.id);
          return savedBadge || defaultBadge;
        });
        return { ...defaultProgress, ...parsed, badges: mergedBadges };
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
    return defaultProgress;
  }

  private saveProgress(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  getProgress(): UserProgress {
    return { ...this.progress };
  }

  addXP(amount: number): UserProgress {
    this.progress.xp += amount;
    
    // Calculate new level
    const newLevel = Math.floor(this.progress.xp / 100) + 1;
    if (newLevel > this.progress.level) {
      this.progress.level = newLevel;
      
      // Check for level-based badges
      if (newLevel >= 5) {
        this.earnBadge('knowledge-seeker');
      }
      if (newLevel >= 10) {
        this.earnBadge('learning-champion');
      }
    }
    
    this.saveProgress();
    return this.getProgress();
  }

  earnBadge(badgeId: string): Badge | null {
    const badge = this.progress.badges.find(b => b.id === badgeId);
    if (badge && !badge.earned) {
      badge.earned = true;
      badge.earnedAt = new Date();
      this.saveProgress();
      return badge;
    }
    return null;
  }

  updateStreak(): UserProgress {
    this.progress.streak += 1;
    
    // Check for streak badges
    if (this.progress.streak >= 7) {
      this.earnBadge('streak-warrior');
    }
    
    this.saveProgress();
    return this.getProgress();
  }

  recordQuizResult(correct: boolean): UserProgress {
    this.progress.totalQuestions += 1;
    if (correct) {
      this.progress.correctAnswers += 1;
    }
    
    // Check for quiz badges
    if (this.progress.totalQuestions >= 5) {
      this.earnBadge('quiz-master');
    }
    
    this.saveProgress();
    return this.getProgress();
  }

  resetProgress(): UserProgress {
    this.progress = { ...defaultProgress };
    this.saveProgress();
    return this.getProgress();
  }
}

export const progressService = new ProgressService();