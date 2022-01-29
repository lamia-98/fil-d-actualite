import React, {useState, useEffect} from 'react'
import {useHistory, useParams} from 'react-router'
// import Posts from '../Posts/Posts'
import TabbarMenu from '../../elements/TabbarMenu/TabbarMenu'
import ProfileTheme from '../ProfileTheme/ProfileTheme'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined'
import Loader from '../../elements/Loader/Loader'


import {collection,query, where,onSnapshot, orderBy} from "firebase/firestore";
import { db} from "../../firebase/firebase"
import '../BarMiddle/BarMiddle.css'

const BarMiddle = () => {
    const {username} = useParams()  
    const history = useHistory()    
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const initProfile={
        bio:'',
        displayName:'', 
        followers:[], 
        following:[], 
        id: '', 
        location: '', 
        photoURL: '', 
        username: '', 
        wallpaper: '', 
        website: ''      
    }
    const [profile, setProfile] = useState(initProfile)

    useEffect(() => {
      const q = query(collection(db,'users'), where('username', '==', username));
      onSnapshot(q, snapshot=>{
      setProfile(snapshot.docs.map(doc=>({
        id: doc.id,
        ...doc.data()
      }))[0])
    })

  }, [username])

    useEffect(() => {
      setLoading(true)

      if(profile){
        const q = query(collection(db,'posts'), where('senderId', '==', profile.id), orderBy('timestamp', 'desc'))
        onSnapshot(q,snapshot=> {
          setPosts(snapshot.docs.map(doc => ({id:doc.id, ...doc.data()})))
          setLoading(false)
        })
      }
    }, [profile])

    const items = [
        {
            id: 0,
            title:'Noctua',
            item: <>
                    { loading && <div className="BarMiddle__loader"><Loader/></div> } 
                  
                  </>
        },
        {
            id: 1,
            title: 'Noctua & replies',
            item: <>  { loading && <div className="BarMiddle__loader"><Loader/></div> } </>
        },
        {
            id: 2,
            title: 'Media',
            item: <>
                    { loading && <div className="BarMiddle__loader"><Loader/></div> } 
                    {/* <Posts  posts={posts.filter(post=>post.image.length>0)} /> */}
                  </>
        },        
        {
            id: 3,
            title: 'Likes',
            item: <> { loading && <div className="BarMiddle__loader"><Loader/></div> } </>
        }
    ]

    return (
        <div className='BarMiddle'>
           <div className="profile__header">
              <div className="profile__backArrow" onClick={()=>history.goBack()}>
                 <ArrowBackOutlinedIcon />
              </div>
              <div className='profile__title'>
                <div className='profile__title_title'><h2>{profile && profile.displayName}</h2><CheckCircleIcon /></div>        
                {/* <span>{posts && posts.length} noctua</span> */}
              </div>
           </div>

           <ProfileTheme profile={profile} />

           <TabbarMenu items={items}/>

        </div>
    )
}

export default BarMiddle
