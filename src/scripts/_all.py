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
        'flux-image-generation.py',
        'local-compress_images.py',
        'llm-generality.py',
        'llm-names.py',
        'llm-years.py',
        'local-flashcards.py',
        'local-polyhierarchy.py'
    ]
    
    run_scripts(scripts_to_run)

if __name__ == '__main__':
    main()
