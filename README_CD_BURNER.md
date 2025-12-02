# 🎵 Lil Baby CD Burner - Burn Your Music to CD-R Discs

A Python program that converts your Lil Baby MP3 collection to CD-compatible format and prepares them for burning to CD-R discs that work in car stereos.

## 🚀 Quick Start

### For Windows Users (Easiest Method)

1. **Double-click `run_cd_burner.bat`**
   - This will automatically set up everything and run the program
   - Follow the on-screen instructions

### For Manual Setup

1. **Install Python** (if not already installed)
   - Download from: https://www.python.org/downloads/
   - Make sure to check "Add Python to PATH" during installation

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Program**
   ```bash
   python cd_burner.py
   ```

## 📋 What This Program Does

1. **Scans your music folder** for MP3 files
2. **Converts MP3 to CD-compatible WAV** (44.1kHz, 16-bit stereo)
3. **Creates a CUE file** for proper CD burning
4. **Provides burning instructions** for multiple CD burning software options

## 📁 File Structure

```
your-project/
├── cd_burner.py          # Main program
├── requirements.txt      # Python dependencies
├── run_cd_burner.bat     # Windows launcher
├── README_CD_BURNER.md   # This file
├── CoresRadio999.9FM/    # Your music folder
│   └── drip-playlist/    # Lil Baby albums
└── cd_burn_output/       # Generated after running (contains WAV files and CUE)
```

## 🎯 CD Burning Instructions

After running the program, you'll get detailed instructions for burning. Here are the main options:

### Option 1: Windows Media Player (Free, Built-in)
1. Open Windows Media Player
2. Click the "Burn" tab
3. Drag the WAV files from `cd_burn_output` folder
4. Click "Start burn"

### Option 2: Nero Burning ROM
1. Open Nero Burning ROM
2. Choose "Audio CD"
3. Import the generated `.cue` file
4. Burn at slowest speed

### Option 3: ImgBurn (Free Download)
1. Download ImgBurn from: https://www.imgburn.com/
2. Choose "Write files/folders to disc"
3. Add WAV files from `cd_burn_output`
4. Select "Audio CD" mode

## ⚠️ Important Notes

- **Use CD-R discs**, not CD-RW (rewritable discs may not work in all car stereos)
- **Burn at the lowest speed possible** for best audio quality
- **Test your burned CD** in your car stereo before making multiple copies
- Each CD can hold approximately **20 tracks** (80 minutes of audio)
- Keep your original MP3 files as backup

## 🔧 Troubleshooting

### "pydub not found" Error
```bash
pip install pydub
```

### Audio Conversion Issues
- Install ffmpeg for better audio format support
- Download from: https://ffmpeg.org/download.html
- Add `ffmpeg.exe` to your PATH or place it in the same directory

### No MP3 Files Found
- Make sure your music is in the `CoresRadio999.9FM/drip-playlist/` folder
- Check that files have `.mp3` extension

### CD Burning Software Issues
- Try a different burning program
- Use freshly purchased CD-R discs
- Clean your CD drive if burns keep failing

## 🎵 Supported Audio Formats

- **Input:** MP3 files (320kbps recommended)
- **Output:** WAV files (44.1kHz, 16-bit, stereo) - CD standard

## 📊 Technical Details

- **Sample Rate:** 44,100 Hz (CD standard)
- **Bit Depth:** 16-bit
- **Channels:** Stereo
- **File Format:** WAV (uncompressed)

## 🤝 Support

If you encounter issues:

1. Check the error messages in the console
2. Verify all dependencies are installed
3. Try running with administrator privileges
4. Test with a small number of files first

## 📝 License

This program is provided as-is for personal use. Make sure you have the rights to burn and distribute the music files.

---

**Happy burning! 🎵🔥**
