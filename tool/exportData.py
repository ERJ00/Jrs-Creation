import json
import tkinter as tk
from tkinter import filedialog
import os

# Get the absolute path to the script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(script_dir, '../assets/data/data.json') # change this where you want to save the json file

def get_file_type(file_extension):
    # Map specific file extensions to desired types
    extension_to_type = {
        '.gif': 'png',
        '.mp4': 'mp4',
        '.png': 'png',
        '.jpg': 'png',
        '.jpeg': 'png'
        # Add more mappings as needed
    }
    # If not explicitly mapped, treat all other file extensions as 'png'
    return extension_to_type.get(file_extension.lower(), 'png')

def create_file_data(root_folder):
    file_data = []

    for folder_path, _, file_names in os.walk(root_folder):
        folder_name = os.path.basename(folder_path)

        for file_name in file_names:
            file_path = os.path.join(folder_path, file_name)
            _, file_extension = os.path.splitext(file_name)
            file_type = get_file_type(file_extension)
            file_info = {
                "id": len(file_data) + 1,  # Assigning an ID based on the number of files processed
                "fileName": file_name,
                "category": folder_name,  # Storing the folder name as the category
                "type": file_type  # Storing the mapped file type
            }
            file_data.append(file_info)

    return file_data

def export_to_json(file_data):
    with open(json_path, 'w') as json_file:
        json.dump(file_data, json_file, indent=2)
        print("Data exported to", json_path)

def browse_root_folder():
    root_folder = filedialog.askdirectory(title="Select the root folder")
    if root_folder:
        data = create_file_data(root_folder)
        export_to_json(data)

# Create the main application window
app = tk.Tk()
app.title("Folder Selection GUI")

# Create and configure the Browse button
browse_button = tk.Button(app, text="Browse Root Folder", command=browse_root_folder)
browse_button.pack(pady=20)

# Run the main event loop
app.mainloop()
