'''import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import cv2
import matplotlib.pyplot as plt

# Load DeepLabV3 model (pre-trained on COCO dataset)
model_url = "https://tfhub.dev/tensorflow/deeplabv3/1"
model = hub.load(model_url)

# Class labels from COCO dataset for segmentation
# 15 corresponds to 'person' (human body)
CLASSES = {
    0: 'background',
    1: 'person',
    2: 'bicycle',
    3: 'car',
    4: 'motorcycle',
    5: 'airplane',
    6: 'bus',
    7: 'train',
    8: 'truck',
    9: 'boat',
    10: 'traffic light',
    11: 'fire hydrant',
    12: 'street sign',
    13: 'dog',
    14: 'cat',
    15: 'person', # Specifically focus on people (clothing is part of the person class)
    # Add other classes as needed
}

# Function to process image and segment clothing
def segment_clothing(image_path):
    # Load image
    image = cv2.imread(image_path)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Resize image to fit model input size
    input_size = (512, 512)  # Typical input size for DeepLabV3
    image_resized = cv2.resize(image_rgb, input_size)
    image_array = np.array(image_resized, dtype=np.uint8)

    # Expand dimensions and normalize
    input_tensor = tf.convert_to_tensor(image_array)
    input_tensor = input_tensor[tf.newaxis, ...]

    # Run the segmentation model
    model_output = model(input_tensor)
    prediction = model_output['default'][0].numpy()  # (Height, Width, Classes)
    prediction = np.argmax(prediction, axis=-1)  # Get the class with highest probability for each pixel

    # Mask the clothing (class 'person')
    clothing_mask = prediction == 15  # 'person' class in COCO is 15

    # Apply the mask to the original image to isolate clothing
    clothing = np.zeros_like(image_rgb)
    clothing[clothing_mask] = image_rgb[clothing_mask]

    return clothing, prediction

# Function to display segmented clothing
def display_segmented_image(clothing, original_image):
    plt.figure(figsize=(10, 10))
    
    # Display original image
    plt.subplot(1, 2, 1)
    plt.imshow(original_image)
    plt.title('Original Image')
    plt.axis('off')
    
    # Display clothing segmentation
    plt.subplot(1, 2, 2)
    plt.imshow(clothing)
    plt.title('Clothing Segmentation')
    plt.axis('off')
    
    plt.show()

# Example usage
image_path = "../../testroseimage"  # Replace with your image path
clothing, prediction = segment_clothing(image_path)

# Load the original image
original_image = cv2.imread(image_path)
original_image_rgb = cv2.cvtColor(original_image, cv2.COLOR_BGR2RGB)

# Display results
display_segmented_image(clothing, original_image_rgb)'''






'''
import cv2
import numpy as np
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import requests
import sys

# Function to fetch and decode an image from a URL into OpenCV
def fetch_image_from_url(image_url):
    response = requests.get(image_url)
    
    # Check if the request was successful (status code 200 means OK)
    if response.status_code == 200:
        # Convert the byte content to a numpy array
        img_array = np.array(bytearray(response.content), dtype=np.uint8)
        
        # Decode the numpy array into an OpenCV image (this is in BGR format by default)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        
        return img
    else:
        print(f"Error: Failed to fetch image, status code {response.status_code}")
        return None

# Function to get the dominant colors from an image
def get_dominant_colors(image_url, k=5):
    # Fetch image from URL
    img = fetch_image_from_url(image_url)
    
    if img is None:
        return []

    # Convert BGR image to RGB
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Reshape the image to a 2D array of pixels
    pixels = img.reshape((-1, 3))

    # Perform k-means clustering to find dominant colors
    kmeans = KMeans(n_clusters=k)
    kmeans.fit(pixels)

    # Get the RGB values of the clusters (dominant colors)
    dominant_colors = kmeans.cluster_centers_.astype(int)
    
    return dominant_colors

# Function to generate a full color palette from a batch of images
def generate_palette_from_images(image_urls, k=5):
    all_colors = []

    # Iterate over all provided image URLs
    for image_url in image_urls:
        print(f"Processing {image_url}...")
        
        # Get dominant colors from the current image URL
        dominant_colors = get_dominant_colors(image_url, k)
        all_colors.extend(dominant_colors)

    # Perform k-means clustering again on the full set of colors
    all_colors = np.array(all_colors)
    kmeans = KMeans(n_clusters=k)
    kmeans.fit(all_colors)

    # Get final palette (the dominant colors from all images)
    final_palette = kmeans.cluster_centers_.astype(int)
    
    return final_palette

# Function to display the color palette
def display_palette(palette):
    plt.figure(figsize=(8, 2))
    plt.imshow([palette])
    plt.axis('off')
    plt.show()

# Example usage
# List of image URLs
image_urls = sys.argv[1:]

# Generate the color palette from the list of URLs
palette = generate_palette_from_images(image_urls, k=5)
display_palette(palette)

print("python file finished running")'''

