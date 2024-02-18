This program is a simple Python script that utilizes the tkinter library to create a graphical user interface (GUI) for 
selecting a root folder containing various files. The script then processes the files within the selected folder, 
extracts relevant information such as file name, category (based on the folder name), 
and file type (mapped from file extensions), and exports this data to a JSON file.

Here's a step-by-step explanation of how to use the program:

1. **Browse Root Folder Button:**
   - When you run the script, a GUI window titled "Folder Selection GUI" will appear.
   - Click on the "Browse Root Folder" button.
   - A file dialog will open, allowing you to select the root folder containing the files you want to process.

2. **File Processing:**
   - The script then traverses through the selected folder and its subfolders using `os.walk`.
   - For each file found, it extracts the file name, determines the category (based on the folder name), 
and maps the file type based on the file extension.

3. **Data Structure:**
   - The extracted information is stored in a list of dictionaries called `file_data`.
   - Each dictionary represents a file and contains fields such as "id," "fileName," "category," and "type."

4. **JSON Export:**
   - After processing all files, the script exports the collected data to a JSON file named `data.json`.
   - The JSON file is created in the script's directory under the path `../assets/data/data.json`.

5. **Console Output:**
   - The script also prints a message indicating that the data has been exported to the JSON file.

Note: The file type is determined by mapping specific file extensions to desired types using 
the `get_file_type` function. If a file extension is not explicitly mapped, it is treated as a 'png' file type.

Make sure to customize the file extension mappings in the `get_file_type` function according to your specific needs. 
You can add more mappings if necessary.

To use the script effectively, ensure you have the necessary libraries installed 
(`tkinter` is part of Python's standard library, so no additional installation is needed).

also this is the sample data struction for the root directory:

	root directory folder
	  -sub folder 1
	     -(files) 
	  -sub folder 2
	     -(files) 
	  -sub folder 3
	     -(files) 