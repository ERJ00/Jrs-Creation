from PIL import Image, ImageTk
import tkinter as tk
from tkinter import filedialog, messagebox
import os
import imageio  # Required for handling MP4 and GIF files

def reduce_image(input_path, output_path, max_size_kb, max_resolution):
    try:
        # Open the image file
        original_image = Image.open(input_path)

        # Convert image to RGB mode if it has an alpha channel (transparency)
        if original_image.mode == "RGBA":
            original_image = original_image.convert("RGB")

        # Calculate the compression ratio based on the desired file size
        original_size_kb = os.path.getsize(input_path) / 1024.0
        compression_ratio = max_size_kb / original_size_kb

        # Calculate the resizing ratio based on the desired resolution
        width, height = original_image.size
        resolution_ratio = max_resolution / max(width, height)

        # Apply both compression and resizing
        new_width = max(int(width * compression_ratio * resolution_ratio), 1)
        new_height = max(int(height * compression_ratio * resolution_ratio), 1)
        resized_image = original_image.resize((new_width, new_height), resample=Image.BICUBIC)

        # Save the resized image with reduced file size
        resized_image.save(output_path, quality=85)  # Adjust quality if needed

        print(f"Image successfully resized and saved to {output_path}")

    except Exception as e:
        print(f"Error: {e}")

def extract_video_thumbnail(input_path, output_folder, max_size_kb):
    try:
        # Load the video using imageio
        video = imageio.get_reader(input_path)

        # Create output folder if it doesn't exist
        os.makedirs(output_folder, exist_ok=True)

        # Calculate the compression ratio based on the desired file size
        original_size_kb = os.path.getsize(input_path) / 1024.0
        compression_ratio = max_size_kb / original_size_kb

        # Extract and save the first frame as a thumbnail
        first_frame = next(iter(video))
        thumbnail = Image.fromarray(first_frame).convert("RGB")

        # Resize the thumbnail while maintaining its aspect ratio
        width, height = thumbnail.size
        new_width = max(int(width * compression_ratio), 1)
        new_height = max(int(height * compression_ratio), 1)
        thumbnail = thumbnail.resize((new_width, new_height), resample=Image.BICUBIC)

        # Save the thumbnail with the same name as the video but with a different extension
        thumbnail_name = f"{os.path.splitext(os.path.basename(input_path))[0]}_thumbnail.jpg"
        thumbnail_path = os.path.join(output_folder, thumbnail_name)
        thumbnail.save(thumbnail_path, quality=85)  # Adjust quality if needed

        print(f"Thumbnail successfully extracted and saved to {output_folder}")

    except Exception as e:
        print(f"Error: {e}")

def process_files(root_folder, output_folder, max_size_kb, max_resolution):
    for folder_name, _, files in os.walk(root_folder):
        for file_name in files:
            input_path = os.path.join(folder_name, file_name)
            relative_path = os.path.relpath(input_path, root_folder)
            output_path = os.path.join(output_folder, relative_path)

            os.makedirs(os.path.dirname(output_path), exist_ok=True)

            if file_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                reduce_image(input_path, output_path, max_size_kb, max_resolution)
            elif file_name.lower().endswith('.mp4'):
                extract_video_thumbnail(input_path, output_folder, max_size_kb)
            elif file_name.lower().endswith('.gif'):
                extract_video_thumbnail(input_path, output_folder, max_size_kb)

class ImageResizerApp:
    def __init__(self, master):
        self.master = master
        self.master.title("File Processor")

        self.create_widgets()

    def create_widgets(self):
        self.label_root_folder = tk.Label(self.master, text="Select Root Folder:")
        self.label_root_folder.pack(pady=10)

        self.button_browse_root = tk.Button(self.master, text="Browse", command=self.browse_root)
        self.button_browse_root.pack(pady=5)

        self.label_output_folder = tk.Label(self.master, text="Select Output Folder:")
        self.label_output_folder.pack(pady=10)

        self.button_browse_output = tk.Button(self.master, text="Browse", command=self.browse_output)
        self.button_browse_output.pack(pady=5)

        self.label_max_size_kb = tk.Label(self.master, text="Max Size (KB):")
        self.label_max_size_kb.pack(pady=10)

        self.entry_max_size_kb = tk.Entry(self.master)
        self.entry_max_size_kb.pack(pady=5)

        self.label_max_resolution = tk.Label(self.master, text="Max Resolution:")
        self.label_max_resolution.pack(pady=10)

        self.entry_max_resolution = tk.Entry(self.master)
        self.entry_max_resolution.pack(pady=5)

        self.button_process = tk.Button(self.master, text="Process Files", command=self.process_files)
        self.button_process.pack(pady=10)

    def browse_root(self):
        self.root_folder = filedialog.askdirectory(title="Select Root Folder")

    def browse_output(self):
        self.output_folder = filedialog.askdirectory(title="Select Output Folder")

    def process_files(self):
        if hasattr(self, 'root_folder') and hasattr(self, 'output_folder'):
            max_size_kb = int(self.entry_max_size_kb.get()) if self.entry_max_size_kb.get().isdigit() else 0
            max_resolution = int(self.entry_max_resolution.get()) if self.entry_max_resolution.get().isdigit() else 0

            process_files(self.root_folder, self.output_folder, max_size_kb, max_resolution)
            messagebox.showinfo("Process Complete", "File processing completed successfully.")
        else:
            messagebox.showwarning("Missing Folders", "Please select both the root and output folders.")

if __name__ == "__main__":
    root = tk.Tk()
    app = ImageResizerApp(root)
    root.mainloop()