import cv2
import numpy as np
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import requests
import sys
from io import BytesIO
import base64

# Function to fetch and decode an image from a URL into OpenCV
def fetch_image_from_url(image_url):
    response = requests.get(image_url)
    
    # Check if the request was successful (status code 200 means OK)
    if response.status_code == 200:
        # Convert the byte content to a numpy array
        img_array = np.array(bytearray(response.content), dtype=np.uint8)
        
        # Decode the numpy array into an OpenCV image (this is in BGR format by default)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        
        return img
    else:
        #print(f"Error: Failed to fetch image, status code {response.status_code}")
        return None

# Function to get the dominant colors from an image
def get_dominant_colors(image_url, k=5):
    # Fetch image from URL
    img = fetch_image_from_url(image_url)
    
    if img is None:
        return []

    # Convert BGR image to RGB
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Reshape the image to a 2D array of pixels
    pixels = img.reshape((-1, 3))

    # Perform k-means clustering to find dominant colors
    kmeans = KMeans(n_clusters=k)
    kmeans.fit(pixels)

    # Get the RGB values of the clusters (dominant colors)
    dominant_colors = kmeans.cluster_centers_.astype(int)
    
    return dominant_colors

# Function to generate a full color palette from a batch of images
def generate_palette_from_images(image_urls, k=5):
    all_colors = []

    # Iterate over all provided image URLs
    for image_url in image_urls:
        
        # Get dominant colors from the current image URL
        dominant_colors = get_dominant_colors(image_url, k)
        all_colors.extend(dominant_colors)

    # Perform k-means clustering again on the full set of colors
    all_colors = np.array(all_colors)
    kmeans = KMeans(n_clusters=k)
    kmeans.fit(all_colors)

    # Get final palette (the dominant colors from all images)
    final_palette = kmeans.cluster_centers_.astype(int)
    
    return final_palette

# Function to save the color palette as an image in memory and return it as base64
def save_palette_as_base64(palette):
    # Convert the palette to an image (you can use matplotlib to save it as a PNG image)
    fig, ax = plt.subplots(figsize=(8, 2))
    ax.imshow([palette])
    ax.axis('off')

    #plt.show()
    
    # Save the figure to a BytesIO object instead of a file
    buf = BytesIO()
    plt.savefig(buf, format="png", bbox_inches='tight', pad_inches=0)
    buf.seek(0)
    
    # Convert the image to base64
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    
    return img_base64

# Example usage
# List of image URLs (this will be passed from the client)
image_urls = sys.argv[1:]
'''image_urls = [
"https://res.cloudinary.com/stylesnap/image/upload/w_300,h_600,c_fill/cslqmzuxhdc5xifrjs5w",
"https://res.cloudinary.com/stylesnap/image/upload/w_300,h_600,c_fill/t13jkadsqinadawugid5",
"https://res.cloudinary.com/stylesnap/image/upload/w_300,h_600,c_fill/ucxlw3ckgk10ks1zwtht",
"https://res.cloudinary.com/stylesnap/image/upload/w_300,h_600,c_fill/dokhxtyh1t27pflwo0vj"]'''

# Generate the color palette from the list of URLs
palette = generate_palette_from_images(image_urls, k=5)

# Convert the palette image to base64
palette_base64 = save_palette_as_base64(palette)

# Now, send the base64 string back to the client (this is a simulation)
# In a real Flask/Django app, you'd return the base64 string in the response.
print(palette_base64)