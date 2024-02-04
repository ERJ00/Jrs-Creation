import json
import tkinter as tk
from tkinter import filedialog
import os

# Get the absolute path to the script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(script_dir, '../assets/data/data.json')

def create_file_data(file_paths):
    file_data = []

    for file_path in file_paths:
        file_name = file_path.split("/")[-1]  # Extracting file name from the path
        category = file_name.split(".")[-1]  # Extracting file extension as category

        file_info = {
            "id": len(file_data) + 1,  # Assigning an ID based on the number of files processed
            "fileName": file_name,
            "category": category
        }

        file_data.append(file_info)

    return file_data

def export_to_json(file_data):
    with open(json_path, 'w') as json_file:
        json.dump(file_data, json_file, indent=2)
        print("Data exported to", json_path)

def browse_files():
    file_paths = filedialog.askopenfilenames(title="Select files", filetypes=[("All files", "*.*")])
    if file_paths:
        data = create_file_data(file_paths)
        export_to_json(data)

# Create the main application window
app = tk.Tk()
app.title("File Selection GUI")

# Create and configure the Browse button
browse_button = tk.Button(app, text="Browse Files", command=browse_files)
browse_button.pack(pady=20)

# Run the main event loop
app.mainloop()
