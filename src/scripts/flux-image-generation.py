import requests
import os
import frontmatter as fm
from pathlib import Path
from config import FLUX_API_KEY

def generate_image(prompt, output_path):
    print(f"\n🎨 Generating image with Flux API...")
    print(f"📝 Prompt: {prompt}")
    
    api_key = FLUX_API_KEY
    url = "https://api.segmind.com/v1/flux-1.1-pro"

    data = {
        'seed': random.randint(0, 1000),
        'width': 672,
        'height': 1024,
        'prompt': prompt,
        'aspect_ratio': "2:3",
        'output_format': "webp",
        'output_quality': 90,
        'safety_tolerance': 3,
        'prompt_upsampling': False
    }

    headers = {
        'x-api-key': api_key,
        'Content-Type': 'application/json'  # Added this header
    }
    
    print("📡 Sending request to Flux API...")
    response = requests.post(url, json=data, headers=headers)  # Changed 'data=' to 'json='
    
    if response.status_code == 200:
        with open(output_path, 'wb') as f:
            f.write(response.content)
        print(f"✅ Success! Image saved to: {output_path}")
    else:
        print(f"❌ Error generating image. Status code: {response.status_code}")
        print("Full API Response:")
        print(f"Headers: {dict(response.headers)}")
        print(f"Content: {response.text}")
        print(f"Request Data: {data}")

def main():
    # Define paths
    content_dir = Path("../content")
    images_dir = Path("../../public/images")
    images_dir.mkdir(parents=True, exist_ok=True)

    # Find all markdown files
    md_files = content_dir.glob("*.md")

    for md_file in md_files:
        # Read frontmatter
        post = fm.load(md_file)
        slug = post.get('slug')
        title = post.get('title')
        summary = post.get('summary')

        if not slug:
            print(f"Skipping {md_file}: No slug found")
            continue

        # Check if image already exists
        image_path = images_dir / f"{slug}.webp"
        if image_path.exists():
            print(f"Image already exists for {slug}")
            continue

        # Generate prompt using title and summary
        base_prompt = "Abstract minimalist creative shiny illustration of"
        prompt = f"{base_prompt} {title}. {summary}"

        # Generate and save image
        generate_image(prompt, image_path)

if __name__ == "__main__":
    main()
