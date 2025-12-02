@echo off
REM CD Burner Launcher for Windows
REM This script sets up the environment and runs the CD burner program

echo ========================================
echo    🎵 Lil Baby CD Burner Launcher 🎵
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Python is not installed or not in PATH!
    echo.
    echo Please install Python from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

echo ✅ Python found. Checking dependencies...

REM Check if pip is available
pip --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: pip is not available!
    echo Please reinstall Python with pip included.
    pause
    exit /b 1
)

REM Install/update requirements
echo Installing required packages...
pip install -r requirements.txt

if errorlevel 1 (
    echo ❌ ERROR: Failed to install required packages!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.

REM Check if ffmpeg is available (optional but recommended)
ffmpeg -version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  WARNING: ffmpeg not found. Audio conversion may be limited.
    echo    Download from: https://ffmpeg.org/download.html
    echo    Extract ffmpeg.exe to this directory or add to PATH.
    echo.
) else (
    echo ✅ ffmpeg found - full audio format support available.
    echo.
)

REM Run the CD burner program
echo Starting CD Burner Program...
echo ========================================
python cd_burner.py

REM Pause so user can see any final messages
echo.
echo Press any key to exit...
pause >nul
