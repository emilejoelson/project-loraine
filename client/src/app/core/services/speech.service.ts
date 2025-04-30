import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface DialogLine {
  speaker: 'voice1' | 'voice2' | 'both';
  text: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private speechSynthesis: SpeechSynthesis | undefined;
  private voices: SpeechSynthesisVoice[] = [];
  private isPlaying = new BehaviorSubject<boolean>(false);
  private currentDialog = new BehaviorSubject<DialogLine[]>([]);
  
  isPlaying$ = this.isPlaying.asObservable();
  currentDialog$ = this.currentDialog.asObservable();
  
  private isBrowser: boolean;
  
  private script: DialogLine[] = [
    { speaker: 'voice1', text: "Bienvenue chez Consult Collab, votre partenaire pour maximiser votre potentiel ! Vous cherchez à recruter des talents qui feront la différence dans votre entreprise ?", active: false },
    { speaker: 'voice2', text: "Ou bien vous êtes un candidat à la recherche d'une opportunité professionnelle qui correspond parfaitement à vos compétences et à vos ambitions ?", active: false },
    { speaker: 'voice1', text: "Chez Consult Collab, nous croyons que chaque collaboration est une opportunité unique. Nous connectons entreprises et talents grâce à un processus de recrutement personnalisé et efficace.", active: false },
    { speaker: 'voice2', text: "Comment ça fonctionne ? C'est simple ! Dès que vous exprimez un besoin, notre équipe se mobilise pour trouver le candidat idéal dans un délai de 48 à 72 heures.", active: false },
    { speaker: 'voice1', text: "Et pour garantir la qualité de nos recommandations, chaque candidat passe par un entretien préalable. Ensuite, nous organisons une visioconférence masquée, afin de vous permettre de découvrir leurs compétences sans biais.", active: false },
    { speaker: 'voice2', text: "Vous êtes convaincu(e) ? Une fois le match parfait trouvé, nous vous transmettons les coordonnées du candidat pour finaliser la mise en relation.", active: false },
    { speaker: 'voice1', text: "En plus de nos services de recrutement, nous vous accompagnons avec des solutions innovantes, comme nos packs Microsoft intégrant l'intelligence artificielle, pour optimiser vos performances.", active: false },
    { speaker: 'voice2', text: "Alors, prêt(e) à maximiser votre potentiel avec Consult Collab ? Contactez-nous dès aujourd'hui par téléphone au +33 1 84 80 95 37 ou visitez notre site internet : consultcollab-recrutement.com.", active: false },
    { speaker: 'both', text: "Consult Collab, votre allié pour un recrutement réussi !", active: false }
  ];

  private currentIndex = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.initializeSpeechSynthesis();
    }
    this.currentDialog.next(this.script);
  }

  private initializeSpeechSynthesis() {
    this.speechSynthesis = window.speechSynthesis;
    this.loadVoices();
    this.speechSynthesis.addEventListener('voiceschanged', () => {
      this.loadVoices();
    });
  }

  private loadVoices() {
    if (this.speechSynthesis) {
      this.voices = this.speechSynthesis.getVoices().filter(voice => voice.lang.includes('fr'));
    }
  }

  private getVoiceForSpeaker(speaker: 'voice1' | 'voice2'): SpeechSynthesisVoice | null {
    return speaker === 'voice1' ? this.voices[0] : this.voices[1];
  }

  play() {
    if (!this.isBrowser || !this.speechSynthesis) return;

    if (this.currentIndex >= this.script.length) {
      this.currentIndex = 0;
      this.script.forEach(line => line.active = false);
    }

    const currentLine = this.script[this.currentIndex];
    currentLine.active = true;
    this.currentDialog.next([...this.script]);
    
    const utterance = new SpeechSynthesisUtterance(currentLine.text);
    
    if (currentLine.speaker !== 'both') {
      const voice = this.getVoiceForSpeaker(currentLine.speaker);
      if (voice) {
        utterance.voice = voice;
      }
    }

    utterance.onend = () => {
      currentLine.active = false;
      this.currentIndex++;
      if (this.currentIndex < this.script.length) {
        this.play();
      } else {
        this.isPlaying.next(false);
      }
      this.currentDialog.next([...this.script]);
    };

    this.isPlaying.next(true);
    this.speechSynthesis.speak(utterance);
  }

  pause() {
    if (!this.isBrowser || !this.speechSynthesis) return;
    this.speechSynthesis.pause();
    this.isPlaying.next(false);
  }

  resume() {
    if (!this.isBrowser || !this.speechSynthesis) return;
    this.speechSynthesis.resume();
    this.isPlaying.next(true);
  }

  stop() {
    if (!this.isBrowser || !this.speechSynthesis) return;
    this.speechSynthesis.cancel();
    this.currentIndex = 0;
    this.script.forEach(line => line.active = false);
    this.currentDialog.next([...this.script]);
    this.isPlaying.next(false);
  }
}