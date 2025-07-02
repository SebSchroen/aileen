import React, { useEffect, useState, useRef } from 'react';
import { templates } from 'core/js/reactHelpers';

export default function Typewriter(props) {
  const { words = [], typingSpeed = 150, erasingSpeed = 100, delayBetweenWords = 2000 } = props;
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const typewriterRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (typewriterRef.current) {
      observer.observe(typewriterRef.current);
    }

    return () => {
      if (typewriterRef.current) {
        observer.unobserve(typewriterRef.current);
      }
    };
  }, [words]);

  useEffect(() => {
    if (!isVisible) return;
    const currentWord = words[currentWordIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting && currentText === currentWord) {
          setTimeout(() => setIsDeleting(true), delayBetweenWords);
        } else if (isDeleting && currentText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        } else if (isDeleting) {
          setCurrentText(currentWord.substring(0, currentText.length - 1));
        } else {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
        }
      },
      isDeleting ? erasingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, erasingSpeed, delayBetweenWords, isVisible]);
  return (
    <div className='component__inner typewriter__inner'>
      <templates.header {...props} />
      <div className='component__widget typewriter__widget'>
        <div ref={typewriterRef} className='typewriter__container'>
          <span className='typewriter__text'>{currentText}</span>
        </div>
      </div>
    </div>
  );
}
