The program is a Python application designed to handle image and video files by resizing images 
to reduce their file size and extracting thumbnails from videos. The program uses the Tkinter library 
for the graphical user interface (GUI) and the Pillow library (PIL fork) for image processing. 
Additionally, it utilizes the imageio library for handling MP4 and GIF files.

How to Use:

1. Select Root Folder:
   - Click the "Browse" button next to "Select Root Folder" to choose the root folder (containing the sub folder and files within) you want to process.

2. Select Output Folder:
   - Click the "Browse" button next to "Select Output Folder" to choose the folder where the processed files will be saved.

3. Max Size (KB):
   - Enter the maximum desired file size in kilobytes (KB). This parameter determines the compression level for image files.

4. Max Resolution:
   - Enter the maximum resolution for the images or thumbnails. This parameter is relevant for both image compression and video thumbnail extraction.

5. Process Files:
   - After configuring the settings, click the "Process Files" button to start the file processing.

6. Processing Status:
   - The program will display messages in the console indicating the progress and success of the file processing.

7. Completion Message:
   - Once the processing is complete, a message box will appear, indicating that the file processing has been completed successfully.

8. Note:
   - The program supports processing of PNG, JPG, JPEG, MP4, and GIF files. Images are resized and compressed, 
while video thumbnails are extracted and resized. The output files are saved in the specified output folder.

9. Error Handling:
   - If any errors occur during the processing, error messages will be displayed in the console, providing information about the encountered issues.

10. Close the Application:
   - Close the application window when done.

This program is particularly useful for efficiently managing large collections of images and videos, 
allowing users to reduce file sizes and create thumbnails with specified parameters.

also this is the sample data struction for the root directory:

	root directory folder
	  -sub folder 1
	     -(files) 
	  -sub folder 2
	     -(files) 
	  -sub folder 3
	     -(files) 
