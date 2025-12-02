@echo off
cd /d %~dp0

echo Initializing Git repository...
git init

echo Adding remote origin...
git remote add origin https://github.com/LilToreyFTW/CoresRadio-Next.git

echo Adding all files...
git add .

echo Committing files...
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

echo Pushing to GitHub...
git push -u origin main

echo Done!
pause
