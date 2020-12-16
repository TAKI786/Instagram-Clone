import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db,auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload.js';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setposts] = useState([]);
  const [open, setopen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [openSignIn, setOpenSignIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
   const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        // User has LoggedIn..
        console.log(authUser);
        setUser(authUser);

        // if(authUser.displayName){
        //   // dont update username
        // } else{
        //   // if we just created someone...
        //   return authUser.updateProfile({
        //     displayName:username,
        //   });
        // }

      }
      else{
        // User Has LoggedOut..
        setUser(null);
      }
    })
    return () =>{
      // Perform some cleanup function
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() =>{
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot =>{
      // every time a new thing is added, this code is fires....
      setposts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  },[]);

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser)=>{
     return authUser.user.updateProfile({
        displayName: username
      });
    })
    .catch((error) => alert(error.message));
    setopen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

  setOpenSignIn(false);  

  }


  return (
    <div className="app">

      <Modal
        open={open}
        onClose={()=> setopen(false)}
      >
    <div style={modalStyle} className={classes.paper}>

      <form className="app__signup">
        <center>
        <img
            className="app__headerImage"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/640px-Instagram_logo.svg.png"
            alt=""
            />
        </center>
        <Input
          placeholder = "Username"
          type = "text"
          value = {username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          placeholder = "email"
          type = "text"
          value = {email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder = "password"
          type = "password"
          value = {password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" onClick={signUp}>Sign Up</Button>
      </form>

      
    </div>
      </Modal>

      {/* Modal 2nd */}

      <Modal
        open={openSignIn}
        onClose={()=> setOpenSignIn(false)}
      >
    <div style={modalStyle} className={classes.paper}>

      <form className="app__signup">
        <center>
        <img
            className="app__headerImage"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/640px-Instagram_logo.svg.png"
            alt=""
            />
        </center>

        <Input
          placeholder = "email"
          type = "text"
          value = {email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder = "password"
          type = "password"
          value = {password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" onClick={signIn}>Sign In</Button>
      </form>

      
    </div>
      </Modal>


      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/640px-Instagram_logo.svg.png"
          alt=""
          />
        {user?.displayName? (
          <div className="app__loginContainer">
            <a href="https://hbtu.ac.in/">{user.displayName}</a>      {/* // have to change it ... */}
            <Button onClick={() => auth.signOut()}> Logout</Button>
          </div>
         ):(
        <div className="app__loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setopen(true)}>Sign Up</Button>
        </div>
      )}
      </div> 

      <div className="app__post">
          {
           posts.map(({id, post}) =>(
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          } 
      </div>   
 
      
    <div className="bottom">
      {user?.displayName ?(
        <ImageUpload username={user.displayName}/>
      ): (
        <h3 className="sorry">Sorry !!! You need to Login to Upload</h3>
      )}
    </div>
  
  </div>
    
  );
}

export default App;
