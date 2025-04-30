import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { TranslationService } from './translation.service';

type Language = 'EN' | 'FR';

export interface VideoContent {
  EN: {
    title: string;
    subtitle: string;
    audioPath: string;
  };
  FR: {
    title: string;
    subtitle: string;
    audioPath: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private audio: HTMLAudioElement | null = null;
  private currentTime = new BehaviorSubject<number>(0);
  private isPlaying = new BehaviorSubject<boolean>(false);
  private isBrowser: boolean;
  private currentLanguage: Language;

  currentTime$ = this.currentTime.asObservable();
  isPlaying$ = this.isPlaying.asObservable();

  content: VideoContent = {
    EN: {
      title: 'Consult Collab',
      subtitle: 'Your partner to maximize your potential',
      audioPath: 'assets/audio/cc-recrute-english.mp3',
    },
    FR: {
      title: 'Consult Collab',
      subtitle: 'Votre partenaire pour maximiser votre potentiel',
      audioPath: 'assets/audio/cc-recrute-french.mp3',
    }
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translationService: TranslationService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.currentLanguage = this.translationService.getCurrentLang() as Language;
    
    if (this.isBrowser) {
      this.initAudio();
      
      setInterval(() => {
        const newLanguage = this.translationService.getCurrentLang() as Language;
        if (newLanguage !== this.currentLanguage) {
          this.currentLanguage = newLanguage;
          this.handleLanguageChange();
        }
      }, 1000);
    }
  }

  private async initAudio() {
    this.destroyAudio();

    const audioPath = this.content[this.currentLanguage].audioPath;
    this.audio = new Audio(audioPath);
    this.audio.preload = 'auto';
    this.audio.volume = 0.6;

    try {
      await this.audio.load();
      this.setupAudioListeners();
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  }

  private destroyAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio.removeAttribute('src');
      this.audio.load();
      this.audio = null;
    }
  }

  private async handleLanguageChange() {
    const wasPlaying = this.isPlaying.value;
    const currentTimeValue = this.currentTime.value;
    
    await this.initAudio();
    
    if (this.audio) {
      this.audio.currentTime = currentTimeValue;
      if (wasPlaying) {
        this.play();
      }
    }
  }

  getCurrentContent() {
    return this.content[this.currentLanguage];
  }

  private async play() {
    if (!this.isBrowser || !this.audio) return;

    try {
      await this.audio.play();
      this.isPlaying.next(true);
    } catch (error) {
      console.error('Playback failed:', error);
      setTimeout(() => this.play(), 1000);
    }
  }

  async autoplay() {
    if (!this.isBrowser || !this.audio) return;

    try {
      await this.play();
    } catch (error) {
      console.error('Autoplay failed:', error);
      setTimeout(() => this.autoplay(), 1000);
    }
  }

  private setupAudioListeners() {
    if (!this.audio) return;

    this.audio.ontimeupdate = () => {
      this.currentTime.next(this.audio?.currentTime || 0);
    };

    this.audio.onended = () => {
      this.stop();
    };

    this.audio.onerror = () => {
      console.error('Audio error:', this.audio?.error);
      this.stop();
      setTimeout(() => this.play(), 1000);
    };
  }

  pause() {
    this.audio?.pause();
    this.isPlaying.next(false);
  }

  resume() {
    this.play();
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.isPlaying.next(false);
    this.currentTime.next(0);
  }

  getTotalDuration(): number {
    return this.audio?.duration || 72;
  }

  ngOnDestroy() {
    this.destroyAudio();
  }
}