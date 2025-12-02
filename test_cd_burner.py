#!/usr/bin/env python3
"""
Simple test script for CD Burner to verify basic functionality.
"""

from pathlib import Path
from cd_burner import CDBurner

def test_basic_functionality():
    """Test basic functionality without full audio conversion."""
    print("Testing CD Burner basic functionality...")

    # Create burner instance
    burner = CDBurner()

    # Test file scanning
    mp3_files = burner.scan_music_files()

    if mp3_files:
        print(f"[SUCCESS] Found {len(mp3_files)} MP3 files")
        print("Sample files:")
        for i, mp3_file in enumerate(mp3_files[:5]):  # Show first 5
            print(f"  {i+1}. {mp3_file.name}")
        if len(mp3_files) > 5:
            print(f"  ... and {len(mp3_files) - 5} more")

        # Test output directory creation
        print(f"[INFO] Output directory: {burner.output_dir}")
        print(f"[INFO] Output directory exists: {burner.output_dir.exists()}")

        print("\n[SUCCESS] Basic functionality test passed!")
        return True
    else:
        print("[ERROR] No MP3 files found")
        return False

if __name__ == "__main__":
    test_basic_functionality()
