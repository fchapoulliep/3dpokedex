import os
import shutil

# Define the directory containing the files
directory = os.path.dirname(os.path.abspath(__file__))

# Iterate over the files in the directory
for filename in os.listdir(directory):
    # Check if the file is a .glb file
    if filename.endswith(".glb"):
        # Get the name without the extension
        name_without_ext = os.path.splitext(filename)[0]
        # Check if a directory with the same name exists
        target_dir = os.path.join(directory, name_without_ext)
        if os.path.isdir(target_dir):
            # Move the .glb file into the directory
            shutil.move(os.path.join(directory, filename), target_dir)
