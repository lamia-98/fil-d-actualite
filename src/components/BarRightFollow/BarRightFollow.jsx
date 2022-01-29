// import React, {useEffect, useState} from 'react'
// import UserItemFollow from '../UserItem/UserItemFollow'
// import './BarRightFollow.css'

// import { query, collection,where, onSnapshot, limit} from "firebase/firestore";
// import { db} from "../../firebase/firebase";
// import {useStateValue} from '../../contexts/StateContextProvider'

// const BarRightFollow = () => {
//    const [{user}] = useStateValue()
//    const [users, setUsers] = useState([])
//    const[array,setarray]=useState([])

//    useEffect(() => {
//       let mounted = true 
//       const j = query(collection(db,"users"),where("followers","array-contains",user.id))
//       onSnapshot(j,snapshot=>{
//          setarray(snapshot.docs.map(user=>({
//             id:user.id,
//             ...user.data
//          })))
//       })
//       const q =query(collection(db,"users"),where("follwers", "!=", user.id), limit(5));
//       onSnapshot(q,snapshot=>{
//          if(mounted){
//             setUsers(snapshot.docs.map(user=>({
//                id:user.id,
//                ...user.data()
//             })))
//          }
//       })

//       return () => mounted = false
//    }, [])

//     return (
//            <div className="barRight__barRightContainer">
//               <h2>Who to follow</h2>

//               <ul className='barRight__trendsContainer'>

//               {
//                  users && users.filter(u=> u.id!==user.id).map(user=> {
//                     return <li key={user.id}><UserItemFollow display={user}/></li>
//                  })
//               }
//               </ul>


//            </div>

//     )
// }

// export default BarRightFollow

import React, {useEffect, useState} from 'react'
import UserItemFollow from '../UserItem/UserItemFollow'
import './BarRightFollow.css'

import { query, collection,where, onSnapshot, limit} from "firebase/firestore";
import { db} from "../../firebase/firebase";
import {useStateValue} from '../../contexts/StateContextProvider'

const BarRightFollow = () => {
   const [{user}] = useStateValue()
   const [users, setUsers] = useState([])
   const[array,setarray]=useState([])

   useEffect(() => {
      let mounted = true 
    
      const q =query(collection(db,"users"),limit(20));
      onSnapshot(q,snapshot=>{
         if(mounted){
            setUsers(snapshot.docs.map(user=>({
               id:user.id,
               ...user.data()
            })))
         }
      })

      return () => mounted = false
   }, [])
 console.log(users)
 console.log(array)
    return (
           <div className="barRight__barRightContainer">
              <h2>Who to follow</h2>

              <ul className='barRight__trendsContainer'>

              {
                 users && users.filter(u=> u.id!==user.id && !u.followers.includes(user.id)).slice(0,5).map(user=> {
                    return <li key={user.id}><UserItemFollow display={user}/></li>
                 })
              }
              </ul>


           </div>

    )
}

export default BarRightFollow