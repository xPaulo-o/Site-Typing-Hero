'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

const desktopApps = [
  {
    href: 'https://github.com/xPaulo-o/typing_hero',
    icon: '/Images/GithubIcon.png',
    label: 'GitHub',
    top: '10%',
    mobileTop: '17%',
  },
  {
    href: 'https://www.instagram.com/xpaulo_o2/',
    icon: '/Images/InstagramIcon.png',
    label: 'Instagram',
    top: '25.5%',
    mobileTop: '28%',
  },
  {
    href: 'https://www.linkedin.com/in/paulo-augusto-b579513a1/',
    icon: '/Images/LinkedInIcon.png',
    label: 'LinkedIn',
    top: '41%',
    mobileTop: '39%',
  },
];

const appIconClass =
  'absolute left-[8%] top-[var(--desktop-top)] z-10 flex w-[6.4%] min-w-12 max-w-24 flex-col items-center justify-start rounded-sm px-1 py-1 transition-colors hover:bg-white/20 focus-visible:bg-white/20 max-md:left-[25%] max-md:top-[var(--mobile-top)] max-md:w-[14%] max-md:min-w-0 max-md:max-w-none max-md:px-0.5 max-md:py-0.5';

const gameDownloadHref = '/Arquivos/Typing_Hero.rar';

type WindowType = 'typing' | 'error' | 'easter' | 'preview';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getDragBounds(windowType: WindowType) {
  if (windowType === 'easter') {
    return { maxX: 56, maxY: 65 };
  }

  if (windowType === 'preview') {
    return { maxX: 44, maxY: 65 };
  }

  return { maxX: 64, maxY: 65 };
}

