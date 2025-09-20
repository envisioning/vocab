import subprocess
import sys
import logging
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('scripts_execution.log', mode='a')
    ]
)

logger = logging.getLogger(__name__)

def run_scripts(script_paths):
    """
    Run multiple Python scripts in sequence.

    Args:
        script_paths (list): List of file paths to Python scripts to run
    """
    logger.info("=" * 60)
    logger.info("Starting batch script execution")
    logger.info(f"Total scripts to run: {len(script_paths)}")
    logger.info("=" * 60)

    for i, script in enumerate(script_paths, 1):
        logger.info(f"[{i}/{len(script_paths)}] Starting execution of: {script}")

        try:
            # Record start time
            start_time = time.time()

            # Run each script using subprocess
            result = subprocess.run([sys.executable, script],
                                    capture_output=True,
                                    text=True,
                                    check=True)

            # Calculate execution time
            execution_time = time.time() - start_time

            # Log successful completion
            logger.info(f"[{i}/{len(script_paths)}] ✓ {script} completed successfully in {execution_time:.2f}s")

            # Print output of each script with better formatting
            if result.stdout.strip():
                logger.info(f"Output of {script}:")
                # Clean up the output and log line by line
                for line in result.stdout.strip().split('\n'):
                    if line.strip():
                        logger.info(f"  {line}")
            else:
                logger.info(f"No stdout output from {script}")

        except subprocess.CalledProcessError as e:
            # Calculate execution time even for failures
            execution_time = time.time() - start_time if 'start_time' in locals() else 0

            # Handle any errors that occur when running scripts
            logger.error(f"[{i}/{len(script_paths)}] ✗ {script} failed after {execution_time:.2f}s")
            logger.error(f"Return code: {e.returncode}")
            logger.error(f"stderr: {e.stderr.strip() if e.stderr else 'None'}")

            # Optionally, you can choose to stop further script execution
            # break

        except Exception as e:
            # Handle unexpected errors
            execution_time = time.time() - start_time if 'start_time' in locals() else 0
            logger.error(f"[{i}/{len(script_paths)}] ✗ {script} encountered unexpected error after {execution_time:.2f}s")
            logger.error(f"Error: {str(e)}")
            # break

def main():
    # Record overall start time
    overall_start_time = time.time()

    logger.info("Script execution started by user")

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

    logger.info(f"Script execution order: {', '.join(scripts_to_run)}")

    try:
        run_scripts(scripts_to_run)

        # Calculate total execution time
        total_time = time.time() - overall_start_time

        logger.info("=" * 60)
        logger.info("✓ All scripts completed successfully!")
        logger.info(f"Total execution time: {total_time:.2f} seconds")
        logger.info(f"Average time per script: {total_time/len(scripts_to_run):.2f} seconds")
        logger.info("=" * 60)

    except KeyboardInterrupt:
        total_time = time.time() - overall_start_time
        logger.warning("⚠ Script execution interrupted by user")
        logger.warning(f"Partial execution time: {total_time:.2f} seconds")
        logger.warning("Some scripts may not have completed")
        sys.exit(1)

    except Exception as e:
        total_time = time.time() - overall_start_time
        logger.error(f"✗ Unexpected error in main execution: {str(e)}")
        logger.error(f"Execution time before error: {total_time:.2f} seconds")
        sys.exit(1)

if __name__ == '__main__':
    main()
