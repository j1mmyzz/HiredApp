"use client";
import { useState, useCallback, useEffect } from 'react';

export const useSpeechSynthesis = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    
    const populateVoiceList = useCallback(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const newVoices = window.speechSynthesis.getVoices();
            setVoices(newVoices);
        }
    }, []);

    useEffect(() => {
        populateVoiceList();
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = populateVoiceList;
        }

        return () => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.onvoiceschanged = null;
            }
        };
    }, [populateVoiceList]);

    const speak = useCallback((text: string, voiceURI?: string) => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            
            if (voiceURI) {
                const selectedVoice = voices.find(v => v.voiceURI === voiceURI);
                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }
            }

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
              if (e.error !== 'interrupted') {
                console.error('Speech synthesis error:', e.error);
              }
              setIsSpeaking(false);
            };
            window.speechSynthesis.speak(utterance);
        }
    }, [voices]);

    const cancel = useCallback(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    useEffect(() => {
        return () => {
            cancel();
        };
    }, [cancel]);

    return { isSpeaking, speak, cancel, voices };
};
