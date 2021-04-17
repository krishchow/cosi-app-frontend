import React, { useState, useEffect, useCallback, useRef } from 'react'
import FormData from 'form-data'

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
const axios = require('axios').default;

function generateDownload(canvas, crop, cb, fileName) {
    if (!crop || !canvas) {
        return;
    }

    canvas.toBlob(
        (blob) => {
            let data = new FormData();

            data.append('image', blob, fileName);

            console.log("upload");
            console.log(fileName);

            axios.post('http://localhost:3001/upload', data, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                }
            })
                .then((response) => {
                    console.log(response);
                }).catch((error) => {
                    console.log(error);
                });
            cb();
        },
        'image/png',
        1
    );
}

export default function Upload() {
    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const fileRef = useRef(null);
    const [fileName, setFileName] = useState("");
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 / 1 });
    const [completedCrop, setCompletedCrop] = useState(null);

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setUpImg(reader.result));
            reader.readAsDataURL(e.target.files[0]);
            setFileName(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
        }
    };

    const clearImage = () => {
        setUpImg(null);
        setCompletedCrop(null);
        setCrop({ unit: '%', width: 30, aspect: 1 / 1 });
        fileRef.current.value = "";
        setFileName("");
    }

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;

        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
    }, [completedCrop]);

    return (
        <div className="App">
            <div>
                <input type="file" accept="image/*" onChange={onSelectFile} ref={fileRef} />
            </div>
            <br></br>
            <ReactCrop
                src={upImg}
                onImageLoaded={onLoad}
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
            />
            <div>
                <canvas 
                    ref={previewCanvasRef}
                    // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                    style={{
                        width: Math.round(completedCrop?.width ?? 0),
                        height: Math.round(completedCrop?.height ?? 0),
                        display: "none",
                    }}
                />
            </div>
            <input type="text" value={fileName} onChange={e => setFileName(e.target.value)}/><br></br>
            <button
                type="button"
                disabled={!completedCrop?.width || !completedCrop?.height}
                onClick={() =>
                    generateDownload(previewCanvasRef.current, completedCrop, clearImage, fileName)
                }
            >
                Upload image
        </button>
        </div>
    );
}

