import { Button } from '@material-ui/core';
import React,{ useState } from 'react';
import firebase from "firebase";
import { storage, db } from "./firebase.js";
import './ImageUpload.css';

function ImageUpload({username}) {
    const [caption,setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);

    const handleChange = (event) => {
        if(event.target.files[0]){
            setImage(event.target.files[0]);
        }
    }

    const handleUpload = () =>{
        const uploadTask = storage.ref(`image/${image.name}`).put(image);

        uploadTask.on(
            "state_change",
            (snapshot) => {
                //  progress function ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) =>{
                //  error function ...
                console.log(error);
                alert(error.message);
            },
            () => {
                //  complete function ...
                storage
                .ref("image")
                .child(image.name)
                .getDownloadURL()
                .then(url =>{
                    //  post image inside db
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username,
                    });
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                });
            }
        )
    }

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max ="100" />
            <input type="text" placeholder="Enter A Caption.." onChange={event => setCaption(event.target.value)} value={caption}/>
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
