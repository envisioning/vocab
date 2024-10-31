import logging
import sys
from pathlib import Path
from PIL import Image
import shutil

# Configure logging (similar to your classifier.py)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

# Constants
SOURCE_DIR = Path('../../public/images/articles/')
OUTPUT_DIR = Path('../../public/images/articles/small/')
QUALITY = 50  # Compression quality (0-100)
MAX_SIZE = 800  # Maximum width or height in pixels

def setup_directories():
    """Create output directory if it doesn't exist."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def get_unprocessed_images():
    """Get list of WEBP images that haven't been processed yet."""
    source_files = set(SOURCE_DIR.glob('*.webp'))
    existing_files = set(OUTPUT_DIR.glob('*.webp'))
    
    # Convert to filenames only for comparison
    existing_names = {f.name for f in existing_files}
    
    # Filter out already processed files
    unprocessed = [f for f in source_files if f.name not in existing_names]
    logging.info(f"Found {len(unprocessed)} unprocessed WEBP files")
    return unprocessed

def compress_image(source_path: Path):
    """Compress and scale a single WEBP image."""
    try:
        # Open image
        with Image.open(source_path) as img:
            # Calculate scaling
            width, height = img.size
            scale_factor = min(MAX_SIZE / width, MAX_SIZE / height, 1.0)
            
            if scale_factor < 1.0:
                new_width = int(width * scale_factor)
                new_height = int(height * scale_factor)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                logging.info(
                    f"Scaled {source_path.name}: "
                    f"{width}x{height} → {new_width}x{new_height}"
                )

            # Save compressed image
            output_path = OUTPUT_DIR / source_path.name
            img.save(
                output_path, 
                'WEBP', 
                quality=QUALITY, 
                method=6  # Highest compression method
            )
            
            # Log compression results
            original_size = source_path.stat().st_size / 1024  # KB
            compressed_size = output_path.stat().st_size / 1024  # KB
            reduction = ((original_size - compressed_size) / original_size) * 100
            
            logging.info(
                f"Compressed {source_path.name}: "
                f"{original_size:.1f}KB → {compressed_size:.1f}KB "
                f"({reduction:.1f}% reduction)"
            )
            
    except Exception as e:
        logging.error(f"Failed to compress {source_path.name}: {e}")

def main():
    """Main function to execute the script."""
    if not SOURCE_DIR.exists() or not SOURCE_DIR.is_dir():
        logging.error(f"Source directory '{SOURCE_DIR.resolve()}' does not exist or is not a directory.")
        sys.exit(1)

    setup_directories()
    unprocessed_images = get_unprocessed_images()
    
    if not unprocessed_images:
        logging.info("No new images to process.")
        return

    for image_path in unprocessed_images:
        compress_image(image_path)

    logging.info("Image compression completed.")

if __name__ == "__main__":
    main()