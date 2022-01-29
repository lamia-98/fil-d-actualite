import React,{useState,useEffect,forwardRef} from 'react';
import { useParams } from "react-router-dom";
import Post from '../Post/Post'


import {Avatar} from '@material-ui/core'
import Reply from '../Reply/Reply'
import BarRight from "../BarRight/BarRight";

import Comment from '../Comment/Comment'
import FooterIcon from '../Post/FooterIcon';
import Like from '../Post/Like'
import {like, unlike, follow, unfollow, deletePost,editPost} from '../../server/serverActions'
import Modal from '../../elements/Modal/Modal'
import Popover from '@material-ui/core/Popover'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import RepeatIcon from '@material-ui/icons/Repeat'
import PublishIcon from '@material-ui/icons/Publish'
import PlaceIcon from '@material-ui/icons/Place'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline' 
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIcon from '@material-ui/icons/ArrowLeft';
import { useHistory } from "react-router-dom";
import '../Post/Post.css';
import { db } from '../../firebase/firebase'
import { doc,collection,updateDoc, deleteDoc,getDocs, query, orderBy,onSnapshot } from 'firebase/firestore';
import { Button, Dialog, DialogActions, DialogContent, TextareaAutosize, DialogTitle } from '@material-ui/core';
import FlipMove from 'react-flip-move'

const PostPage = forwardRef(({
    altText,
                  text,
                  image,
                  timestamp,
                  senderId,
                  
                  likes
    
}, ref) => {  
    const [post, setPost] = useState([]);
    const { postId } = useParams();
console.log(postId)
    const history = useHistory();

const [anchorEl, setAnchorEl] = useState(null)
const onClickExpand= (event) => setAnchorEl(event.currentTarget)
const handleClose = () => setAnchorEl(null)
const open = Boolean(anchorEl)
const popoverId = open ? 'post-popover' : undefined
const [isOpenModal, setIsOpenModal] = useState(false)

const [Showreply, setShowreply] = useState(false);
const [profile, setProfile] = useState({displayName:'', photoURL: '', verified: true, username: '', followers:[], following:[]})
const {displayName, username,photoURL, verified} = profile
const [comments, setComments] = useState([]);



const [noctuaEditMessage, setNoctuaEditMessage] = useState("");
// start edit modal
const [openEditModal, setOpenEditModal] = React.useState(false);
const handleOpenEditModal = () => {
  setOpenEditModal(true);
  handleClose();
}
const handleCloseEditModal = () => {
  setOpenEditModal(false);
  handleClose();
}
const handleEdit = () => {
  editPost(postId)
  handleCloseEditModal()
}
// end edit modal
// start edit function 
const editPost = async (postId) => {  
  const docRef = doc(db, 'posts', postId)
  const payload = {
      text: noctuaEditMessage
  }
  await updateDoc(docRef, payload)
}
// end edit function
useEffect(() => 
onSnapshot(doc(db,"posts",postId),(snapshot)=> {
    setPost(snapshot.data());
}),[db.postId]);
    console.log(post)
    useEffect(() => {
        const postsCollectionRef = collection(db, 'posts', postId,"comments")
        const q = query(postsCollectionRef, orderBy('createdAt', 'desc'))

        const unsub = onSnapshot(q, (snapshot) => {
            setComments(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})) )
        })
        return unsub
    }, [db,postId])
    console.log(comments)
    
   
const callbackForModal = () => {}
    return (
       

           <> 
           <div className='BarMiddle'>
           <div className='BarMiddle__header'>
        <div className='BarMiddle__header-ava'>
        
        </div>
        <div
              className="post__headerExpandIcon"
              onClick={() =>
                history.push(`/`)}
            >
              < ArrowBackIcon />
            </div>
         <h2>Home</h2>
        </div>

           <Modal  
            open={isOpenModal} 
            onClose={()=>setIsOpenModal(false)}
            title=""
            callback = {callbackForModal}
            ButtonText=''
         >
              <Reply props={{
                  altText,
                  text,
                  image,
                  postId
                  
               }}

               profile={profile} 

               /> 
              

              
         </Modal>
        
        <div className="post" ref={ref}>
        <div className="post__avatar">
            <Avatar src={post.photoURL} />
        </div>   
          <div className="post__body" >
              <div className="post__header">
                  <div className="post__headerText">
                      <h3>{post.displayName}{' '}
                          <span className='post__headerSpecial'>
                          {post.verified && <VerifiedUserIcon className='post__badge'/>} 
                              @{`${post.username}`}
                          </span>
                      </h3>
                      <div className="post__headerExpandIcon" aria-describedby={popoverId} variant="contained" onClick={onClickExpand }>
                        <MoreHorizIcon /> 
                      </div>

                      <Popover 
                        id={popoverId}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                           vertical: 'top',
                           horizontal: 'right',
                        }}
                        transformOrigin={{
                           vertical: 'top',
                           horizontal: 'right',
                        }}
                     >
         <ul className="post__expandList">
            <li onClick={handleOpenEditModal}> 
             <div><EditIcon/></div><h3>Edit post</h3>
            </li>
            <li> 
             <div><PlaceIcon /></div><h3>Pin to your  profile</h3>
            </li>
            </ul> 
            </Popover>
             {/* Start Edit Modal*/}
             <div>
                <Dialog open={openEditModal} onClose={handleCloseEditModal}>
                  <DialogTitle>Edit Post</DialogTitle>
                  <DialogContent>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="What's happing..."
                    style={{ width: 200 }}
                    onChange={e=> setNoctuaEditMessage(e.target.value)}
                  />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseEditModal}>Cancel</Button>
                    <Button onClick={handleEdit}>Edit</Button>
                  </DialogActions>
                </Dialog>
              </div>
            {/* End Edit Modal*/}
                  </div>
                  
                  <div className="post__headerDescription" >
                      <p>{post.text}</p>
                  </div>
                 <img src={post.image} alt={post.altText} onClick='' />
                 </div>
                 <div className="post__footer">
                     <FooterIcon  Icon={ChatBubbleOutlineIcon} onClick={()=>setIsOpenModal(true)}  /><span className='commentsNumber'>{comments.length}</span>
                     <FooterIcon  Icon={RepeatIcon} />
                     <Like id={postId} />
                     <FooterIcon  Icon={PublishIcon}/>
                 </div>
                 <div >
          
                 </div>
           
          </div>
        
            
          </div>
         
        
          <FlipMove>
          {comments.map((comment) => (
        
        <Comment key={comment.id}
        commentId={comment.id}
        postId = {comment.post}
        commentAltText = {comment.commentAltText}
        senderId = {comment.senderId}
        username = {comment.username}
        text = {comment.text}
        avatar = {comment.avatar}
        commentimage = {comment.commentimage}
        timestamp = {comment.timestamp}
        likes = {comment.likes}
/>
        ))}
          </FlipMove>
         
          
          </div>
          <BarRight/>
           </>

             )
            }
            )

export default PostPage