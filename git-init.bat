@echo off
cd /d %~dp0

git init
git remote add origin https://github.com/LilToreyFTW/CoresRadio.git
git add .
git commit -m "Add Next.js TypeScript version of Core's Radio 999.9FM

- Complete React/TypeScript radio station with Next.js 16
- AI-controlled 64-band equalizer with professional presets
- 73 high-quality MP3 tracks from Lil Baby discography
- Real-time Web Audio API processing
- Responsive Tailwind CSS design
- Client-side audio handling with proper error management
- Genre-based AI optimization for different music styles

Features:
- Hip-Hop, Rock, Pop, Club, Party preset optimizations
- Real-time spectrum analyzer visualization
- Professional audio processing without distortion
- Mobile-responsive design
- TypeScript for type safety"
git push -u origin main

echo Git setup complete!
pause
