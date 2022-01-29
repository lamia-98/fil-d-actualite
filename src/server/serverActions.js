import {doc, updateDoc, arrayUnion, arrayRemove,deleteDoc,addDoc,collection,getDoc,increment} from 'firebase/firestore'
import { db,auth} from "../firebase/firebase";
export const follow = async (userId, followId) => {
   
    const userRef = doc(db,"users", userId )
    const followRef = doc(db,'users', followId)

    await updateDoc(userRef, {
        following:arrayUnion(followId)
    });

    await updateDoc (followRef, {
        followers:arrayUnion(userId)
    });
}

export const unfollow =  async (userId, followId) => {
    const userRef = doc(db,'users',  userId)
    const followRef = doc(db, 'users', followId)

   await updateDoc(userRef,{
        following:arrayRemove(followId)
    });

    await updateDoc(followRef,{
        followers: arrayRemove(userId)
    });
}


export const deletePost = async (postId) => { 
    const docRef = doc(db, 'posts', postId)

    await deleteDoc(docRef)
    
    await updateDoc(docRef, {
        retweets: increment(-1)})

}

export const like = async (postId, userId) => {
    const postRef = doc(db,'posts', postId)
   await updateDoc(postRef, {
        likes: arrayUnion(userId)
    })
}

export const unlike = async (postId, userId) => {
    const postRef = doc(db,'posts', postId)
   await updateDoc(postRef,{
        likes:arrayRemove(userId)
    })
}

export const likeComment = async (commentId, postId,userId) => {
    const postRef = doc(db, 'posts', postId,'comments',commentId)
   await updateDoc(postRef, {
        likes: arrayUnion(userId)
    })
}

export const unlikeComment = async (commentId, postId,userId) => {
    const postRef = doc(db, 'posts', postId,'comments',commentId)
   await updateDoc(postRef, {
        likes: arrayRemove(userId)
    })
}

export const editPost = async (postId) => { 
    const text = prompt("Entre your new Text") // à changer par la suite par un modal par exemple 
    const docRef = doc(db, 'posts', postId)
    const payload = {
        text: text
    }
    await updateDoc(docRef, payload)
  }

  export const deleteComment = async (commentId,postId) => { 
      console.log(commentId)
    const docRef = doc(db, 'posts', postId,'comments',commentId)
const docRef1 = doc(db, 'posts', postId)
    await deleteDoc(docRef)
    await updateDoc(docRef, {
        comments: increment(-1)})

}
export const retweet = async (postId) => {              
    const docRef = doc(db, 'posts',postId)     
          console.log(postId)          
             await getDoc(docRef).then((postData) => {      
         const data = postData.data(); 
         if(data.image)  {   
         addDoc(collection(db, 'posts'), {     
         retweeter:"smail",
         image:data.image,   
         text:data.text,              
         likes:0,                   
         comments:0,                            
         retphotourl:"",  
         itretweet: true,                
         createdAt:new Date()                                                                                               
        } )   
    }else {
        addDoc(collection(db, 'posts'), {     
            retweeter:"smail",   
            text:data.text,              
            likes:0,                   
            comments:0,                            
            retphotourl:"",  
            itretweet: true,                
            createdAt:new Date()                                                                                               
           } )  
    }
      });                                    
                                 
     
      await updateDoc(docRef, {
        retweets: increment(1)})

}