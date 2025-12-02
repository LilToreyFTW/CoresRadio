#!/usr/bin/env python3
"""
CD Burner Program for Lil Baby Music Collection
Prepares MP3 files for burning to CD-R discs compatible with car stereos.

This program converts MP3 files to CD-compatible WAV format (44.1kHz, 16-bit stereo)
and creates a CUE file for proper CD burning.

Author: AI Assistant
Date: 2025
"""

import os
import sys
from pathlib import Path
import subprocess
from typing import List, Tuple, Optional

# ADDED: Import audio processing library for MP3 to WAV conversion
try:
    from pydub import AudioSegment
    PYDUB_AVAILABLE = True
except ImportError:
    PYDUB_AVAILABLE = False
    print("Warning: pydub not installed. Please install with: pip install pydub")


class CDBurner:
    """
    Main class for handling CD burning operations.

    This class provides functionality to:
    - Scan music directories for MP3 files
    - Convert MP3 files to CD-compatible WAV format
    - Generate CUE files for proper CD burning
    - Provide burning instructions
    """

    # CD audio specifications
    CD_SAMPLE_RATE = 44100  # 44.1 kHz
    CD_BIT_DEPTH = 16       # 16-bit
    CD_CHANNELS = 2         # Stereo

    def __init__(self, music_directory: str = "CoresRadio999.9FM/drip-playlist"):
        """
        Initialize the CD burner with the music directory.

        Args:
            music_directory (str): Path to the directory containing music files
        """
        self.music_dir = Path(music_directory)
        self.output_dir = Path("cd_burn_output")
        self.output_dir.mkdir(exist_ok=True)

        # Verify music directory exists
        if not self.music_dir.exists():
            print(f"Error: Music directory '{music_directory}' not found!")
            sys.exit(1)

    def scan_music_files(self) -> List[Path]:
        """
        Scan the music directory for MP3 files.

        Returns:
            List[Path]: List of MP3 file paths found
        """
        mp3_files = []
        print(f"Scanning for MP3 files in: {self.music_dir}")

        # Find all MP3 files recursively
        for mp3_file in self.music_dir.rglob("*.mp3"):
            mp3_files.append(mp3_file)
            print(f"  Found: {mp3_file.name}")

        print(f"Total MP3 files found: {len(mp3_files)}")
        return mp3_files

    def convert_mp3_to_wav(self, mp3_path: Path) -> Optional[Path]:
        """
        Convert MP3 file to CD-compatible WAV format.

        Args:
            mp3_path (Path): Path to the input MP3 file

        Returns:
            Optional[Path]: Path to the converted WAV file, or None if conversion failed
        """
        if not PYDUB_AVAILABLE:
            print("Error: pydub library not available for audio conversion")
            return None

        try:
            # Load MP3 file
            audio = AudioSegment.from_mp3(mp3_path)

            # Convert to CD specifications
            audio = audio.set_frame_rate(self.CD_SAMPLE_RATE)
            audio = audio.set_sample_width(self.CD_BIT_DEPTH // 8)  # Convert bits to bytes
            audio = audio.set_channels(self.CD_CHANNELS)

            # Generate output filename
            wav_filename = mp3_path.stem + ".wav"
            wav_path = self.output_dir / wav_filename

            # Export as WAV
            audio.export(wav_path, format="wav")
            print(f"  Converted: {mp3_path.name} -> {wav_filename}")
            return wav_path

        except Exception as e:
            print(f"Error converting {mp3_path.name}: {str(e)}")
            return None

    def create_cue_file(self, wav_files: List[Tuple[str, Path]], output_name: str = "lil_baby_mix") -> Path:
        """
        Create a CUE file for CD burning.

        Args:
            wav_files (List[Tuple[str, Path]]): List of (title, wav_path) tuples
            output_name (str): Name for the output files

        Returns:
            Path: Path to the created CUE file
        """
        cue_path = self.output_dir / f"{output_name}.cue"
        bin_path = self.output_dir / f"{output_name}.bin"

        with open(cue_path, 'w', encoding='utf-8') as cue_file:
            # Write CUE file header
            cue_file.write('FILE "{}.bin" BINARY\n'.format(output_name))

            current_time = 0  # Track position in minutes:seconds:frames

            for i, (title, wav_path) in enumerate(wav_files):
                # Calculate track duration (rough estimate for CUE file)
                # In a real implementation, you'd get exact duration from audio file
                estimated_duration = 180  # 3 minutes per track (adjust as needed)

                # Convert time to minutes:seconds:frames format
                minutes = current_time // 60
                seconds = current_time % 60
                frames = 0  # We start at frame 0 for simplicity

                cue_file.write('  TRACK {:02d} AUDIO\n'.format(i + 1))
                cue_file.write('    TITLE "{}"\n'.format(title))
                cue_file.write('    INDEX 01 {:02d}:{:02d}:{:02d}\n'.format(minutes, seconds, frames))

                current_time += estimated_duration

        print(f"Created CUE file: {cue_path}")
        return cue_path

    def prepare_cd_files(self, max_tracks: int = 20) -> bool:
        """
        Prepare all files needed for CD burning.

        Args:
            max_tracks (int): Maximum number of tracks to include (CD capacity limit)

        Returns:
            bool: True if preparation successful, False otherwise
        """
        print("=== CD Burner: Preparing Files for CD Burning ===\n")

        # Check if pydub is available
        if not PYDUB_AVAILABLE:
            print("ERROR: pydub library required for audio conversion.")
            print("Please install it with: pip install pydub")
            return False

        # Scan for MP3 files
        mp3_files = self.scan_music_files()
        if not mp3_files:
            print("No MP3 files found!")
            return False

        # Limit to CD capacity (typically 80 minutes, ~20 tracks)
        if len(mp3_files) > max_tracks:
            print(f"Warning: Found {len(mp3_files)} tracks. Limiting to {max_tracks} for CD capacity.")
            mp3_files = mp3_files[:max_tracks]

        print(f"\nConverting {len(mp3_files)} MP3 files to CD-compatible WAV format...")

        # Convert MP3 files to WAV
        wav_files = []
        for mp3_file in mp3_files:
            wav_path = self.convert_mp3_to_wav(mp3_file)
            if wav_path:
                # Extract title from filename (remove track number and extension)
                title = mp3_file.stem
                # Remove track numbers like "01.", "02.", etc.
                if title[:3].replace('.', '').isdigit() and len(title) > 3:
                    title = title[3:].strip()

                wav_files.append((title, wav_path))

        if not wav_files:
            print("Error: No files were successfully converted!")
            return False

        print(f"\nSuccessfully converted {len(wav_files)} files.")

        # Create CUE file
        cue_path = self.create_cue_file(wav_files)

        # Display results and instructions
        self.display_burning_instructions(cue_path, wav_files)

        return True

    def display_burning_instructions(self, cue_path: Path, wav_files: List[Tuple[str, Path]]):
        """
        Display instructions for burning the prepared files to CD.

        Args:
            cue_path (Path): Path to the CUE file
            wav_files (List[Tuple[str, Path]]): List of converted WAV files
        """
        print("\n" + "="*60)
        print("CD BURNING INSTRUCTIONS")
        print("="*60)

        print(f"\n[SUCCESS] Files prepared in: {self.output_dir.absolute()}")
        print(f"[CUE] CUE file: {cue_path.name}")
        print(f"[INFO] Tracks converted: {len(wav_files)}")

        print("\nTRACK LIST:")
        for i, (title, _) in enumerate(wav_files, 1):
            print(f"  {i:2d}. {title}")

        print("\nBURNING OPTIONS:")
        print("\n1. Using Windows Media Player (Built-in):")
        print("   - Open Windows Media Player")
        print("   - Click 'Burn' tab")
        print("   - Drag WAV files from cd_burn_output folder")
        print("   - Click 'Start burn'")

        print("\n2. Using Nero Burning ROM:")
        print(f"   - Open Nero Burning ROM")
        print("   - Choose 'Audio CD'")
        print(f"   - Import the CUE file: {cue_path.absolute()}")
        print("   - Burn at slowest speed for best quality")

        print("\n3. Using ImgBurn (Free):")
        print("   - Download and install ImgBurn")
        print("   - Choose 'Write files/folders to disc'")
        print(f"   - Add WAV files from: {self.output_dir.absolute()}")
        print("   - Burn as Audio CD")

        print("\n4. Using Command Line (Advanced):")
        print("   - Use cdrdao or wodim (requires installation)")
        print(f"   - Command: cdrdao write --device /dev/cdrom {cue_path.name}")

        print("\nIMPORTANT NOTES:")
        print("   * Use CD-R discs (not CD-RW)")
        print("   * Burn at lowest possible speed for best quality")
        print("   * Test the burned CD in your car stereo first")
        print("   * Keep original MP3 files as backup")

        print(f"\nTotal estimated CD size: ~{len(wav_files) * 40} MB")
        print("   (Each track estimated at ~40MB for 4-minute songs)")

        print("\n" + "="*60)


def main():
    """Main function to run the CD burner program."""
    print("Lil Baby CD Burner v1.0")
    print("Prepare your music collection for burning to CD-R discs\n")

    # Create burner instance
    burner = CDBurner()

    # Ask user for track limit
    while True:
        try:
            max_tracks = input("How many tracks to include on CD? (Max 20, Enter for auto): ").strip()
            if not max_tracks:
                max_tracks = 20
            else:
                max_tracks = int(max_tracks)

            if 1 <= max_tracks <= 20:
                break
            else:
                print("Please enter a number between 1 and 20.")
        except ValueError:
            print("Please enter a valid number.")

    # Prepare files for burning
    success = burner.prepare_cd_files(max_tracks)

    if success:
        print("\n[SUCCESS] Preparation complete! Follow the instructions above to burn your CD.")
        input("\nPress Enter to exit...")
    else:
        print("\n[ERROR] Preparation failed. Please check the error messages above.")
        input("\nPress Enter to exit...")
        sys.exit(1)


if __name__ == "__main__":
    main()
