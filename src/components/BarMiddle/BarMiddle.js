import React, {useState, useEffect} from 'react'
import NoctuaBox from '../NoctuaBox/NoctuaBox'
import Post from '../Post/Post'
import Retweet from '../Retweet/Retweet'

import { db} from "../../firebase/firebase";
import { getDoc,getDocs, doc,orderBy,collection,query,onSnapshot} from "firebase/firestore";
import {Avatar} from '@material-ui/core'
import Loader from '../../elements/Loader/Loader'
import './BarMiddle.css'

import {useStateValue} from '../../contexts/StateContextProvider'

const BarMiddle = () => {
    const [{user}] = useStateValue()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState(null)
    const [following, setFollowing] = useState([])
    //  const [itretweet, setItretweet] = useState(false)

    const [retweets, setRetweets] = useState([])
    useEffect(() => {
      let mounted = true
      getDoc(doc(db,'users', user.id)).then((docSnap)=>{
         if(docSnap.exists){
         if (mounted) {
            setProfile(docSnap.data())
            //setFollowing(docSnap.data() && docSnap.data().following)
         }
      }
      })
      return () => mounted = false
    }, [])

    

    useEffect(() => {
        const postsCollectionRef = collection(db, 'posts')
        const q = query(postsCollectionRef,orderBy('createdAt', 'desc'))

        const unsub = onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})) )
        })
        return unsub
    }, [])
    console.log(posts)

   //  useEffect(() => {
   //    let mounted = true
   //    db.collection('users').doc(user.id).onSnapshot(snapshot=>{
   //       if (mounted) {
   //          setProfile(snapshot.data())
   //          setFollowing(snapshot.data() && snapshot.data().following)
   //       }
   //    })
   //    return () => mounted = false
   //  }, [])

   //  useEffect(() => {
   //       let mounted = true
   //       setLoading(true)
   //       if(following){
   //          db.collection('posts')
   //          .where('senderId', 'in', [user.id,...following])
   //          .orderBy('timestamp', 'desc')
   //          .onSnapshot(snapshot=>{
   //             if(mounted){
   //                if(snapshot.empty){
   //                   setLoading(false)
   //                   return
   //                }
   //                   setPosts(snapshot.docs.map(doc=> ({id:doc.id, ...doc.data()})))
   //                   setLoading(false)
   //             }
   //          }, error=>{
   //             console.log(error)
   //          })
   //       } else {
   //       db.collection('posts')
   //       .where('senderId', 'in', [user.id])
   //       .orderBy('timestamp', 'desc')
   //       .onSnapshot(snapshot=>{
   //          if(mounted){
   //             if(snapshot.empty){
   //                setLoading(false)
   //                return
   //             }
   //                setPosts(snapshot.docs.map(doc=> ({id:doc.id, ...doc.data()})))
   //                setLoading(false)
   //          }
   //       }, error=>{
   //          console.log(error)
   //       }) 
   //    }

   //    return () => mounted = false

   //  }, [following])
 
    return (
        <div className='BarMiddle'>
           <div className="BarMiddle__header">
              <div className="BarMiddle__header-ava">
                 <Avatar src={profile && profile.photoURL}/>
              </div>
              <h2>Home</h2>          
           </div>
           
           <NoctuaBox/>

           { loading && <div className="BarMiddle__loader"><Loader/></div> }

             {
            posts.map(post => (
                //itretweet==
                ( (post.itretweet) ?
                <Retweet key={post.id}
                postId = {post.id}
                altText = {post.altText}
                senderId = {post.senderId}
                username = {post.username}
                text = {post.text}
                avatar = {post.avatar}
                image = {post.image}
                timestamp = {post.timestamp}
                likes = {post.likes}
                retphotourl= {post.retphotourl}
                retweeter= {post.retweeter}
    /> 
            :
            <Post key={post.id}
                        postId = {post.id}
                        altText = {post.altText}
                        senderId = {post.senderId}
                        username = {post.username}
                        text = {post.text}
                        avatar = {post.avatar}
                        image = {post.image}
                        timestamp = {post.timestamp}
                        likes = {post.likes}
            />
            
            )))
        }            
            
        </div>
    )
}

export default BarMiddle
