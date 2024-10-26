import requests
import os
import frontmatter as fm
from pathlib import Path
from config import FLUX_API_KEY, API_KEY
import random  # Add this import

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

def generate_image_prompt(title: str, summary: str) -> str:
    """Generate an optimized image prompt using OpenAI."""
    print("🤖 Generating optimized prompt with OpenAI...")
    
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    prompt = (
        "You are an expert at writing FLUX image prompts. "
        "Create a detailed, creative prompt for an abstract illustration based this concept:\n\n"
        "Avoid: words, realistic imagery.\n\n "
        f"Title: {title}\n"
        f"Summary: {summary}\n\n"
        "Return only the prompt text, nothing else. Focus on visual elements, style, and mood."
    )
    
    data = {
        "model": "gpt-4",
        "messages": [
            {"role": "system", "content": "You are an expert at writing image generation prompts."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }
    
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 200:
        image_prompt = response.json()['choices'][0]['message']['content'].strip()
        print(f"✨ Generated prompt: {image_prompt}")
        return image_prompt
    else:
        print(f"❌ Error generating prompt. Using fallback.")
        return f"Abstract minimalist creative illustration of {title}"

def main():
    # Define paths
    content_dir = Path("../content")
    images_dir = Path("../../public/images")
    images_dir.mkdir(parents=True, exist_ok=True)

    # Find all markdown files
    md_files = content_dir.glob("*.md")

    for md_file in md_files:
        # Use the markdown filename (without .md) for the image
        image_filename = md_file.stem + ".webp"
        image_path = images_dir / image_filename
        
        print(f"📄 Processing file: {md_file}")
        print(f"🖼️ Image path will be: {image_path}")

        # Read frontmatter
        post = fm.load(md_file)
        title = post.get('title')
        summary = post.get('summary')

        if image_path.exists():
            print(f"Image already exists for {image_filename}")
            continue

        # Generate prompt using title and summary
        image_prompt = generate_image_prompt(title, summary)
        
        # Generate and save image
        generate_image(image_prompt, image_path)

if __name__ == "__main__":
    main()
