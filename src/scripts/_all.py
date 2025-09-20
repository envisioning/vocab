import subprocess
import sys

def run_scripts(script_paths):
    """
    Run multiple Python scripts in sequence.
    
    Args:
        script_paths (list): List of file paths to Python scripts to run
    """
    for script in script_paths:
        try:
            # Run each script using subprocess
            result = subprocess.run([sys.executable, script], 
                                    capture_output=True, 
                                    text=True, 
                                    check=True)
            
            # Print output of each script
            print(f"Output of {script}:")
            print(result.stdout)
        
        except subprocess.CalledProcessError as e:
            # Handle any errors that occur when running scripts
            print(f"Error running {script}:")
            print(e.stderr)
            # Optionally, you can choose to stop further script execution
            # break

def main():
    # List of scripts to run in order
    scripts_to_run = [
        'src/scripts/flux-image-generation.py',
        'src/scripts/local-compress_images.py',
        'src/scripts/llm-generality.py',
        'src/scripts/llm-names.py',
        'src/scripts/llm-years.py',
        'src/scripts/local-flashcards.py',
        'src/scripts/local-polyhierarchy.py'
    ]
    
    run_scripts(scripts_to_run)

if __name__ == '__main__':
    main()
