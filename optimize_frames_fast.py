import cv2
import glob
import os
import time

input_dir = r"C:\Users\Tusha\learngen AI\public\thor-frames"
files = sorted(glob.glob(os.path.join(input_dir, "*.png")))

print(f"Optimizing {len(files)} frames for ultra-fast 60FPS smooth canvas rendering...")

start = time.time()
count = 0

for filepath in files:
    img = cv2.imread(filepath)
    if img is None:
        continue
    
    count += 1
    # Save as 85% Quality High-Speed WebP/JPG (Crisp 1080p/4K visual quality, ~90KB size)
    # Target resolution: 1920 x 1080 for crisp retina display
    resized = cv2.resize(img, (1920, 1080), interpolation=cv2.INTER_AREA)
    
    # Overwrite PNG with optimized crisp frame
    jpg_path = filepath.replace('.png', '.jpg')
    cv2.imwrite(jpg_path, resized, [int(cv2.IMWRITE_JPEG_QUALITY), 88])
    
    # Remove original heavy PNG
    if os.path.exists(filepath):
        os.remove(filepath)

print(f"SUCCESS! Processed {count} frames in {time.time() - start:.2f}s")
