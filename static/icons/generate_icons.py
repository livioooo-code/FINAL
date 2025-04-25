#!/usr/bin/env python3
"""
Skrypt do generowania ikon PWA w różnych rozmiarach.
Wymaga biblioteki Pillow (PIL).

Użycie:
    python generate_icons.py ścieżka/do/obrazu.png
"""

import os
import sys
from PIL import Image

# Rozmiary ikon PWA
ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

def generate_icons(source_image_path):
    # Sprawdź czy plik istnieje
    if not os.path.exists(source_image_path):
        print(f"Błąd: Plik {source_image_path} nie istnieje.")
        return False
    
    try:
        # Otwórz obrazek źródłowy
        img = Image.open(source_image_path)
        
        # Pobierz katalog, w którym znajduje się ten skrypt
        output_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Generuj ikony w różnych rozmiarach
        for size in ICON_SIZES:
            # Utwórz kopię obrazka i zmień rozmiar
            resized_img = img.copy()
            resized_img.thumbnail((size, size), Image.LANCZOS)
            
            # Zapisz ikonę
            output_path = os.path.join(output_dir, f"icon-{size}x{size}.png")
            resized_img.save(output_path)
            print(f"Wygenerowano ikonę {size}x{size} w {output_path}")
        
        return True
    except Exception as e:
        print(f"Błąd podczas generowania ikon: {e}")
        return False

if __name__ == "__main__":
    # Sprawdź argumenty
    if len(sys.argv) != 2:
        print("Użycie: python generate_icons.py ścieżka/do/obrazu.png")
        sys.exit(1)
    
    # Pobierz ścieżkę do obrazka źródłowego
    source_image = sys.argv[1]
    
    # Generuj ikony
    if generate_icons(source_image):
        print("Zakończono generowanie ikon.")
    else:
        print("Wystąpił błąd podczas generowania ikon.")
        sys.exit(1)