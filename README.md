**LIVE SITE:**  [https://pawsense-ai.onrender.com](https://pawsense-ai.onrender.com)
# PAWSENSE AI - Pet Breed Identifier

This project contains a React frontend for uploading pet images and a Node.js Express backend that handles image uploads, calls the HuggingFace inference API, and returns predictions.

## Folder Structure

```
/pet-breed-identifier
  /client   # React Frontend (image upload, preview, result)
  /server   # Express Backend (predict route, HuggingFace API call)
```

## Features

- Upload an image and preview it in the browser
- Submit the image to the backend for prediction
- Backend handles image upload with multer
- Backend sends image to HuggingFace API (microsoft/resnet-50)
- Returns top predicted label to the frontend
- Loading spinner shown during prediction

## Setup

- Run both client and server locally
- You will need a HuggingFace API key for predictions