export default function Hero() {
  const screenRef = useRef<HTMLDivElement>(null);
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [windowPosition, setWindowPosition] = useState({ x: 38, y: 18 });
  const [isErrorWindowOpen, setIsErrorWindowOpen] = useState(false);
  const [errorWindowPosition, setErrorWindowPosition] = useState({
    x: 36,
    y: 20,
  });
  const [isEasterWindowOpen, setIsEasterWindowOpen] = useState(false);
  const [easterWindowPosition, setEasterWindowPosition] = useState({
    x: 30,
    y: 24,
  });
  const [isPreviewWindowOpen, setIsPreviewWindowOpen] = useState(false);
  const [previewWindowPosition, setPreviewWindowPosition] = useState({
    x: 22,
    y: 18,
  });
  const [isMobileDownloadWarningOpen, setIsMobileDownloadWarningOpen] =
    useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const activeWindow = useRef<WindowType>('typing');

  function handleDownloadClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!window.matchMedia('(max-width: 767px)').matches) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    setIsMobileDownloadWarningOpen(true);
  }

  function startDragging(
    event: React.PointerEvent<HTMLDivElement>,
    windowType: WindowType,
  ) {
    const screen = screenRef.current;

    if (!screen) {
      return;
    }

    const rect = screen.getBoundingClientRect();
    const position =
      windowType === 'typing'
        ? windowPosition
        : windowType === 'error'
          ? errorWindowPosition
          : windowType === 'easter'
            ? easterWindowPosition
            : previewWindowPosition;

    dragOffset.current = {
      x: event.clientX - rect.left - (position.x / 100) * rect.width,
      y: event.clientY - rect.top - (position.y / 100) * rect.height,
    };
    activeWindow.current = windowType;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function dragWindow(event: React.PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    const screen = screenRef.current;

    if (!screen) {
      return;
    }

    const rect = screen.getBoundingClientRect();
    const x =
      ((event.clientX - rect.left - dragOffset.current.x) / rect.width) * 100;
    const y =
      ((event.clientY - rect.top - dragOffset.current.y) / rect.height) * 100;

    const bounds = getDragBounds(activeWindow.current);
    const nextPosition = {
      x: clamp(x, 0, bounds.maxX),
      y: clamp(y, 0, bounds.maxY),
    };

    if (activeWindow.current === 'typing') {
      setWindowPosition(nextPosition);
      return;
    }

    if (activeWindow.current === 'error') {
      setErrorWindowPosition(nextPosition);
      return;
    }

    if (activeWindow.current === 'easter') {
      setEasterWindowPosition(nextPosition);
      return;
    }

    setPreviewWindowPosition(nextPosition);
  }

  return (
    <main className="grid h-dvh w-dvw place-items-center overflow-hidden">
      <div
        ref={screenRef}
        className="relative h-[min(100dvh,calc(100dvw*1536/1024))] w-[min(100dvw,calc(100dvh*1024/1536))] md:h-[min(100dvh,calc(100dvw*941/1672))] md:w-[min(100dvw,calc(100dvh*1672/941))]"
      >
        <Image
          src="/Images/heroImage.png"
          alt="Typing Hero background"
          fill
          sizes="(min-width: 768px) and (min-aspect-ratio: 1672/941) 178vh, 100vw"
          className="hidden object-contain md:block"
          priority
        />
        <Image
          src="/Images/MobileHero.png"
          alt="Typing Hero mobile background"
          fill
          sizes="(max-width: 767px) and (max-aspect-ratio: 2/3) 100vw, (max-width: 767px) 67vh, 100vw"
          className="object-contain md:hidden"
          priority
        />
        <button
          type="button"
          aria-label="Open error window"
          className="absolute left-[13%] top-[88%] z-30 h-[10%] w-[22%] cursor-pointer max-md:left-[22%] max-md:top-[84%] max-md:h-[3.6%] max-md:w-[10%]"
          onPointerDown={() => setIsErrorWindowOpen(true)}
        />
        <button
          type="button"
          aria-label="Open easter egg window"
          className="absolute left-[5.2%] top-[89.5%] z-40 h-[7%] w-[8.5%] cursor-pointer max-md:left-[21.5%] max-md:top-[84.2%] max-md:h-[3.2%] max-md:w-[3.7%]"
          onPointerDown={() => setIsEasterWindowOpen(true)}
        />
        <nav>
          {desktopApps.map((app) => (
            <Link
              key={app.label}
              href={app.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={app.label}
              className={appIconClass}
              style={
                {
                  '--desktop-top': app.top,
                  '--mobile-top': app.mobileTop,
                } as React.CSSProperties
              }
            >
              <span className="relative block aspect-square w-[72%] max-md:w-[80%]">
                <Image
                  src={app.icon}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </span>
              <span className="mt-1 text-center text-[clamp(10px,0.85vw,16px)] leading-none text-white [text-shadow:1px_1px_0_#000,-1px_1px_0_#000,1px_-1px_0_#000,-1px_-1px_0_#000] max-md:text-[clamp(9px,2.4vw,12px)]">
                {app.label}
              </span>
            </Link>
          ))}
          <button
            type="button"
            aria-label="Typing Hero"
            className={`${appIconClass} w-[7.5%] min-w-16 max-w-28 cursor-pointer [&_*]:cursor-pointer`}
            style={
              {
                '--desktop-top': '57%',
                '--mobile-top': '50%',
              } as React.CSSProperties
            }
            onClick={() => setIsWindowOpen(true)}
          >
            <span className="relative block aspect-square w-[82%] max-md:w-[88%]">
              <Image
                src="/Images/TypingHero.png"
                alt=""
                fill
                sizes="96px"
                className="object-contain"
              />
            </span>
            <span className="mt-1 text-center text-[clamp(10px,0.85vw,16px)] leading-none text-white [text-shadow:1px_1px_0_#000,-1px_1px_0_#000,1px_-1px_0_#000,-1px_-1px_0_#000] max-md:text-[clamp(9px,2.4vw,12px)]">
              Typing Hero
            </span>
          </button>
          <button
            type="button"
            aria-label="Preview"
            className={`${appIconClass} cursor-pointer [&_*]:cursor-pointer`}
            style={
              {
                '--desktop-top': '73%',
                '--mobile-top': '63%',
              } as React.CSSProperties
            }
            onClick={() => setIsPreviewWindowOpen(true)}
          >
            <span className="relative block aspect-square w-[72%] max-md:w-[80%]">
              <Image
                src="/Images/Gallery.png"
                alt=""
                fill
                sizes="80px"
                className="object-contain"
              />
            </span>
            <span className="mt-1 text-center text-[clamp(10px,0.85vw,16px)] leading-none text-white [text-shadow:1px_1px_0_#000,-1px_1px_0_#000,1px_-1px_0_#000,-1px_-1px_0_#000] max-md:text-[clamp(9px,2.4vw,12px)]">
              Preview
            </span>
          </button>
        </nav>
        {isWindowOpen && (
          <div
            className="absolute z-20 aspect-[577/433] w-[36%] max-w-[577px] min-w-64 max-md:!left-[22%] max-md:!top-[27%] max-md:w-[58%] max-md:min-w-0"
            style={{
              left: `${windowPosition.x}%`,
              top: `${windowPosition.y}%`,
            }}
          >
            <Image
              src="/Images/TypingWindow.png"
              alt="Typing Hero window"
              fill
              sizes="577px"
              className="object-contain"
              priority
            />
            <a
              href={gameDownloadHref}
              download
              aria-label="Download Typing Hero"
              className="absolute left-[27.5%] top-[51.5%] z-30 h-[15%] w-[44.5%] cursor-pointer"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={handleDownloadClick}
            />
            <div
              className="absolute left-[13%] top-[12%] z-20 h-[7%] w-[71%] cursor-move touch-none"
              onPointerDown={(event) => startDragging(event, 'typing')}
              onPointerMove={dragWindow}
            />
            <button
              type="button"
              aria-label="Close Typing Hero window"
              className="absolute left-[87.5%] top-[12.5%] z-30 h-[6%] w-[5%] cursor-pointer"
              onPointerDown={(event) => {
                event.stopPropagation();
                setIsWindowOpen(false);
              }}
            />
          </div>
        )}
        {isErrorWindowOpen && (
          <div
            className="absolute z-20 aspect-[577/433] w-[36%] max-w-[577px] min-w-64 max-md:!left-[22%] max-md:!top-[29%] max-md:w-[58%] max-md:min-w-0"
            style={{
              left: `${errorWindowPosition.x}%`,
              top: `${errorWindowPosition.y}%`,
            }}
          >
            <Image
              src="/Images/ErrorTerminal.png"
              alt="Error window"
              fill
              sizes="577px"
              className="object-contain"
              priority
            />
            <div
              className="absolute left-[12%] top-[8.5%] z-20 h-[13%] w-[76%] cursor-move touch-none"
              onPointerDown={(event) => startDragging(event, 'error')}
              onPointerMove={dragWindow}
            />
            <button
              type="button"
              aria-label="Close error window"
              className="absolute left-[85.5%] top-[8.5%] z-30 flex h-[8%] w-[5%] cursor-pointer items-center justify-center text-lg leading-none text-[#ead9b4]"
              onPointerDown={(event) => {
                event.stopPropagation();
                setIsErrorWindowOpen(false);
              }}
            >
              x
            </button>
          </div>
        )}
        {isEasterWindowOpen && (
          <div
            className="absolute z-20 aspect-[712/350] w-[44%] max-w-[712px] min-w-72 max-md:!left-[20%] max-md:!top-[34%] max-md:w-[62%] max-md:min-w-0"
            style={{
              left: `${easterWindowPosition.x}%`,
              top: `${easterWindowPosition.y}%`,
            }}
          >
            <Image
              src="/Images/EasterEgg.png"
              alt="Easter egg window"
              fill
              sizes="712px"
              className="object-contain"
              priority
            />
            <div
              className="absolute left-[10%] top-[8%] z-20 h-[11%] w-[78%] cursor-move touch-none"
              onPointerDown={(event) => startDragging(event, 'easter')}
              onPointerMove={dragWindow}
            />
            <button
              type="button"
              aria-label="Close easter egg window"
              className="absolute left-[89%] top-[8.5%] z-30 h-[9%] w-[5%] cursor-pointer"
              onPointerDown={(event) => {
                event.stopPropagation();
                setIsEasterWindowOpen(false);
              }}
            />
            <button
              type="button"
              aria-label="OK"
              className="absolute left-[29%] top-[73%] z-30 h-[15%] w-[37%] cursor-pointer"
              onPointerDown={(event) => {
                event.stopPropagation();
                setIsEasterWindowOpen(false);
              }}
            />
          </div>
        )}
        {isPreviewWindowOpen && (
          <div
            className="absolute z-20 aspect-[1672/941] w-[56%] max-w-[900px] min-w-96 max-md:!left-[19%] max-md:!top-[36%] max-md:w-[64%] max-md:min-w-0"
            style={{
              left: `${previewWindowPosition.x}%`,
              top: `${previewWindowPosition.y}%`,
            }}
          >
            <Image
              src="/Images/Previewgame.png"
              alt="Preview game window"
              fill
              sizes="900px"
              className="object-contain"
              priority
            />
            <div
              className="absolute left-[3%] top-[3.5%] z-20 h-[5.5%] w-[89%] cursor-move touch-none"
              onPointerDown={(event) => startDragging(event, 'preview')}
              onPointerMove={dragWindow}
            />
            <button
              type="button"
              aria-label="Close preview window"
              className="absolute left-[93.7%] top-[3.2%] z-30 flex h-[6.2%] w-[3.4%] cursor-pointer items-center justify-center border-2 border-[#7e4c3f] bg-[#d8c8ad] text-[clamp(12px,1.1vw,22px)] font-bold leading-none text-[#7e4c3f]"
              onPointerDown={(event) => {
                event.stopPropagation();
                setIsPreviewWindowOpen(false);
              }}
            >
              x
            </button>
          </div>
        )}
        {isMobileDownloadWarningOpen && (
          <div className="absolute left-[19%] top-[36%] z-40 aspect-[577/433] w-[64%] md:hidden">
            <Image
              src="/Images/normalwindow.png"
              alt="Mobile download warning"
              fill
              sizes="360px"
              className="object-contain"
              priority
            />
            <p className="absolute left-[15%] top-[35%] z-10 w-[70%] text-center text-[clamp(12px,3vw,16px)] font-bold leading-tight text-[#2a2119]">
              Projeto ainda nao disponivel para mobile somente desktop, para baixar use um computador
            </p>
            <button
              type="button"
              aria-label="Close mobile download warning"
              className="absolute left-[87.5%] top-[12.5%] z-20 h-[6%] w-[5%] cursor-pointer"
              onPointerDown={(event) => {
                event.stopPropagation();
                setIsMobileDownloadWarningOpen(false);
              }}
            />
            <button
              type="button"
              aria-label="OK"
              className="absolute left-[31%] top-[69%] z-20 h-[14%] w-[38%] cursor-pointer"
              onPointerDown={(event) => {
                event.stopPropagation();
                setIsMobileDownloadWarningOpen(false);
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
